import type { Metadata } from "next";
import Link from "next/link";
import { chargerContenu } from "@/contenu/charger";
import { statistiques } from "@/lib/site";

export const metadata: Metadata = { title: "Sources et méthode" };

export default function PageSources() {
  const c = chargerContenu();
  const s = statistiques();
  return (
    <article className="texte-page lecture">
      <p className="pastille">Sources et méthode</p>
      <h1>D'où vient ce qui est écrit ici, et ce que le site ne sait pas.</h1>

      <h2>D'où vient le contenu</h2>
      <ul>
        <li>
          <strong>Le graphe de compétences</strong> ({s.competences} compétences, reliées par leurs prérequis) vient d'un site précédent, TelcoSkills, dont les ressources avaient
          été vérifiées. Les compétences propres à l'IA agentique et à Sylva en ont été retirées : ce site traite le cloud natif télécom.
        </li>
        <li>
          <strong>Les fiches de transformation</strong> ({s.fiches}) disent « votre X, version Y ». Elles sont rédigées avec l'aide d'une IA à partir de documentations officielles
          (Kubernetes, Helm, Prometheus, OpenTelemetry, 3GPP, CNCF…). Chaque fiche liste ses sources.
        </li>
        <li>
          <strong>Les schémas</strong> ({s.diagrammes}) sont dessinés à la main, et chacun cite sa source. Le site refuse de se construire si un composant déborde, si deux se chevauchent
          ou si une étiquette recouvre autre chose.
        </li>
        <li>
          <strong>Les épreuves</strong> ({s.epreuves}) sont des cas à raisonner : chacune a son raisonnement attendu et sa source. Elles partent de l'ancien site et restent des brouillons.
        </li>
      </ul>

      <h2>Brouillon ou relu</h2>
      <p>
        Chaque fiche est un texte sourcé, rédigé avec l'aide d'une IA et relu au fil de l'eau par l'auteur et par des experts. Elle peut contenir des erreurs. Relire une fiche, c'est vérifier
        chaque affirmation contre sa source : le lien « Relire cette fiche », en fin de fiche, sert à cela, et chaque relecture est inscrite dans l'historique de la fiche.
      </p>

      <h2>Les règles que le site se fait respecter</h2>
      <ul>
        <li>Chaque fiche a au moins une source avec adresse, un lien gratuit pour aller plus loin, et une épreuve (un cas, son raisonnement attendu, sa source).</li>
        <li>Un passage qui n'est pas un fait sourcé (un conseil, une comparaison avec « avant ») porte l'étiquette « avis d'auteur » ; tout le reste doit avoir sa source.</li>
        <li>Une transposition nomme le réflexe à lâcher ; une nouveauté explique pourquoi elle n'existait pas avant.</li>
        <li>Les prérequis du graphe existent tous et ne forment aucune boucle.</li>
        <li>Les longueurs des textes sont limitées : c'est une contrainte de lisibilité.</li>
        <li>L'historique de chaque fiche est daté et affiché.</li>
      </ul>

      <h2>Pourquoi ce site : le contexte</h2>
      <p className="cockpit-texte">Chaque chiffre renvoie à sa source.</p>
      <ul className="sources-liste">
        {c.contexte.chiffres.map((x) => (
          <li key={x.source.url}>
            {x.texte}{" "}
            <a href={x.source.url} target="_blank" rel="noopener noreferrer">
              {x.source.nom}
            </a>
          </li>
        ))}
      </ul>

      <h2>Les limites</h2>
      <ul>
        {c.contexte.limites.map((l) => (
          <li key={l}>{l}</li>
        ))}
        <li>Ce site oriente et explique ; il ne remplace ni une formation, ni une certification, ni l'avis d'un expert.</li>
        <li>Les sujets réglementaires sont listés avec leurs ressources, sans schéma : un schéma juridique se rédige et se relit avec soin.</li>
      </ul>

      <h2>Signaler une erreur</h2>
      <p>
        Vous connaissez le sujet mieux qu'une fiche ? Dites-le : <Link href="/contribuer">voici comment</Link>. Une erreur corrigée en public est une contribution.
      </p>
    </article>
  );
}
