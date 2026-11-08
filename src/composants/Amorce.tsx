"use client";

import { useEffect, useState } from "react";

export type PaireAmorce = { avant: string; apres: string };

/**
 * La phrase d'accueil fait la démonstration : « Votre <matrice de flux>, version <NetworkPolicy>. »
 * Rotation lente (6 s), en pause au survol et au focus ; une seule phrase fixe si l'utilisateur demande moins de mouvement.
 * La hauteur est réservée (min-height) : aucun décalage de mise en page.
 */
export function Amorce({ paires }: { paires: PaireAmorce[] }) {
  const [indice, setIndice] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (paires.length < 2 || pause) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const minuteur = window.setInterval(() => setIndice((i) => (i + 1) % paires.length), 6000);
    return () => window.clearInterval(minuteur);
  }, [paires.length, pause]);

  const courante = paires[indice] ?? paires[0];
  if (!courante) return null;
  return (
    <h1
      className="amorce"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={() => setPause(false)}
    >
      <span key={indice} className="amorce-phrase" style={{ display: "block" }}>
        Votre <span className="amorce-avant">{courante.avant}</span>,<br />
        version <span className="amorce-apres">{courante.apres}</span>.
      </span>
    </h1>
  );
}
