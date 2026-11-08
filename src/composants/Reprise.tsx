"use client";

import Link from "next/link";
import { calculerPlan } from "@/lib/bilan";
import { useBilan } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

/** Bandeau « Reprendre » : visible seulement si un bilan existe. La fente a toujours la même hauteur (pas de saut au chargement). */
export function Reprise({ donnees }: { donnees: DonneesPubliques }) {
  const bilan = useBilan();
  const metier = bilan ? donnees.metiers[bilan.metier] : undefined;
  const plan = bilan && metier ? calculerPlan(bilan, metier, donnees.fiches) : null;
  return (
    <div className="fente-reprise carte-reprise">
      {bilan && metier && plan ? (
        <Link className="reprise" href={plan.reprise ? `/fiche/${plan.reprise}` : "/plan"}>
          <span>Reprendre votre plan</span>
          <strong>
            {metier.nom} · {plan.verifiees} fiche{plan.verifiees > 1 ? "s" : ""} sur {plan.total}
          </strong>
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  );
}
