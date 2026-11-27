import type { Contenu } from "./schemas";

/** Où une compétence sert dans le projet fil rouge : la phase (numérotée à partir de 1), l'activité et les rôles qui la mobilisent. */
export type Usage = { numero: number; phase: string; titrePhase: string; activite: string; roles: string[] };

/** Pour chaque compétence, ses usages dans le projet, dans l'ordre des phases. */
export function usagesProjet(c: Pick<Contenu, "projet">): Map<string, Usage[]> {
  const usages = new Map<string, Usage[]>();
  c.projet.phases.forEach((p, i) => {
    for (const a of p.activites)
      for (const id of a.competences) usages.set(id, [...(usages.get(id) ?? []), { numero: i + 1, phase: p.id, titrePhase: p.titre, activite: a.titre, roles: a.roles }]);
  });
  return usages;
}

/** Le « pourquoi » court d'une étape : la première activité du projet qui la mobilise. */
export function raisonProjet(u: Usage | undefined): string | undefined {
  return u ? `sert en phase ${u.numero} du projet, « ${u.activite} »` : undefined;
}
