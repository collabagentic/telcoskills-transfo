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
    ["questions", c.questions.map((q) => q.id)],
    ["technos", c.technos.map((t) => t.id)],
    ["questions d'orientation", c.orientation.questions.map((q) => q.id)],
  ] as const) {
    for (const id of new Set(doublons([...ids]))) err(1, `identifiant en double parmi les ${nom} : « ${id} ».`);
  }
  const domaines = new Set(c.domaines.map((d) => d.id));
  const competences = new Map(c.competences.map((x) => [x.id, x]));
  const fiches = new Map(c.fiches.map((f) => [f.id, f]));
  const questions = new Map(c.questions.map((q) => [q.id, q]));
  const technos = new Set(c.technos.map((t) => t.id));

  // 12. Graphe : domaine connu, prérequis existants, pas d'auto-référence, pas de boucle.
  for (const x of c.competences) {
    if (!domaines.has(x.domaine)) err(12, `compétence « ${x.id} » : le domaine « ${x.domaine} » n'existe pas.`);
    for (const p of x.prerequis) {
      if (p === x.id) err(12, `compétence « ${x.id} » : elle est son propre prérequis.`);
      else if (!competences.has(p)) err(12, `compétence « ${x.id} » : le prérequis « ${p} » n'existe pas.`);
    }
  }
  // 14. Le schéma de base d'une compétence décrit un mécanisme : pas de colonne « avant ».
  for (const x of c.competences) if (x.schemaBase?.avant) err(14, `compétence « ${x.id} » : le schéma de base n'a pas de colonne « avant ».`);
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
    for (const q of f.questions) {
      const question = questions.get(q);
      if (!question) err(1, `fiche « ${f.id} » : la question « ${q} » n'existe pas.`);
      else if (question.fiche !== f.id) err(1, `la question « ${q} » est rattachée à « ${question.fiche} », pas à « ${f.id} ».`);
    }
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

    // 11. Schéma : une nouveauté n'a pas de schéma « avant », une transposition en a un.
    if (f.genre === "transposition" && !f.schema.avant) err(11, `fiche « ${f.id} » : une transposition a un schéma « avant ».`);
    if (f.genre === "nouveaute" && f.schema.avant) err(11, `fiche « ${f.id} » : une nouveauté n'a pas de schéma « avant ».`);

    // 9. Historique trié du plus récent au plus ancien, première date = date de mise à jour.
    const dates = f.historique.map((h) => h.date);
    if (dates.some((d, i) => i > 0 && d > dates[i - 1])) err(9, `fiche « ${f.id} » : l'historique doit être trié du plus récent au plus ancien.`);
    if (dates[0] !== f.misAJour) err(9, `fiche « ${f.id} » : la première date de l'historique (${dates[0]}) doit égaler « misAJour » (${f.misAJour}).`);
  }
  for (const q of c.questions) if (!fiches.has(q.fiche)) err(1, `la question « ${q.id} » référence une fiche inconnue : « ${q.fiche} ».`);

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

  return erreurs;
}
