"use client";

import { useState } from "react";
import { effacerParcours, useParcours } from "@/lib/stockage";

/** Bouton « Effacer mes données » : supprime la clé locale du navigateur et dit ce qu'elle contenait. */
export function EffacerDonnees() {
  const parcours = useParcours();
  const [efface, setEfface] = useState(false);
  const reponses = parcours ? Object.keys(parcours.reponses).length : 0;
  const fiches = parcours ? Object.keys(parcours.fiches).length : 0;
  const maitrisees = parcours ? parcours.maitrisees.length : 0;

  if (efface) return <p className="retour-question">Vos données sont effacées de ce navigateur.</p>;
  if (!parcours) return <p className="cockpit-texte">Ce navigateur ne contient aucune donnée de ce site.</p>;
  return (
    <div className="couche" style={{ padding: "var(--e-4) var(--e-6)" }}>
      <p>
        Ce navigateur conserve {reponses} réponse{reponses > 1 ? "s" : ""}, {maitrisees} compétence{maitrisees > 1 ? "s" : ""} marquée{maitrisees > 1 ? "s" : ""} maîtrisée{maitrisees > 1 ? "s" : ""} et l'état de {fiches} fiche
        {fiches > 1 ? "s" : ""}.
      </p>
      <div className="corriger">
        <button
          type="button"
          className="btn"
          onClick={() => {
            effacerParcours();
            setEfface(true);
          }}
        >
          Effacer mes données
        </button>
      </div>
    </div>
  );
}
