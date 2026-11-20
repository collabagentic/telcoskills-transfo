"use client";

import { useState } from "react";
import { CATEGORIES, construirePrompt, type EntreePrompt } from "@/lib/prompt";

/** Le prompt à copier pour poser la bonne question à l'IA de son choix, et trois questions d'amorce. */
export function PromptApprendre({ entree, amorces }: { entree: EntreePrompt; amorces: string[] }) {
  const [copie, setCopie] = useState(false);
  const texte = construirePrompt(entree);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    } catch {
      const zone = document.getElementById("prompt-texte") as HTMLTextAreaElement | null;
      zone?.focus();
      zone?.select();
    }
  };

  return (
    <section className="couche prompt" id="prompt" aria-labelledby="prompt-titre">
      <p className="pastille">{CATEGORIES[entree.categorie].nom}</p>
      <h2 id="prompt-titre">Posez la bonne question à votre IA</h2>
      <p>
        Si vous préférez apprendre en dialoguant, copiez ce gabarit dans l'IA de votre choix. Remplacez les blancs <strong>[à compléter]</strong> : une bonne demande dit qui vous êtes, ce que
        vous croyez déjà, et ce qui vous bloque précisément.
      </p>
      <textarea id="prompt-texte" className="prompt-texte" readOnly value={texte} rows={12} aria-label="Prompt à copier" />
      <p>
        <button type="button" className="btn btn-principal" onClick={copier}>
          {copie ? "Copié ✓" : "Copier le prompt"}
        </button>{" "}
        <a className="btn" href="#epreuve">
          J'ai posé ma question : retour à l'épreuve
        </a>
      </p>
      <details>
        <summary>Pas d'idée de question ? Trois amorces</summary>
        <ul>
          {amorces.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}

