import type { Metadata } from "next";
import { contributeurs, DELAI_REPONSE, DEPOT, URL_DEPOT } from "@/lib/site";

export const metadata: Metadata = { title: "Contribuer" };

const GABARIT = `{
  "id": "ma-fiche",                    // minuscules et tirets, unique
  "genre": "transposition",            // ou "nouveaute"
  "avant": "matrice de flux",          // « Votre … » (transposition seulement)
  "apres": "NetworkPolicy",            // « version … »
  "resume": { "avant": "…", "apres": "…" },   // 200 caractères au plus chacun
  "resteVrai": ["…", "…"],             // 2 à 4 puces de 140 caractères au plus
  "change": ["…", "…"],                // 2 à 4 puces
  "reflexe": "Une IP identifie une machine.",   // obligatoire pour une transposition
  "pourquoiNouveau": null,             // obligatoire pour une nouveauté, interdit sinon
  "piege": "…",                        // un paragraphe, 600 caractères au plus
  "exemple": "…",                      // un exemple télécom (5GC, CNF, CaaS)
  "schema": { "legende": "…", "avant": [{ "texte": "…" }, { "texte": "…" }], "apres": [{ "texte": "…" }, { "texte": "…" }] },
  "competences": ["k8s-archi"],        // au moins une compétence du graphe
  "technos": [],
  "questions": ["q-ma-fiche-1", "q-ma-fiche-2"],   // exactement deux
  "plusLoin": [{ "type": "doc", "nom": "…", "url": "https://…", "langue": "fr", "acces": "gratuit" }],
  "sources": [{ "nom": "…", "url": "https://…" }],  // une source par affirmation technique
  "statut": "brouillon",
  "misAJour": "AAAA-MM-JJ",
  "historique": [{ "date": "AAAA-MM-JJ", "changement": "Première version.", "par": "Votre nom", "lien": null }]
}`;

export default function PageContribuer() {
  const liste = contributeurs();
  const issue = (modele: string) => `${URL_DEPOT}/issues/new?title=${encodeURIComponent(modele)}`;
  return (
    <article className="texte-page lecture">
      <p className="pastille">Contribuer</p>
      <h1>Une erreur signalée, c'est une contribution.</h1>
      <p className="chapeau">
        Ce site est participatif : il ne prétend pas être infaillible. Si vous connaissez le sujet mieux qu'une fiche, corrigez-la ; votre nom apparaît dans son historique si vous
        l'acceptez. L'auteur s'engage à répondre {DELAI_REPONSE}.
      </p>

      <h2>Ce que vous pouvez faire</h2>
      <ul>
        <li>
          <strong>Signaler une erreur</strong> : chaque fiche a un bouton « Signaler une erreur » qui ouvre un ticket prérempli.{" "}
          <a href={issue("Erreur dans une fiche")} target="_blank" rel="noopener noreferrer">
            Ouvrir un ticket
          </a>
          .
        </li>
        <li>
          <strong>Proposer une correction</strong> : « Proposer une correction » ouvre le fichier de la fiche dans l'éditeur GitHub. Il faut un compte GitHub pour proposer une
          modification ; il n'en faut aucun pour lire le site.
        </li>
        <li>
          <strong>Proposer une fiche</strong> ou <strong>une compétence manquante</strong> : un ticket suffit pour commencer, avec la source de ce que vous avancez.
        </li>
      </ul>

      <h2>Les règles</h2>
      <ul>
        <li>
          <strong>Une source par affirmation technique.</strong> Documentation officielle, spécification, ou texte de référence. Pas de source, pas de correction acceptée.
        </li>
        <li>
          <strong>Le ton :</strong> direct, sans jargon inutile, au vouvoiement. On dit ce qui reste vrai, ce qui change, le réflexe à lâcher et le piège.
        </li>
        <li>
          <strong>Les longueurs :</strong> les limites sont imposées par le site (puces de 140 caractères, piège de 600). Le site refuse de se construire sinon, et le message dit quel
          champ est en cause.
        </li>
        <li>
          <strong>Un seul sujet par proposition</strong>, pour qu'elle se relise vite.
        </li>
      </ul>

      <h2>Le gabarit d'une fiche</h2>
      <p className="cockpit-texte">Les fiches sont des fichiers JSON dans le dossier content/fiches du dépôt ; les commentaires ci-dessous sont à retirer.</p>
      <pre className="gabarit">
        <code>{GABARIT}</code>
      </pre>
      <p className="cockpit-texte">
        Avant de proposer, le dépôt se vérifie avec <code>node node_modules/vitest/vitest.mjs run</code> : les mêmes contrôles que ceux du site tournent.
      </p>

      <h2>Les contributeurs</h2>
      {liste.length === 0 ? (
        <p>
          Personne pour l'instant : la première correction acceptée apparaîtra ici. Les contributeurs ne sont listés que si leur nom figure dans l'historique d'une fiche.
        </p>
      ) : (
        <ul>
          {liste.map((c) => (
            <li key={c.nom}>
              {c.nom} · {c.fiches} fiche{c.fiches > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      )}

      <h2>Le dépôt</h2>
      <p>
        <a href={URL_DEPOT} target="_blank" rel="noopener noreferrer">
          {DEPOT}
        </a>
      </p>
    </article>
  );
}
