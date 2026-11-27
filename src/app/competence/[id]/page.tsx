import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoutonRessources } from "@/composants/BoutonRessources";
import { Maitrise } from "@/composants/Maitrise";
import { Diagramme } from "@/composants/Diagramme";
import { Ressources } from "@/composants/Ressources";
import { chargerContenu } from "@/contenu/charger";
import { titreFiche } from "@/contenu/lecture";
import { usagesProjet } from "@/contenu/projet";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return chargerContenu().competences.map((x) => ({ id: x.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const x = chargerContenu().competences.find((k) => k.id === id);
  return { title: x ? x.titre : "Compétence", description: x?.resume };
}

const NIVEAU = { fondamental: "Fondamental", intermediaire: "Intermédiaire", avance: "Avancé", transverse: "Transverse" } as const;

export default async function PageCompetence({ params }: Props) {
  const { id } = await params;
  const c = chargerContenu();
  const x = c.competences.find((k) => k.id === id);
  if (!x) notFound();
  const domaine = c.domaines.find((d) => d.id === x.domaine);
  const parId = new Map(c.competences.map((k) => [k.id, k]));
  const prerequis = x.prerequis.map((p) => parId.get(p)!);
  const suivantes = c.competences.filter((k) => k.prerequis.includes(x.id));
  const fiches = c.fiches.filter((f) => f.competences.includes(x.id));
  const usages = usagesProjet(c).get(x.id) ?? [];
  const libelleRole = new Map(c.projet.roles.map((r) => [r.id, r.libelle]));

  return (
    <article className="fiche lecture">
      <Link href="/cockpit" className="retour">
        ‹ Mon cockpit
      </Link>
      <div className="fiche-meta">
        <span className="pastille">{domaine?.nom}</span>
        <span className="pastille">{NIVEAU[x.niveau]}</span>
      </div>
      <h1 style={{ fontSize: "var(--t-xl)" }}>{x.titre}</h1>
      <p className="sous-titre">{x.resume}</p>
      <div className="corriger" style={{ marginTop: 0, marginBottom: "var(--e-8)" }}>
        <Maitrise id={x.id} />
      </div>

      {x.objectifs && x.objectifs.length > 0 ? (
        <section className="rubrique">
          <h2>Ce que vous saurez faire</h2>
          <ul>
            {x.objectifs.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {usages.length > 0 ? (
        <section className="rubrique">
          <h2>Où ça sert dans le projet</h2>
          <ul>
            {usages.map((u) => (
              <li key={u.phase + u.activite}>
                <Link href={`/projet#${u.phase}`}>
                  Phase {u.numero}, {u.titrePhase.charAt(0).toLowerCase() + u.titrePhase.slice(1)}
                </Link>{" "}
                : {u.activite.charAt(0).toLowerCase() + u.activite.slice(1)} ({u.roles.map((r) => libelleRole.get(r) ?? r).join(", ")}).
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {x.diagramme ? (
        <section className="rubrique">
          <h2>Le schéma de base</h2>
          <Diagramme diagramme={x.diagramme} />
        </section>
      ) : null}

      {x.chronologie && x.chronologie.length > 0 ? (
        <section className="rubrique">
          <h2>Historique</h2>
          <ol className="chronologie">
            {x.chronologie.map((j) => (
              <li key={j.periode + j.evenement} className="jalon">
                <span className="jalon-periode mono">{j.periode}</span>
                <p>{j.evenement}</p>
                <a className="jalon-source" href={j.source.url} target="_blank" rel="noopener noreferrer">
                  {j.source.nom}
                </a>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {x.casUsage && x.casUsage.length > 0 ? (
        <section className="rubrique">
          <h2>Cas d'usage</h2>
          <ul className="cas-usage">
            {x.casUsage.map((cas) => (
              <li key={cas.titre} className="couche cas">
                <h3>{cas.titre}</h3>
                <p>{cas.texte}</p>
                <a className="jalon-source" href={cas.source.url} target="_blank" rel="noopener noreferrer">
                  {cas.source.nom}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {fiches.length > 0 ? (
        <section className="rubrique">
          <h2>Ce qui change pour vous</h2>
          <ul>
            {fiches.map((f) => (
              <li key={f.id}>
                <Link href={`/fiche/${f.id}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                  {titreFiche(f)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="rubrique">
          <p className="cockpit-texte">Pas encore de fiche de transformation pour cette compétence : les ressources ci-dessous sont le point de départ.</p>
        </section>
      )}

      {prerequis.length > 0 ? (
        <section className="rubrique">
          <h2>À maîtriser avant</h2>
          <ul>
            {prerequis.map((p) => (
              <li key={p.id}>
                <Link href={`/competence/${p.id}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                  {p.titre}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {suivantes.length > 0 ? (
        <section className="rubrique">
          <h2>Ouvre la voie à</h2>
          <ul>
            {suivantes.map((p) => (
              <li key={p.id}>
                <Link href={`/competence/${p.id}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                  {p.titre}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rubrique plus-loin" id="ressources">
        <h2>Ressources</h2>
        <p className="sous-titre" style={{ marginBottom: "var(--e-4)" }}>
          Le gratuit d'abord, le français avant l'anglais.
        </p>
        <Ressources liens={x.ressources} />
      </section>
      {x.ressources.length > 0 ? <BoutonRessources cible="ressources" /> : null}
    </article>
  );
}
