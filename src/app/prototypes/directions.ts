/**
 * Les prototypes retenus : fiches C (schéma d'abord) et D (B et C mêlés), cockpit B (parcours par niveau).
 * A et la fiche B ont été retirés après la relecture de l'auteur.
 */
export const FICHES = ["c", "d"] as const;
export type DirectionFiche = (typeof FICHES)[number];
export const COCKPIT = "b" as const;

export const EXEMPLE = "matrice-networkpolicy";

export const NOM_FICHE: Record<DirectionFiche, { court: string; titre: string; idee: string; inspiration: string }> = {
  c: { court: "C", titre: "Le schéma d'abord", idee: "Le schéma reste en vue et suit le texte : avant, ce qui change, après. Le défilement le fait avancer.", inspiration: "Brilliant" },
  d: { court: "D", titre: "B et C mêlés", idee: "Le schéma de C reste en vue, piloté par les trois phases de B : « Continuer » le fait avancer.", inspiration: "Uxcel + Brilliant" },
};
