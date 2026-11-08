import type { Contenu } from "./schemas";

/** Les règles du build (BACKLOG.md §5). Renvoie la liste des erreurs, en français, vide si le contenu est valide. */
export function verifierContenu(c: Contenu): string[] {
  const erreurs: string[] = [];
  const err = (regle: number, message: string) => erreurs.push(`Règle ${regle} : ${message}`);

  // 1. Ids uniques ; toute référence existe.
  const doublons = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const [nom, ids] of [
    ["métiers", c.metiers.map((m) => m.id)],
    ["fiches", c.fiches.map((f) => f.id)],
    ["questions", c.questions.map((q) => q.id)],
    ["technos", c.technos.map((t) => t.id)],
  ] as const) {
    for (const id of new Set(doublons([...ids]))) err(1, `identifiant en double parmi les ${nom} : « ${id} ».`);
  }
  const idsMetiers = new Set(c.metiers.map((m) => m.id));
  for (const a of c.aVenir) if (idsMetiers.has(a.id)) err(1, `le métier « ${a.id} » est à la fois complet et « à venir ».`);
  const fiches = new Map(c.fiches.map((f) => [f.id, f]));
  const questions = new Map(c.questions.map((q) => [q.id, q]));
  const technos = new Set(c.technos.map((t) => t.id));
  for (const f of c.fiches) {
    for (const q of f.questions) {
      const question = questions.get(q);
      if (!question) err(1, `fiche « ${f.id} » : la question « ${q} » n'existe pas.`);
      else if (question.fiche !== f.id) err(1, `la question « ${q} » est rattachée à « ${question.fiche} », pas à « ${f.id} ».`);
    }
    for (const t of f.technos) if (!technos.has(t)) err(1, `fiche « ${f.id} » : la techno « ${t} » n'existe pas.`);
  }
  for (const q of c.questions) if (!fiches.has(q.fiche)) err(1, `la question « ${q.id} » référence une fiche inconnue : « ${q.fiche} ».`);

  // Un identifiant de savoir-faire est propre à son métier (le bilan ne concerne qu'un métier à la fois).
  for (const m of c.metiers) {
    for (const id of new Set(doublons(m.savoirFaire.map((s) => s.id)))) err(1, `métier « ${m.id} » : identifiant de savoir-faire en double : « ${id} ».`);
  }

  for (const m of c.metiers) {
    // 2. Un savoir-faire « transpose » pointe une transposition ; un « acquis » n'a pas de fiche.
    for (const s of m.savoirFaire) {
      if (s.statut === "acquis" && s.fiche) err(2, `métier « ${m.id} », « ${s.id} » : un savoir-faire acquis n'a pas de fiche.`);
      if (s.statut === "transpose") {
        const f = s.fiche ? fiches.get(s.fiche) : undefined;
        if (!s.fiche) err(2, `métier « ${m.id} », « ${s.id} » : un savoir-faire à transposer doit nommer sa fiche.`);
        else if (!f) err(1, `métier « ${m.id} », « ${s.id} » : la fiche « ${s.fiche} » n'existe pas.`);
        else if (f.genre !== "transposition") err(2, `métier « ${m.id} », « ${s.id} » : la fiche « ${s.fiche} » n'est pas une transposition.`);
      }
    }
    for (const n of m.nouveautes) {
      const f = fiches.get(n);
      if (!f) err(1, `métier « ${m.id} » : la nouveauté « ${n} » n'existe pas.`);
      else if (f.genre !== "nouveaute") err(2, `métier « ${m.id} » : « ${n} » est listée en nouveauté mais n'en est pas une.`);
    }

    // 3. L'ordre est exactement l'ensemble des fiches du métier, sans doublon.
    const attendues = new Set([...m.savoirFaire.flatMap((s) => (s.fiche ? [s.fiche] : [])), ...m.nouveautes]);
    for (const id of new Set(doublons(m.ordre))) err(3, `métier « ${m.id} » : « ${id} » apparaît deux fois dans l'ordre.`);
    for (const id of attendues) if (!m.ordre.includes(id)) err(3, `métier « ${m.id} » : « ${id} » manque dans l'ordre.`);
    for (const id of m.ordre) if (!attendues.has(id)) err(3, `métier « ${m.id} » : « ${id} » est dans l'ordre mais n'est liée à aucun savoir-faire ni nouveauté.`);

    // 8. Entre 8 et 16 savoir-faire, au moins 3 acquis.
    if (m.savoirFaire.length < 8 || m.savoirFaire.length > 16) err(8, `métier « ${m.id} » : ${m.savoirFaire.length} savoir-faire (entre 8 et 16 attendus).`);
    if (m.savoirFaire.filter((s) => s.statut === "acquis").length < 3) err(8, `métier « ${m.id} » : au moins 3 savoir-faire acquis sont attendus.`);
  }

  for (const f of c.fiches) {
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

    // 9. Historique trié du plus récent au plus ancien, première date = date de mise à jour.
    const dates = f.historique.map((h) => h.date);
    if (dates.some((d, i) => i > 0 && d > dates[i - 1])) err(9, `fiche « ${f.id} » : l'historique doit être trié du plus récent au plus ancien.`);
    if (dates[0] !== f.misAJour) err(9, `fiche « ${f.id} » : la première date de l'historique (${dates[0]}) doit égaler « misAJour » (${f.misAJour}).`);
  }

  // 7. Une fiche sert au moins un métier ; une techno est citée par au moins une fiche.
  const utilisees = new Set(c.metiers.flatMap((m) => m.ordre));
  for (const f of c.fiches) if (!utilisees.has(f.id)) err(7, `la fiche « ${f.id} » n'est utilisée par aucun métier.`);
  const citees = new Set(c.fiches.flatMap((f) => f.technos));
  for (const t of c.technos) if (!citees.has(t.id)) err(7, `la techno « ${t.id} » n'est citée par aucune fiche.`);

  return erreurs;
}
