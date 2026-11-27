import { verifierDiagramme } from "./diagramme";
import type { Contenu } from "./schemas";

/** Les règles du build. Renvoie la liste des erreurs, en français, vide si le contenu est valide. */
export function verifierContenu(c: Contenu): string[] {
  const erreurs: string[] = [];
  const err = (regle: number, message: string) => erreurs.push(`Règle ${regle} : ${message}`);
  const doublons = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

  // 1. Ids uniques ; toute référence existe.
  for (const [nom, ids] of [
    ["domaines", c.domaines.map((d) => d.id)],
    ["compétences", c.competences.map((x) => x.id)],
    ["fiches", c.fiches.map((f) => f.id)],
    ["technos", c.technos.map((t) => t.id)],
    ["questions d'orientation", c.orientation.questions.map((q) => q.id)],
  ] as const) {
    for (const id of new Set(doublons([...ids]))) err(1, `identifiant en double parmi les ${nom} : « ${id} ».`);
  }
  const domaines = new Set(c.domaines.map((d) => d.id));
  const competences = new Map(c.competences.map((x) => [x.id, x]));
  const fiches = new Map(c.fiches.map((f) => [f.id, f]));
  const technos = new Set(c.technos.map((t) => t.id));

  // 12. Graphe : domaine connu, prérequis existants, pas d'auto-référence, pas de boucle.
  for (const x of c.competences) {
    if (!domaines.has(x.domaine)) err(12, `compétence « ${x.id} » : le domaine « ${x.domaine} » n'existe pas.`);
    for (const p of x.prerequis) {
      if (p === x.id) err(12, `compétence « ${x.id} » : elle est son propre prérequis.`);
      else if (!competences.has(p)) err(12, `compétence « ${x.id} » : le prérequis « ${p} » n'existe pas.`);
    }
  }
  // 15. Diagrammes : références, débordements, chevauchements, texte qui tient dans sa boîte.
  for (const x of c.competences) if (x.diagramme) for (const e of verifierDiagramme(x.diagramme)) err(15, `compétence « ${x.id} » : ${e}`);
  for (const f of c.fiches) if (f.diagramme) for (const e of verifierDiagramme(f.diagramme)) err(15, `fiche « ${f.id} » : ${e}`);
  const etat = new Map<string, 1 | 2>(); // 1 = en cours, 2 = terminé
  const visiter = (id: string, chemin: string[]) => {
    if (etat.get(id) === 2) return;
    if (etat.get(id) === 1) {
      err(12, `boucle de prérequis : ${[...chemin.slice(chemin.indexOf(id)), id].join(" → ")}.`);
      return;
    }
    etat.set(id, 1);
    for (const p of competences.get(id)?.prerequis ?? []) if (competences.has(p) && p !== id) visiter(p, [...chemin, id]);
    etat.set(id, 2);
  };
  for (const x of c.competences) visiter(x.id, []);

  for (const f of c.fiches) {
    for (const t of f.technos) if (!technos.has(t)) err(1, `fiche « ${f.id} » : la techno « ${t} » n'existe pas.`);
    for (const x of f.competences) if (!competences.has(x)) err(1, `fiche « ${f.id} » : la compétence « ${x} » n'existe pas.`);

    // 4. Transposition : réflexe, avant, pas de « pourquoi nouveau » ; nouveauté : l'inverse.
    if (f.genre === "transposition") {
      if (!f.reflexe) err(4, `fiche « ${f.id} » : une transposition a un réflexe à lâcher.`);
      if (f.pourquoiNouveau) err(4, `fiche « ${f.id} » : une transposition n'a pas de « pourquoi nouveau ».`);
      if (!f.avant || !f.resume.avant) err(4, `fiche « ${f.id} » : une transposition a un « avant » et un résumé « avant ».`);
    } else {
      if (f.reflexe) err(4, `fiche « ${f.id} » : une nouveauté n'a pas de réflexe à lâcher.`);
      if (!f.pourquoiNouveau) err(4, `fiche « ${f.id} » : une nouveauté explique pourquoi elle est nouvelle.`);
      if (f.avant || f.resume.avant) err(4, `fiche « ${f.id} » : une nouveauté n'a pas de « avant ».`);
    }

    // 5. Au moins un lien d'approfondissement libre.
    if (!f.plusLoin.some((l) => l.acces === "gratuit" && (l.type === "opensource" || l.type === "doc"))) {
      err(5, `fiche « ${f.id} » : au moins un lien « pour aller plus loin » libre (open source ou documentation gratuite) est attendu.`);
    }

    // 16. Les passages étiquetés « avis d'auteur » existent (champ non vide, puce présente), sans doublon.
    const avis = f.avisAuteur ?? [];
    for (const id of new Set(doublons(avis))) err(16, `fiche « ${f.id} » : « ${id} » est étiqueté deux fois comme avis d'auteur.`);
    for (const a of avis) {
      const [champ, indice] = a.split(".");
      const valeur = (f as unknown as Record<string, unknown>)[champ];
      if (valeur === null || valeur === undefined) err(16, `fiche « ${f.id} » : « ${a} » est étiqueté avis d'auteur mais le champ est vide.`);
      else if (indice !== undefined && Number(indice) >= (valeur as unknown[]).length) err(16, `fiche « ${f.id} » : « ${a} » désigne une puce qui n'existe pas.`);
    }

    // 11. Schéma : une nouveauté n'a pas de schéma « avant », une transposition en a un.
    if (f.genre === "transposition" && !f.schema.avant) err(11, `fiche « ${f.id} » : une transposition a un schéma « avant ».`);
    if (f.genre === "nouveaute" && f.schema.avant) err(11, `fiche « ${f.id} » : une nouveauté n'a pas de schéma « avant ».`);

    // 9. Historique trié du plus récent au plus ancien, première date = date de mise à jour.
    const dates = f.historique.map((h) => h.date);
    if (dates.some((d, i) => i > 0 && d > dates[i - 1])) err(9, `fiche « ${f.id} » : l'historique doit être trié du plus récent au plus ancien.`);
    if (dates[0] !== f.misAJour) err(9, `fiche « ${f.id} » : la première date de l'historique (${dates[0]}) doit égaler « misAJour » (${f.misAJour}).`);
  }

  // 7. Une techno est citée par au moins une fiche.
  const citees = new Set(c.fiches.flatMap((f) => f.technos));
  for (const t of c.technos) if (!citees.has(t.id)) err(7, `la techno « ${t.id} » n'est citée par aucune fiche.`);

  // 13. Orientation : chaque effet référence des compétences et des domaines qui existent, les options d'une question ont des ids uniques.
  for (const q of c.orientation.questions) {
    for (const id of new Set(doublons(q.options.map((o) => o.id)))) err(13, `question « ${q.id} » : option en double « ${id} ».`);
    for (const o of q.options) {
      const e = o.effets;
      for (const [genre, liste] of [["acquis", e.acquis], ["cible", e.cible], ["ecarte", e.ecarte]] as const) {
        for (const id of liste ?? []) if (!competences.has(id)) err(13, `question « ${q.id} », option « ${o.id} » : la compétence « ${id} » (${genre}) n'existe pas.`);
      }
      for (const d of Object.keys(e.domaines ?? {})) if (!domaines.has(d)) err(13, `question « ${q.id} », option « ${o.id} » : le domaine « ${d} » n'existe pas.`);
      for (const id of e.cible ?? []) if ((e.ecarte ?? []).includes(id) || (e.acquis ?? []).includes(id)) err(13, `question « ${q.id} », option « ${o.id} » : « ${id} » est à la fois cible et acquise ou écartée.`);
    }
  }

  // 17. Projet et outils : rôles, catégories et compétences référencés existent.
  const roles = new Set(c.projet.roles.map((r) => r.id));
  for (const id of new Set(doublons(c.projet.phases.map((p) => p.id)))) err(17, `phase du projet en double : « ${id} ».`);
  for (const p of c.projet.phases)
    for (const a of p.activites) {
      for (const r of a.roles) if (!roles.has(r)) err(17, `projet, phase « ${p.id} », activité « ${a.titre} » : le rôle « ${r} » n'existe pas.`);
      for (const x of a.competences) if (!competences.has(x)) err(17, `projet, phase « ${p.id} », activité « ${a.titre} » : la compétence « ${x} » n'existe pas.`);
    }
  for (const id of new Set(doublons(c.outils.outils.map((o) => o.id)))) err(17, `outil en double : « ${id} ».`);
  const categories = new Map(c.outils.categories.map((k) => [k.id, new Set(k.sous_categories.map((s) => s.id))]));
  for (const o of c.outils.outils) {
    if (!categories.get(o.categorie)?.has(o.sousCategorie)) err(17, `outil « ${o.id} » : la catégorie « ${o.categorie} / ${o.sousCategorie} » n'existe pas.`);
    for (const r of o.roles) if (!roles.has(r)) err(17, `outil « ${o.id} » : le rôle « ${r} » n'existe pas dans le projet.`);
    for (const x of o.competences) if (!competences.has(x)) err(17, `outil « ${o.id} » : la compétence « ${x} » n'existe pas.`);
  }

  return erreurs;
}
