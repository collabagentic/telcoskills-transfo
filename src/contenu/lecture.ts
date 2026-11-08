import type { Fiche, Question } from "./schemas";

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

/** Mélange déterministe (graine = chaîne) : même ordre au rendu serveur et à l'hydratation. */
export function melanger<T>(elements: T[], graine: string): T[] {
  let h = 2166136261;
  for (const c of graine) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const alea = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  const sortie = [...elements];
  for (let i = sortie.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    [sortie[i], sortie[j]] = [sortie[j], sortie[i]];
  }
  return sortie;
}

export type QuestionMelangee = { id: string; enonce: string; options: { texte: string; juste: boolean }[]; explication: string; source: string };

export function preparerQuestion(q: Question): QuestionMelangee {
  const options = q.options.map((texte, i) => ({ texte, juste: i === q.bonne }));
  return { id: q.id, enonce: q.enonce, options: melanger(options, q.fiche + q.id), explication: q.explication, source: q.source };
}
