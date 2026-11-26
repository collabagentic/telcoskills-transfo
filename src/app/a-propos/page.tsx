import type { Metadata } from "next";
import Link from "next/link";
import { dateLongue, statistiques, URL_DEPOT, URL_LINKEDIN } from "@/lib/site";

export const metadata: Metadata = { title: "À propos" };

export default function PageAPropos() {
  const s = statistiques();
  return (
    <article className="texte-page lecture">
      <p className="pastille">À propos</p>
      <h1>Un site pour dire ce qui change, pas ce qui manque.</h1>
      <p className="chapeau">
        Les formations proposées aux professionnels du télécom qui passent au cloud natif commencent presque toutes au début. Ce site part de l'autre bout : de ce que vous savez
        déjà, et il dit franchement ce qui change de forme, ce qui est vraiment nouveau, et ce qu'il faut lâcher.
      </p>

      <h2>La méthode, en trois points</h2>
      <ol className="trois">
        <li>
          <strong>On part de l'existant.</strong> Aucune page ne commence par « bases ». Chaque fiche s'ouvre sur ce que vous faites déjà : votre matrice de flux, votre dossier de
          reprise, votre découpage en VLAN.
        </li>
        <li>
          <strong>Chaque affirmation est sourcée.</strong> Une fiche sans source, un schéma sans source, une ressource sans adresse ne passent pas le contrôle de construction du site.
        </li>
        <li>
          <strong>Les corrections sont publiques.</strong> Une erreur signalée puis corrigée renforce le site : l'historique de chaque fiche est affiché, avec le nom du contributeur s'il
          l'accepte.
        </li>
      </ol>

      <h2>Rien à vendre</h2>
      <p>
        Pas de formation payante, pas d'offre, pas de prospection, pas de compte. Le site est gratuit et reste dans votre navigateur. Il montre aussi une façon de travailler :
        ouverte, sourcée, corrigée en public.
      </p>

      <h2>L'auteur</h2>
      <p>
        Site conçu et maintenu par <strong>Taoufik Bouazza</strong>.
        {URL_LINKEDIN ? (
          <>
            {" "}
            <a href={URL_LINKEDIN} target="_blank" rel="noopener noreferrer">
              Profil LinkedIn
            </a>
            .
          </>
        ) : null}{" "}
        Le texte des fiches est rédigé avec l'aide d'une IA, puis relu au fil de l'eau par l'auteur et par des experts ; chaque relecture est inscrite dans l'historique de la fiche.
      </p>

      <h2>Le code est ouvert</h2>
      <p>
        Le code est sous licence MIT et le contenu sous licence CC BY-SA 4.0. Tout est dans{" "}
        <a href={URL_DEPOT} target="_blank" rel="noopener noreferrer">
          le dépôt du projet
        </a>
        .
      </p>

      <h2>Le site en chiffres</h2>
      <p className="cockpit-texte">Calculés à chaque construction du site à partir du contenu, jamais écrits à la main.</p>
      <dl className="chiffres">
        <div>
          <dt>Compétences</dt>
          <dd className="mono">{s.competences}</dd>
        </div>
        <div>
          <dt>Domaines</dt>
          <dd className="mono">{s.domaines}</dd>
        </div>
        <div>
          <dt>Fiches de transformation</dt>
          <dd className="mono">{s.fiches}</dd>
        </div>
        <div>
          <dt>Schémas</dt>
          <dd className="mono">{s.diagrammes}</dd>
        </div>
        <div>
          <dt>Ressources et sources</dt>
          <dd className="mono">{s.sources}</dd>
        </div>
        <div>
          <dt>Fiches relues par l'auteur</dt>
          <dd className="mono">
            {s.relues} / {s.fiches}
          </dd>
        </div>
      </dl>
      {s.derniereMiseAJour ? <p className="cockpit-texte">Dernière mise à jour d'une fiche : {dateLongue(s.derniereMiseAJour)}.</p> : null}

      <p style={{ marginTop: "var(--e-8)" }}>
        <Link className="btn btn-principal" href="/roadmap">
          Composer ma feuille de route
        </Link>
      </p>
    </article>
  );
}
