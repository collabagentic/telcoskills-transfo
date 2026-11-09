"use client";

import Link from "next/link";
import { useMemo } from "react";
import { recombiner } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

/** Les fiches de la feuille de route de la personne, dans l'ordre ; vide si elle n'a pas encore répondu à une question. */
function useFichesDeLaFeuille(donnees: DonneesPubliques): string[] {
  const parcours = useParcours();
  const reponses = parcours?.reponses;
  return useMemo(() => {
    if (!reponses || Object.keys(reponses).length === 0) return [];
    const feuille = recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines);
    return [...new Set(feuille.etapes.flatMap((e) => e.fiches))];
  }, [donnees, reponses]);
}

/** Lien de retour en tête de fiche, et état « vérifiée ». */
export function HautDeFiche({ ficheId }: { ficheId: string }) {
  const parcours = useParcours();
  const verifie = Boolean(parcours?.fiches[ficheId]?.verifie);
  return (
    <>
      <Link href="/roadmap" className="retour">
        ‹ Ma feuille de route
      </Link>
      {verifie ? (
        <span className="pastille" style={{ color: "var(--teinte-ok)" }}>
          ✓ vérifiée
        </span>
      ) : null}
    </>
  );
}

/** Bas de fiche : « Fiche suivante » selon la feuille de route, ou « Composer ma feuille de route » sans réponse. */
export function SuiteFiche({ ficheId, donnees }: { ficheId: string; donnees: DonneesPubliques }) {
  const liste = useFichesDeLaFeuille(donnees);
  const i = liste.indexOf(ficheId);
  if (liste.length === 0) {
    return (
      <div className="suite-fiche">
        <p>Et vous, que change-t-il dans votre métier ?</p>
        <Link className="btn btn-principal" href="/roadmap">
          Composer ma feuille de route
        </Link>
      </div>
    );
  }
  const suivante = i >= 0 && i + 1 < liste.length ? liste[i + 1] : null;
  return (
    <div className="suite-fiche">
      <Link className="btn btn-lien" href="/roadmap">
        Ma feuille de route
      </Link>
      {suivante ? (
        <Link className="btn btn-principal" href={`/fiche/${suivante}`}>
          Fiche suivante →
        </Link>
      ) : (
        <Link className="btn btn-principal" href="/roadmap">
          Retour à ma feuille de route
        </Link>
      )}
    </div>
  );
}

/**
 * Barre de progression collée en haut de la fiche : où je suis parmi les fiches de ma feuille de route (vérifiée, lue, à lire),
 * précédente et suivante. N'apparaît que si la feuille de route contient cette fiche.
 */
export function BarreFiche({ ficheId, donnees }: { ficheId: string; donnees: DonneesPubliques }) {
  const parcours = useParcours();
  const liste = useFichesDeLaFeuille(donnees);
  const i = liste.indexOf(ficheId);
  if (!parcours || i < 0) return null;
  const precedente = i > 0 ? liste[i - 1] : null;
  const suivante = i + 1 < liste.length ? liste[i + 1] : null;
  const etat = (id: string) => (parcours.fiches[id]?.verifie ? "verifie" : parcours.fiches[id]?.lu ? "lu" : "a-lire");
  return (
    <nav className="fiche-barre" aria-label="Progression dans vos fiches">
      {precedente ? (
        <Link href={`/fiche/${precedente}`} className="barre-fleche" aria-label={`Fiche précédente : ${donnees.fiches[precedente].titre}`}>
          ‹
        </Link>
      ) : (
        <span className="barre-fleche barre-inactive" aria-hidden="true">
          ‹
        </span>
      )}
      <ol className="barre-points">
        {liste.map((id, k) => (
          <li key={id}>
            <Link
              href={`/fiche/${id}`}
              className={`barre-point barre-${etat(id)}${k === i ? " barre-courante" : ""}`}
              aria-current={k === i ? "step" : undefined}
              aria-label={`${donnees.fiches[id].titre} — ${etat(id) === "verifie" ? "vérifiée" : etat(id) === "lu" ? "lue" : "à lire"}`}
            />
          </li>
        ))}
      </ol>
      <span className="pastille barre-compteur">
        {i + 1} sur {liste.length}
      </span>
      {suivante ? (
        <Link href={`/fiche/${suivante}`} className="barre-fleche" aria-label={`Fiche suivante : ${donnees.fiches[suivante].titre}`}>
          ›
        </Link>
      ) : (
        <span className="barre-fleche barre-inactive" aria-hidden="true">
          ›
        </span>
      )}
    </nav>
  );
}
