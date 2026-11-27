import type { Contenu, Fiche } from "@/contenu/schemas";

/** Jeu de contenu minimal et valide ; chaque test de règle en casse un détail. */
const hist = [{ date: "2026-11-08", changement: "Première version.", par: "Test", lien: null }];
const lien = { type: "doc" as const, nom: "Doc", url: "https://exemple.org/doc", langue: "fr" as const, acces: "gratuit" as const };

export function fiche(id: string, genre: Fiche["genre"] = "transposition", competences: string[] = ["c1"]): Fiche {
  const transposition = genre === "transposition";
  return {
    id,
    genre,
    categorie: "comprendre",
    avant: transposition ? "ancien" : null,
    apres: "nouveau",
    resume: { avant: transposition ? "avant" : null, apres: "après" },
    resteVrai: ["a", "b"],
    change: ["c", "d"],
    reflexe: transposition ? "Un réflexe." : null,
    pourquoiNouveau: transposition ? null : "Parce que.",
    piege: "Un piège.",
    exemple: "Un exemple.",
    epreuve: { cas: "Un cas ?", raisonnement: "Parce que.", source: "Source" },
    schema: { legende: "Légende", avant: transposition ? [{ texte: "A" }, { texte: "B" }] : null, apres: [{ texte: "C" }, { texte: "D" }] },
    competences,
    technos: ["kube"],
    plusLoin: [lien],
    sources: [{ nom: "Source", url: "https://exemple.org/s" }],
    statut: "brouillon",
    misAJour: "2026-11-08",
    historique: hist,
  };
}

const competence = (id: string, prerequis: string[] = []) => ({
  id, titre: `Titre ${id}`, domaine: "d1", niveau: "intermediaire" as const, prerequis, resume: "Résumé.", ressources: [], origine: ["test"], statut: "brouillon" as const,
});

export function contenuValide(): Contenu {
  const fiches = [fiche("f1"), fiche("n1", "nouveaute", ["c2"])];
  return {
    projet: {
      id: "p",
      titre: "Projet",
      resume: "Résumé.",
      contexte: "Contexte.",
      source: "Source.",
      statut: "brouillon",
      roles: [
        { id: "r1", libelle: "Rôle 1", description: "Description." },
        { id: "r2", libelle: "Rôle 2", description: "Description." },
      ],
      phases: [
        {
          id: "ph1",
          titre: "Phase",
          objectif: "Objectif.",
          livrables: ["Livrable"],
          activites: [{ titre: "Activité", roles: ["r1"], competences: ["c2"] }],
          jalon: { titre: "Jalon", criteres: ["Critère"] },
          risques: [],
        },
      ],
    },
    outils: {
      source: "Source.",
      statut: "brouillon",
      categories: [{ id: "k", libelle: "Catégorie", intro: "Intro.", sous_categories: [{ id: "s", libelle: "Sous" }] }],
      outils: [{ id: "o", nom: "Outil", categorie: "k", sousCategorie: "s", url: "https://exemple.org", roles: ["r1"], competences: ["c1"] }],
    },
    contexte: { chiffres: [{ texte: "Un chiffre.", source: { nom: "Source", url: "https://exemple.org" } }], limites: ["Une limite."] },
    domaines: [{ id: "d1", nom: "Domaine" }],
    competences: [competence("c1"), competence("c2", ["c1"]), competence("c3", ["c2"])],
    fiches,
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
