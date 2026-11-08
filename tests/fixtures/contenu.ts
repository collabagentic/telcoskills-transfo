import type { Contenu, Fiche, Metier, Question } from "@/contenu/schemas";

/** Jeu de contenu minimal et valide ; chaque test de règle en casse un détail. */
const hist = [{ date: "2026-11-08", changement: "Première version.", par: "Test", lien: null }];
const lien = { type: "doc" as const, nom: "Doc", url: "https://exemple.org/doc", langue: "fr" as const, acces: "gratuit" as const };

export function fiche(id: string, genre: Fiche["genre"] = "transposition"): Fiche {
  const transposition = genre === "transposition";
  return {
    id,
    genre,
    avant: transposition ? "ancien" : null,
    apres: "nouveau",
    resume: { avant: transposition ? "avant" : null, apres: "après" },
    resteVrai: ["a", "b"],
    change: ["c", "d"],
    reflexe: transposition ? "Un réflexe." : null,
    pourquoiNouveau: transposition ? null : "Parce que.",
    piege: "Un piège.",
    exemple: "Un exemple.",
    technos: ["kube"],
    questions: [`q-${id}-1`, `q-${id}-2`],
    plusLoin: [lien],
    sources: [{ nom: "Source", url: "https://exemple.org/s" }],
    statut: "brouillon",
    misAJour: "2026-11-08",
    historique: hist,
  };
}

export function question(id: string, ficheId: string): Question {
  return { id, fiche: ficheId, enonce: "Question ?", options: ["a", "b"], bonne: 0, explication: "Parce que.", source: "Source", statut: "brouillon" };
}

export function contenuValide(): Contenu {
  const transpositions = ["f1", "f2", "f3", "f4", "f5"];
  const fiches = [...transpositions.map((id) => fiche(id)), fiche("n1", "nouveaute")];
  const metier: Metier = {
    id: "m1",
    nom: "Métier",
    accroche: "Mots-clés",
    amorce: "Votre X, version Y.",
    portrait: "Portrait.",
    savoirFaire: [
      ...transpositions.map((f, i) => ({ id: `sf${i}`, texte: `Je fais ${i}`, statut: "transpose" as const, fiche: f })),
      { id: "sa1", texte: "Acquis 1", statut: "acquis" as const },
      { id: "sa2", texte: "Acquis 2", statut: "acquis" as const },
      { id: "sa3", texte: "Acquis 3", statut: "acquis" as const },
    ],
    nouveautes: ["n1"],
    ordre: [...transpositions, "n1"],
    sources: [{ nom: "Source", url: "https://exemple.org/s" }],
    statut: "brouillon",
  };
  return {
    metiers: [metier],
    fiches,
    questions: fiches.flatMap((f) => f.questions.map((q) => question(q, f.id))),
    technos: [{ id: "kube", nom: "Kubernetes", url: "https://kubernetes.io" }],
    aVenir: [],
  };
}
