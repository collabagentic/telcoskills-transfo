import type { Metadata } from "next";
import { URL_DEPOT } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales" };

export default function PageMentions() {
  return (
    <article className="texte-page lecture">
      <p className="pastille">Mentions légales</p>
      <h1>Mentions légales</h1>

      <h2>Éditeur et directeur de la publication</h2>
      <p>
        Taoufik Bouazza, à titre personnel. Site non commercial : il ne vend rien et ne contient aucune publicité.
      </p>
      <p>
        Contact : par un{" "}
        <a href={`${URL_DEPOT}/issues`} target="_blank" rel="noopener noreferrer">
          ticket sur le dépôt du projet
        </a>
        . L'auteur s'engage à répondre sous 7 jours.
      </p>

      <h2>Hébergeur</h2>
      <p>Vercel Inc., 440 N Barranca Ave &#35;4133, Covina, CA 91723, États-Unis.</p>

      <h2>Licences</h2>
      <ul>
        <li>Le code du site est sous licence MIT.</li>
        <li>
          Le contenu éditorial (compétences, fiches, questions, schémas) est sous licence Creative Commons Attribution - Partage dans les mêmes conditions 4.0 International (CC BY-SA
          4.0) : vous pouvez le réutiliser, y compris commercialement, en citant TelcoSkills et en partageant vos adaptations sous la même licence.
        </li>
        <li>Les marques, noms de produits et documents tiers cités appartiennent à leurs titulaires.</li>
      </ul>

      <h2>Responsabilité</h2>
      <p>
        Le site propose des explications sourcées, relues au fil de l'eau par l'auteur et par des experts : une fiche peut contenir des erreurs. Il ne remplace ni
        une formation, ni la documentation officielle d'un produit. Aucune garantie n'est donnée sur l'exactitude ou l'actualité du contenu ; les erreurs signalées sont corrigées
        publiquement.
      </p>

      <h2>Données personnelles</h2>
      <p>Voir la page « Confidentialité » : aucun cookie, aucune donnée envoyée, tout reste dans votre navigateur.</p>
    </article>
  );
}
