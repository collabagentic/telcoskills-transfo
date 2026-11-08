"use client";

import { useSyncExternalStore } from "react";
import type { Bilan } from "./bilan";

/**
 * Stockage local : une seule clé, « ts:bilan », versionnée. Lu seulement après hydratation : le rendu serveur est l'état vide
 * (getServerSnapshot renvoie null), donc rien ne clignote.
 */
export const CLE = "ts:bilan";
const EVENEMENT = "ts:bilan-change";

export function analyserBilan(brut: string | null): Bilan | null {
  if (!brut) return null;
  try {
    const b = JSON.parse(brut) as Partial<Bilan>;
    if (b?.v !== 1 || typeof b.metier !== "string" || !Array.isArray(b.decoches) || typeof b.fiches !== "object" || b.fiches === null) return null;
    return { v: 1, metier: b.metier, decoches: b.decoches.filter((x) => typeof x === "string"), fiches: b.fiches };
  } catch {
    return null;
  }
}

let dernierBrut: string | null | undefined;
let dernierBilan: Bilan | null = null;

function lireBrut(): string | null {
  try {
    return window.localStorage.getItem(CLE);
  } catch {
    return null;
  }
}

function instantane(): Bilan | null {
  const brut = lireBrut();
  if (brut !== dernierBrut) {
    dernierBrut = brut;
    dernierBilan = analyserBilan(brut);
  }
  return dernierBilan;
}

function abonner(rappel: () => void): () => void {
  window.addEventListener("storage", rappel);
  window.addEventListener(EVENEMENT, rappel);
  return () => {
    window.removeEventListener("storage", rappel);
    window.removeEventListener(EVENEMENT, rappel);
  };
}

/** Le bilan enregistré, ou null (toujours null au rendu serveur et au premier rendu client). */
export function useBilan(): Bilan | null {
  return useSyncExternalStore(abonner, instantane, () => null);
}

export function ecrireBilan(bilan: Bilan): void {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(bilan));
  } catch {
    /* stockage indisponible (navigation privée) : le plan ne sera pas conservé */
  }
  window.dispatchEvent(new Event(EVENEMENT));
}

export function effacerBilan(): void {
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

/** Marque une fiche « lue » ou « vérifiée » (la date du premier événement est conservée). */
export function marquerFiche(id: string, etat: "lu" | "verifie"): void {
  const bilan = analyserBilan(lireBrut());
  if (!bilan) return;
  const actuel = bilan.fiches[id] ?? {};
  const jour = aujourdhui();
  const suivant = etat === "verifie" ? { ...actuel, lu: actuel.lu ?? jour, verifie: actuel.verifie ?? jour } : { ...actuel, lu: actuel.lu ?? jour };
  if (suivant.lu === actuel.lu && suivant.verifie === actuel.verifie) return;
  ecrireBilan({ ...bilan, fiches: { ...bilan.fiches, [id]: suivant } });
}
