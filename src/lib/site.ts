import { chargerContenu } from "@/contenu/charger";

/** Fiche montrée en exemple sur l'accueil : identifiant lu depuis content/fiches/, jamais recopiée. */
export const FICHE_EXEMPLE = "matrice-networkpolicy";

/** Dépôt du projet (code et contenu). À rendre public à l'ouverture du site. */
export const DEPOT = process.env.NEXT_PUBLIC_DEPOT ?? "taoufikbo/telcoskills-transfo";
export const URL_DEPOT = `https://github.com/${DEPOT}`;
/** Adresse LinkedIn de l'auteur : affichée seulement si elle est fournie (variable d'environnement). */
export const URL_LINKEDIN = process.env.NEXT_PUBLIC_LINKEDIN ?? null;
/** Délai de réponse que l'auteur s'engage à tenir sur un signalement. */
export const DELAI_REPONSE = "sous 7 jours";
const GENERIQUE = "Brouillon assisté par IA";

/** Les chiffres du site, calculés à partir du contenu : jamais écrits à la main. */
export function statistiques() {
  const c = chargerContenu();
  const sources = new Set<string>();
  for (const f of c.fiches) for (const s of f.sources) sources.add(s.url);
  for (const x of c.competences) for (const r of x.ressources) sources.add(r.url);
  const ressources = c.competences.reduce((n, x) => n + x.ressources.length, 0);
  const diagrammes = c.fiches.filter((f) => f.diagramme).length + c.competences.filter((x) => x.diagramme).length;
  const dates = c.fiches.map((f) => f.misAJour).sort();
  return {
    competences: c.competences.length,
    domaines: c.domaines.length,
    fiches: c.fiches.length,
    epreuves: c.fiches.length,
    diagrammes,
    ressources,
    sources: sources.size,
    derniereMiseAJour: dates[dates.length - 1] ?? null,
    relues: c.fiches.filter((f) => f.statut === "relu").length,
  };
}

/** Les contributeurs : seulement les noms présents dans les historiques des fiches (hors rédaction assistée initiale). */
export function contributeurs(): { nom: string; fiches: number }[] {
  const compte = new Map<string, number>();
  for (const f of chargerContenu().fiches) {
    for (const nom of new Set(f.historique.map((h) => h.par))) {
      if (nom !== GENERIQUE && nom !== "un contributeur") compte.set(nom, (compte.get(nom) ?? 0) + 1);
    }
  }
  return [...compte.entries()].map(([nom, fiches]) => ({ nom, fiches })).sort((a, b) => b.fiches - a.fiches || a.nom.localeCompare(b.nom));
}

export function dateLongue(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
