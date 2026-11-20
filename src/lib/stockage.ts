"use client";

import { useSyncExternalStore } from "react";
import type { Avancement, Reponses } from "./parcours";

/**
 * Stockage local : une seule clé, « ts:parcours », versionnée. Lu seulement après hydratation : le rendu serveur est l'état vide
 * (getServerSnapshot renvoie null), donc rien ne clignote.
 */
export const CLE = "ts:parcours";
const EVENEMENT = "ts:parcours-change";

export type Parcours = Avancement & {
  v: 2;
  reponses: Reponses;
  /** Compétence choisie comme objectif : le cockpit montre le chemin restant pour l'atteindre. */
  objectif?: string;
};

/** Avant la mise à l'épreuve, une fiche s'appelait « vérifiée » : l'ancien état devient « acquise » sans rien perdre. */
function migrerFiches(brut: unknown): Parcours["fiches"] {
  const sortie: Parcours["fiches"] = {};
  for (const [id, v] of Object.entries(brut as Record<string, { lu?: string; acquis?: string; verifie?: string }>)) {
    const acquis = v?.acquis ?? v?.verifie;
    sortie[id] = { ...(v?.lu ? { lu: v.lu } : {}), ...(acquis ? { acquis } : {}) };
  }
  return sortie;
}

const VIERGE: Parcours = { v: 2, reponses: {}, maitrisees: [], fiches: {} };

export function analyserParcours(brut: string | null): Parcours | null {
  if (!brut) return null;
  try {
    const p = JSON.parse(brut) as Partial<Parcours>;
    if (p?.v !== 2 || typeof p.reponses !== "object" || p.reponses === null || !Array.isArray(p.maitrisees) || typeof p.fiches !== "object" || p.fiches === null) return null;
    return {
      v: 2,
      reponses: Object.fromEntries(Object.entries(p.reponses).filter(([, v]) => typeof v === "string")),
      maitrisees: p.maitrisees.filter((x) => typeof x === "string"),
      fiches: migrerFiches(p.fiches),
      ...(typeof p.objectif === "string" ? { objectif: p.objectif } : {}),
    };
  } catch {
    return null;
  }
}

let dernierBrut: string | null | undefined;
let dernier: Parcours | null = null;

function lireBrut(): string | null {
  try {
    return window.localStorage.getItem(CLE);
  } catch {
    return null;
  }
}

function instantane(): Parcours | null {
  const brut = lireBrut();
  if (brut !== dernierBrut) {
    dernierBrut = brut;
    dernier = analyserParcours(brut);
  }
  return dernier;
}

function abonner(rappel: () => void): () => void {
  window.addEventListener("storage", rappel);
  window.addEventListener(EVENEMENT, rappel);
  return () => {
    window.removeEventListener("storage", rappel);
    window.removeEventListener(EVENEMENT, rappel);
  };
}

/** Le parcours enregistré, ou null (toujours null au rendu serveur et au premier rendu client). */
export function useParcours(): Parcours | null {
  return useSyncExternalStore(abonner, instantane, () => null);
}

function ecrire(p: Parcours): void {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(p));
  } catch {
    /* stockage indisponible (navigation privée) : le parcours ne sera pas conservé */
  }
  window.dispatchEvent(new Event(EVENEMENT));
}

function courant(): Parcours {
  return analyserParcours(lireBrut()) ?? VIERGE;
}

export function effacerParcours(): void {
  try {
    window.localStorage.removeItem(CLE);
  } catch {
    /* rien à faire */
  }
  window.dispatchEvent(new Event(EVENEMENT));
}

export function aujourdhui(): string {
  return new Date().toLocaleDateString("sv-SE");
}

/** Enregistre (ou retire, avec null) la réponse à une question : la feuille de route se recalcule aussitôt. */
export function repondre(question: string, option: string | null): void {
  const p = courant();
  const { [question]: _ancienne, ...reste } = p.reponses;
  ecrire({ ...p, reponses: option ? { ...reste, [question]: option } : reste });
}

export function recommencer(): void {
  const p = courant();
  ecrire({ ...p, reponses: {}, objectif: undefined });
}

/** Marque (ou retire) une compétence comme déjà maîtrisée. */
export function basculerMaitrisee(id: string): void {
  const p = courant();
  ecrire({ ...p, maitrisees: p.maitrisees.includes(id) ? p.maitrisees.filter((x) => x !== id) : [...p.maitrisees, id] });
}

/** Marque une fiche « lue » ou « acquise » (la date du premier événement est conservée). */
export function marquerFiche(id: string, etat: "lu" | "acquis"): void {
  const p = courant();
  const actuel = p.fiches[id] ?? {};
  const jour = aujourdhui();
  const suivant = etat === "acquis" ? { ...actuel, lu: actuel.lu ?? jour, acquis: actuel.acquis ?? jour } : { ...actuel, lu: actuel.lu ?? jour };
  if (suivant.lu === actuel.lu && suivant.acquis === actuel.acquis) return;
  ecrire({ ...p, fiches: { ...p.fiches, [id]: suivant } });
}

/** Choisit (ou retire, avec null) la compétence objectif. */
export function definirObjectif(id: string | null): void {
  const { objectif: _ancien, ...reste } = courant();
  ecrire(id ? { ...reste, objectif: id } : reste);
}
