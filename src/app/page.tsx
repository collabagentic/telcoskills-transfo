import Link from "next/link";
import "./accueil.css";
import { ConversationAccueil } from "@/composants/ConversationAccueil";
import { ExempleFiche } from "@/composants/ExempleFiche";
import { chargerContenu } from "@/contenu/charger";
import { donneesPubliques } from "@/contenu/publiques";
import { FICHE_EXEMPLE } from "@/lib/site";

/** Accueil en quatre blocs : la promesse, la discussion qui donne un premier pas, trois portes avec un vrai aperçu, un exemple. */
export default function Accueil() {
  const c = chargerContenu();
  const fiche = c.fiches.find((f) => f.id === FICHE_EXEMPLE);
  const p = c.projet;
  const parDomaine = c.domaines.map((d) => ({ ...d, n: c.competences.filter((x) => x.domaine === d.id).length }));

  return (
    <div className="pa">
      <section className="pa-tete">
        <p className="pa-sur">Pour les métiers du télécom qui passent au cloud natif</p>
        <h1>Vous connaissez déjà le télécom.</h1>
        <p className="pa-accroche">
          Le cloud natif change les architectures et les pratiques, mais ce que vous avez appris reste utile. TelcoSkills montre, pour votre métier, ce qui reste,
          ce qui change et ce qu&apos;il faut apprendre, dans l&apos;ordre.
        </p>
        <p className="pa-chiffres">
          {c.competences.length} compétences reliées par leurs prérequis · {c.fiches.length} fiches sourcées · {p.phases.length} phases de projet · {c.outils.outils.length}{" "}
          outils open source
        </p>
      </section>

      <ConversationAccueil donnees={donneesPubliques()} />

      <section className="pa-explorer" aria-label="Explorer">
        <Link href="/projet" className="pa-bloc">
          <span className="pa-bloc-sur">Le projet</span>
          <h2>À quoi sert chaque compétence</h2>
          <p>
            {p.titre} : {p.phases.length} phases, {p.roles.length} rôles, qui fait quoi et quand.
          </p>
          <ol className="pa-phases">
            {p.phases.map((ph, i) => (
              <li key={ph.id}>
                <span>{i + 1}</span>
                {ph.titre}
              </li>
            ))}
          </ol>
        </Link>
        <Link href="/outils" className="pa-bloc">
          <span className="pa-bloc-sur">Les outils</span>
          <h2>Avec quoi on travaille</h2>
          <p>{c.outils.outils.length} outils open source, groupés par fonction, filtrables par rôle.</p>
          <ul className="pa-puces">
            {c.outils.outils.slice(0, 18).map((o) => (
              <li key={o.id}>{o.nom}</li>
            ))}
          </ul>
        </Link>
        <Link href="/competences" className="pa-bloc">
          <span className="pa-bloc-sur">Les compétences</span>
          <h2>Tout le référentiel</h2>
          <p>
            {c.competences.length} compétences en {c.domaines.length} domaines, chacune avec ses prérequis et ses ressources.
          </p>
          <ul className="pa-domaines">
            {parDomaine.map((d) => (
              <li key={d.id}>
                {d.nom}
                <span>{d.n}</span>
              </li>
            ))}
          </ul>
        </Link>
      </section>

      {fiche ? <ExempleFiche fiche={fiche} /> : null}
    </div>
  );
}
