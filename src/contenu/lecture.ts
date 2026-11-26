import type { Fiche } from "./schemas";

/**
 * Titre affiché : « Votre X, version Y. » (« Vos » quand X commence par un pluriel : « Vos compteurs et alarmes ») pour une transposition,
 * l'intitulé de la nouveauté sinon. Importable côté client.
 */
export function titreFiche(f: Pick<Fiche, "genre" | "avant" | "apres">): string {
  if (f.genre !== "transposition" || !f.avant) return `${f.apres}.`;
  const possessif = /^\S+[sx](\s|$)/.test(f.avant) ? "Vos" : "Votre";
  return `${possessif} ${f.avant}, version ${f.apres}.`;
}

function mots(texte: string): number {
  return texte.split(/\s+/).filter(Boolean).length;
}

/** Temps de lecture en minutes : mots de tous les champs texte ÷ 200, arrondi à la minute supérieure, minimum 2. */
export function tempsLecture(f: Fiche): number {
  const champs = [
    f.avant ?? "",
    f.apres,
    f.resume.avant ?? "",
    f.resume.apres,
    ...f.resteVrai,
    ...f.change,
    f.reflexe ?? "",
    f.pourquoiNouveau ?? "",
    f.piege,
    f.exemple,
  ];
  const total = champs.reduce((n, c) => n + mots(c), 0);
  return Math.max(2, Math.ceil(total / 200));
}

/** Les éléments du bandeau « L'essentiel en 30 secondes », composés uniquement de champs existants de la fiche. */
export type Essentiel = {
  resume: { avant: string | null; apres: string; avis: boolean };
  pivot: { texte: string; avis: boolean; type: "reflexe" | "pourquoiNouveau" };
  changement: { texte: string; avis: boolean };
};

/** Est-ce qu'un passage est marqué « avis d'auteur » (le passage « change.0 » couvre la première puce de change). */
function estAvis(avis: Set<string>, champ: string, indice?: number): boolean {
  return avis.has(champ) || (indice !== undefined && avis.has(champ + "." + indice));
}

/**
 * « L'essentiel en 30 secondes » : resume.avant vers resume.apres, le réflexe à lâcher (transposition) ou le
 * pourquoi-nouveau (nouveauté), et la première puce de change. Les textes sont lus tels quels, jamais réécrits.
 * Importable côté client : fonction pure, aucune lecture de fichier.
 */
export function essentiel(f: Fiche): Essentiel {
  const avis = new Set(f.avisAuteur ?? []);
  const type: "reflexe" | "pourquoiNouveau" = f.genre === "transposition" ? "reflexe" : "pourquoiNouveau";
  const pivot = f.genre === "transposition" ? f.reflexe ?? "" : f.pourquoiNouveau ?? "";
  return {
    resume: { avant: f.resume.avant, apres: f.resume.apres, avis: estAvis(avis, "resume") },
    pivot: { texte: pivot, avis: estAvis(avis, type), type },
    changement: { texte: f.change[0], avis: estAvis(avis, "change", 0) },
  };
}


