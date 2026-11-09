"use client";

import { useEffect, useState } from "react";

/**
 * Bouton flottant « Ressources en bas de page » : il indique où sont les ressources, y mène d'un clic,
 * et disparaît dès que la personne a fait défiler la page jusqu'à elles (ou est déjà tout en bas).
 */
export function BoutonRessources({ cible, libelle = "Ressources en bas de page" }: { cible: string; libelle?: string }) {
  const [vu, setVu] = useState(false);

  useEffect(() => {
    const el = document.getElementById(cible);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((entrees) => {
      if (entrees.some((e) => e.isIntersecting)) {
        setVu(true);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [cible]);

  if (vu) return null;
  return (
    <button
      type="button"
      className="bouton-ressources no-print"
      onClick={() => {
        const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById(cible)?.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
      }}
    >
      {libelle} <span aria-hidden="true">↓</span>
    </button>
  );
}
