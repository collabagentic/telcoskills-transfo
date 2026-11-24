import { essentiel, tempsLecture, titreFiche } from "@/contenu/lecture";
import type { Contenu, Diagramme, Fiche, Lien, SchemaFiche, Source } from "@/contenu/schemas";
import { amorces, type EntreePrompt } from "@/lib/prompt";
import { DEPOT } from "@/lib/site";

export type Voisine = { id: string; titre: string; fiches: string[]; courante: boolean };

/** Tout ce qu'une fiche montre, déjà préparé pour un composant (données sérialisables, aucune lecture de fichier côté client). */
export type Lecon = {
  id: string;
  titre: string;
  genre: Fiche["genre"];
  minutes: number;
  brouillon: boolean;
  domaine: string;
  competences: { id: string; titre: string }[];
  technos: { id: string; nom: string }[];
  historique: Fiche["historique"];
  voisines: Voisine[];
  resume: { avant: string | null; apres: string };
  resteVrai: string[];
  change: string[];
  pivot: { libelle: string; texte: string; champ: string };
  piege: string;
  exemple: string;
  schema: SchemaFiche;
  diagramme: Diagramme | null;
  epreuve: Fiche["epreuve"];
  plusLoin: Lien[];
  sources: Source[];
  avis: string[];
  prompt: { entree: EntreePrompt; amorces: string[] };
  signaler: string;
  proposer: string;
};

export function construireLecon(f: Fiche, c: Contenu): Lecon {
  const titre = titreFiche(f);
  const competences = f.competences.map((id) => c.competences.find((x) => x.id === id)!);
  const premiere = competences[0];
  const domaine = c.domaines.find((d) => d.id === premiere?.domaine);
  const voisines = c.competences
    .filter((x) => x.domaine === premiere?.domaine)
    .map((x) => ({ id: x.id, titre: x.titre, fiches: c.fiches.filter((g) => g.competences.includes(x.id)).map((g) => g.id), courante: x.id === premiere?.id }));
  const e = essentiel(f);
  return {
    id: f.id,
    titre,
    genre: f.genre,
    minutes: tempsLecture(f),
    brouillon: f.statut === "brouillon",
    domaine: domaine?.nom ?? "",
    competences: competences.map((x) => ({ id: x.id, titre: x.titre })),
    technos: f.technos.map((t) => ({ id: t, nom: c.technos.find((x) => x.id === t)?.nom ?? t })),
    historique: f.historique,
    voisines,
    resume: { avant: f.resume.avant, apres: f.resume.apres },
    resteVrai: f.resteVrai,
    change: f.change,
    pivot: { libelle: e.pivot.type === "reflexe" ? "Le réflexe à lâcher" : "Pourquoi ça n'existait pas chez vous", texte: e.pivot.texte, champ: e.pivot.type },
    piege: f.piege,
    exemple: f.exemple,
    schema: f.schema,
    diagramme: f.diagramme ?? null,
    epreuve: f.epreuve,
    plusLoin: f.plusLoin,
    sources: f.sources,
    avis: f.avisAuteur ?? [],
    prompt: {
      entree: { categorie: f.categorie, genre: f.genre, avant: f.avant, apres: f.apres, resume: f.resume.apres, reflexe: f.reflexe, competences: competences.map((x) => x.titre) },
      amorces: amorces(f),
    },
    signaler: `https://github.com/${DEPOT}/issues/new?title=${encodeURIComponent(`Erreur dans la fiche « ${titre} »`)}&body=${encodeURIComponent(`Fiche : ${f.id}\nSection concernée : \nCe qui est faux ou manque : \nSource : \n`)}`,
    proposer: `https://github.com/${DEPOT}/edit/main/content/fiches/${f.id}.json`,
  };
}
