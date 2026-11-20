import type { Fiche } from "./schemas";

/** Titre affiché : « Votre X, version Y. » pour une transposition, l'intitulé de la nouveauté sinon. Importable côté client. */
export function titreFiche(f: Pick<Fiche, "genre" | "avant" | "apres">): string {
  return f.genre === "transposition" && f.avant ? `Votre ${f.avant}, version ${f.apres}.` : `${f.apres}.`;
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

