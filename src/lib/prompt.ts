/**
 * Le prompt à copier : un gabarit qui aide l'apprenant à poser une bonne question à l'IA de son choix.
 * Les blancs « [à compléter : …] » sont à remplir par la personne ; le reste vient de la fiche. Fonctions pures.
 */

export type Categorie = "comprendre" | "pratique" | "integrer" | "diagnostiquer" | "decider";

export const CATEGORIES: Record<Categorie, { nom: string; besoin: string; format: string }> = {
  comprendre: {
    nom: "Comprendre",
    besoin: "Je veux comprendre comment ça marche.",
    format: "Réponds dans cet ordre : 1) une analogie avec mon métier, 2) ce qui reste vrai, 3) ce qui change, 4) un exemple télécom, 5) le piège le plus fréquent.",
  },
  pratique: {
    nom: "Changer de pratique",
    besoin: "Je veux savoir comment faire autrement.",
    format: "Réponds dans cet ordre : 1) mon geste actuel, 2) son équivalent ici, pas à pas, 3) les erreurs fréquentes, 4) comment vérifier que c'est bien fait.",
  },
  integrer: {
    nom: "Intégrer",
    besoin: "Je veux le raccorder à ce qui existe.",
    format: "Réponds dans cet ordre : 1) les interfaces et les acteurs en jeu, 2) les contraintes à respecter, 3) un schéma en texte, 4) les points de friction avec l'existant.",
  },
  diagnostiquer: {
    nom: "Diagnostiquer",
    besoin: "Je veux trouver pourquoi ça ne marche pas.",
    format: "Réponds dans cet ordre : 1) les hypothèses, classées de la plus probable à la moins probable, 2) comment vérifier chacune, 3) ce que chaque résultat m'apprend.",
  },
  decider: {
    nom: "Décider",
    besoin: "Je veux choisir et le justifier.",
    format: "Réponds dans cet ordre : 1) les critères de décision, 2) les options et leur coût, 3) ce qui me ferait changer d'avis, 4) les risques.",
  },
};

export type EntreePrompt = {
  categorie: Categorie;
  genre: "transposition" | "nouveaute";
  avant: string | null;
  apres: string;
  resume: string;
  reflexe: string | null;
  competences: string[];
};

const blanc = (texte: string) => `[à compléter : ${texte}]`;

export function construirePrompt(e: EntreePrompt): string {
  const maitrise = e.genre === "transposition" && e.avant ? `votre métier, ex. ${e.avant}` : "ce que vous maîtrisez déjà";
  const croyance = e.reflexe ? `votre modèle actuel, ex. « ${e.reflexe} »` : "votre modèle actuel, même approximatif";
  return [
    `Je suis ${blanc("votre métier")}. Je maîtrise ${blanc(maitrise)}.`,
    `${CATEGORIES[e.categorie].besoin} Sujet : ${e.apres}. ${e.resume}`,
    e.competences.length > 0 ? `Points à couvrir : ${e.competences.join(" ; ")}.` : "",
    `Aujourd'hui je pense que ${blanc(croyance)}. Corrige-moi si c'est faux.`,
    `Ce qui me bloque : ${blanc("une question précise, ou « je ne sais pas par où commencer »")}.`,
    CATEGORIES[e.categorie].format,
    "Si tu n'es pas sûr, dis-le. Appuie-toi sur la documentation officielle et cite-la. N'invente aucune commande ni aucun champ.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

const coupe = (t: string, max: number) => (t.length <= max ? t : `${t.slice(0, max - 1).replace(/\s+\S*$/, "")}…`);

/** Trois questions d'amorce tirées de la fiche : de quoi creuser sans savoir par où commencer. */
export function amorces(e: { apres: string; change: string[]; piege: string }): string[] {
  const phrasePiege = e.piege.split(/(?<=[.!?])\s/)[0] ?? e.piege;
  return [
    `Que veut dire concrètement : « ${coupe(e.change[0].replace(/\.$/, ""), 110)} » ?`,
    `Dans quel cas se fait-on piéger ? (« ${coupe(phrasePiege.replace(/\.$/, ""), 110)} »)`,
    `Quel exemple télécom illustre « ${coupe(e.apres, 60)} » dans mon quotidien ?`,
  ];
}
