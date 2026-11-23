/** Les directions de prototype (D mêle B et C). */
export const DIRECTIONS = ["a", "b", "c", "d"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const NOM_DIRECTION: Record<Direction, { court: string; titre: string; idee: string; inspiration: string }> = {
  a: { court: "A", titre: "La leçon qui défile", idee: "Une seule colonne de lecture, un sommaire qui suit, les outils à droite.", inspiration: "Vercel Academy" },
  b: { court: "B", titre: "Le parcours par phases", idee: "Comprendre, voir, pratiquer : une phase à la fois, avec la barre de progression.", inspiration: "Uxcel" },
  c: { court: "C", titre: "Le schéma d'abord", idee: "Le schéma reste en vue et suit le texte : avant, ce qui change, après.", inspiration: "Brilliant" },
  d: { court: "D", titre: "B et C mêlés", idee: "Le schéma de C reste en vue, piloté par les phases de B : chaque phase le fait avancer.", inspiration: "Uxcel + Brilliant" },
};
