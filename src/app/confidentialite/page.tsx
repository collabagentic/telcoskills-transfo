import type { Metadata } from "next";
import { EffacerDonnees } from "@/composants/EffacerDonnees";

export const metadata: Metadata = { title: "Confidentialité" };

export default function PageConfidentialite() {
  return (
    <article className="texte-page lecture">
      <p className="pastille">Confidentialité</p>
      <h1>Rien ne quitte votre navigateur.</h1>

      <h2>Ce que le site conserve</h2>
      <p>
        Aucun compte, aucun cookie. Le site enregistre une seule chose, dans le stockage local de votre navigateur, sous la clé <code>ts:parcours</code> : vos réponses aux questions, les
        compétences que vous avez marquées comme maîtrisées, les fiches lues ou vérifiées (avec la date du jour), et l'objectif choisi.
      </p>
      <p>
        Ces données ne sont envoyées nulle part. Elles servent uniquement à recomposer votre feuille de route et votre cockpit sur cet appareil. Un autre navigateur, ou une navigation
        privée, repart de zéro.
      </p>

      <h2>La mesure d'audience</h2>
      <p>Aucune mesure d'audience n'est active. Si elle est un jour ajoutée, elle ne sera chargée qu'après votre accord, sans donnée personnelle.</p>

      <h2>L'hébergeur</h2>
      <p>
        Le site est servi par Vercel. Comme tout hébergeur, Vercel peut conserver des journaux techniques de serveur (adresse IP, date, page demandée) pour la sécurité et le bon
        fonctionnement du service. Le site lui-même n'y ajoute rien.
      </p>

      <h2>Les liens externes</h2>
      <p>Les fiches renvoient vers des documentations et des ressources tierces. En les ouvrant, vous quittez ce site : leurs propres règles s'appliquent.</p>

      <h2>Effacer vos données</h2>
      <EffacerDonnees />
    </article>
  );
}
