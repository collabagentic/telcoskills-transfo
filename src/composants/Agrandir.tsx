"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Affiche le contenu dans la page, et à taille réelle dans une fenêtre sur demande (un schéma réduit à la colonne de lecture devient petit). */
export function Agrandir({ children, libelle = "Agrandir le schéma" }: { children: ReactNode; libelle?: string }) {
  const [ouvert, setOuvert] = useState(false);
  const fenetre = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = fenetre.current;
    if (!d) return;
    if (ouvert && !d.open) d.showModal();
    if (!ouvert && d.open) d.close();
  }, [ouvert]);

  return (
    <>
      {children}
      <button type="button" className="btn agrandir no-print" onClick={() => setOuvert(true)}>
        {libelle}
      </button>
      <dialog ref={fenetre} className="fenetre-schema" aria-label={libelle} onClose={() => setOuvert(false)}>
        {ouvert ? (
          <>
            <button type="button" className="btn fenetre-fermer" onClick={() => setOuvert(false)}>
              Fermer
            </button>
            {children}
          </>
        ) : null}
      </dialog>
    </>
  );
}
