"use client";

import Link from "next/link";
import { calculerPlan, ficheSuivante } from "@/lib/bilan";
import { useBilan } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

/** Lien de retour en tête de fiche, et état « vérifié ». */
export function HautDeFiche({ ficheId }: { ficheId: string }) {
  const bilan = useBilan();
  const verifie = Boolean(bilan?.fiches[ficheId]?.verifie);
  return (
    <>
      <Link href={bilan ? "/plan" : "/"} className="retour">
        ‹ {bilan ? "Mon plan" : "Accueil"}
      </Link>
      {verifie ? <span className="pastille" style={{ color: "var(--teinte-ok)" }}>✓ vérifiée</span> : null}
    </>
  );
}

/** Bas de fiche : « Fiche suivante » selon le plan, ou « Et vous, quel est votre métier ? » sans bilan. */
export function SuiteFiche({ ficheId, donnees }: { ficheId: string; donnees: DonneesPubliques }) {
  const bilan = useBilan();
  const metier = bilan ? donnees.metiers[bilan.metier] : undefined;
  if (!bilan || !metier) {
    return (
      <div className="suite-fiche">
        <p>Et vous, quel est votre métier ?</p>
        <Link className="btn btn-principal" href="/">
          Voir ce qui change pour moi
        </Link>
      </div>
    );
  }
  const plan = calculerPlan(bilan, metier, donnees.fiches);
  const suivante = ficheSuivante(plan, ficheId);
  const enPlan = plan.lignes.some((l) => l.id === ficheId);
  return (
    <div className="suite-fiche">
      <Link className="btn btn-lien" href="/plan">
        Voir mon plan
      </Link>
      {suivante && enPlan ? (
        <Link className="btn btn-principal" href={`/fiche/${suivante}`}>
          Fiche suivante →
        </Link>
      ) : (
        <Link className="btn btn-principal" href="/plan">
          {enPlan ? "Terminer · voir mon plan" : "Retour à mon plan"}
        </Link>
      )}
    </div>
  );
}

/**
 * Barre de progression collée en haut de la fiche : où je suis dans mon plan, un point par fiche (vérifiée, lue, à lire),
 * précédente et suivante. N'apparaît que si un plan existe et contient cette fiche.
 */
export function BarreFiche({ ficheId, donnees }: { ficheId: string; donnees: DonneesPubliques }) {
  const bilan = useBilan();
  const metier = bilan ? donnees.metiers[bilan.metier] : undefined;
  if (!bilan || !metier) return null;
  const plan = calculerPlan(bilan, metier, donnees.fiches);
  const i = plan.lignes.findIndex((l) => l.id === ficheId);
  if (i < 0) return null;
  const precedente = i > 0 ? plan.lignes[i - 1].id : null;
  const suivante = i + 1 < plan.lignes.length ? plan.lignes[i + 1].id : null;
  return (
    <nav className="fiche-barre" aria-label="Progression dans votre plan">
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
        {plan.lignes.map((l, k) => (
          <li key={l.id}>
            <Link
              href={`/fiche/${l.id}`}
              className={`barre-point barre-${l.etat}${k === i ? " barre-courante" : ""}`}
              aria-current={k === i ? "step" : undefined}
              aria-label={`${donnees.fiches[l.id].titre} — ${l.etat === "verifie" ? "vérifiée" : l.etat === "lu" ? "lue" : "à lire"}`}
            />
          </li>
        ))}
      </ol>
      <span className="pastille barre-compteur">
        {i + 1} sur {plan.total}
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
