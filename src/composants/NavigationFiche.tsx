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
