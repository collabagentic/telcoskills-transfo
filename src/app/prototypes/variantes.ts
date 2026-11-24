/** Les variantes de fiche avec un menu à gauche. La fiche actuelle de la branche (menu de 7 étapes, schéma au centre) sert de point de comparaison. */
export const VARIANTES = ["e", "g", "h"] as const;
export type Variante = (typeof VARIANTES)[number];

export const EXEMPLE = "matrice-networkpolicy";

export const NOM_VARIANTE: Record<Variante, { court: string; titre: string; idee: string }> = {
  e: { court: "E", titre: "Menu du domaine, leçon seule", idee: "Toutes les étapes du domaine à gauche, la leçon au centre avec le schéma juste au-dessus du texte. Comme une unité d'un module Microsoft Learn." },
  g: { court: "G", titre: "Menu du domaine, schéma à droite", idee: "Toutes les étapes à gauche, la leçon au centre, le schéma avant/après qui reste en vue à droite et avance avec les phases." },
  h: { court: "H", titre: "Menu du parcours entier", idee: "Tous les domaines à gauche, dépliables, avec leur avancement ; la leçon au centre, le schéma au-dessus du texte. Comme un parcours Microsoft Learn." },
};
