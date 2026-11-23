/** Les trois directions de prototype. */
export const DIRECTIONS = ["a", "b", "c"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const NOM_DIRECTION: Record<Direction, { court: string; titre: string; idee: string; inspiration: string }> = {
  a: { court: "A", titre: "La leçon qui défile", idee: "Une seule colonne de lecture, un sommaire qui suit, les outils à droite.", inspiration: "Vercel Academy" },
  b: { court: "B", titre: "Le parcours par phases", idee: "Comprendre, voir, pratiquer : une phase à la fois, avec la barre de progression.", inspiration: "Uxcel" },
  c: { court: "C", titre: "Le schéma d'abord", idee: "Le schéma reste en vue et suit le texte : avant, ce qui change, après.", inspiration: "Brilliant" },
};
