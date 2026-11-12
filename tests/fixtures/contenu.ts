import type { Contenu, Fiche, Question } from "@/contenu/schemas";

/** Jeu de contenu minimal et valide ; chaque test de règle en casse un détail. */
const hist = [{ date: "2026-11-08", changement: "Première version.", par: "Test", lien: null }];
const lien = { type: "doc" as const, nom: "Doc", url: "https://exemple.org/doc", langue: "fr" as const, acces: "gratuit" as const };

export function fiche(id: string, genre: Fiche["genre"] = "transposition", competences: string[] = ["c1"]): Fiche {
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
    schema: { legende: "Légende", avant: transposition ? [{ texte: "A" }, { texte: "B" }] : null, apres: [{ texte: "C" }, { texte: "D" }] },
    competences,
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

const competence = (id: string, prerequis: string[] = []) => ({
  id, titre: `Titre ${id}`, domaine: "d1", niveau: "intermediaire" as const, prerequis, resume: "Résumé.", ressources: [], origine: ["test"], statut: "brouillon" as const,
});

export function contenuValide(): Contenu {
  const fiches = [fiche("f1"), fiche("n1", "nouveaute", ["c2"])];
  return {
    contexte: { chiffres: [{ texte: "Un chiffre.", source: { nom: "Source", url: "https://exemple.org" } }], limites: ["Une limite."] },
    domaines: [{ id: "d1", nom: "Domaine" }],
    competences: [competence("c1"), competence("c2", ["c1"]), competence("c3", ["c2"])],
    fiches,
    questions: fiches.flatMap((f) => f.questions.map((q) => question(q, f.id))),
    technos: [{ id: "kube", nom: "Kubernetes", url: "https://kubernetes.io" }],
    orientation: {
      statut: "brouillon",
      questions: ["q1", "q2", "q3", "q4", "q5"].map((id) => ({
        id,
        texte: "Question ?",
        options: [
          { id: "a", libelle: "A", raison: "", effets: { acquis: ["c1"], domaines: { d1: 2 } } },
          { id: "b", libelle: "B", raison: "", effets: { cible: ["c3"] } },
        ],
      })),
    },
  };
}
