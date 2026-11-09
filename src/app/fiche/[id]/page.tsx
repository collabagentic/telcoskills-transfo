import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AvantApres } from "@/composants/AvantApres";
import { SchemaFiche } from "@/composants/SchemaFiche";
import { HautDeFiche, SuiteFiche } from "@/composants/NavigationFiche";
import { Verifier } from "@/composants/Verifier";
import { chargerContenu } from "@/contenu/charger";
import { preparerQuestion, tempsLecture, titreFiche } from "@/contenu/lecture";
import { donneesPubliques } from "@/contenu/publiques";

type Props = { params: Promise<{ id: string }> };

// Dépôt des corrections (lien « Corriger cette fiche »). Le dépôt doit être public à l'ouverture du site.
const DEPOT = process.env.NEXT_PUBLIC_DEPOT ?? "taoufikbo/telcoskills-transfo";

export function generateStaticParams() {
  return chargerContenu().fiches.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const f = chargerContenu().fiches.find((x) => x.id === id);
  if (!f) return { title: "Fiche" };
  return { title: titreFiche(f), description: f.resume.apres, openGraph: { title: titreFiche(f), description: f.resume.apres } };
}

const TYPE_LIEN = { opensource: "open source", doc: "documentation", cours: "cours", video: "vidéo", spec: "spécification" } as const;
const GENRE = { transposition: "Change de forme", nouveaute: "Vraiment nouveau" } as const;

export default async function PageFiche({ params }: Props) {
  const { id } = await params;
  const c = chargerContenu();
  const f = c.fiches.find((x) => x.id === id);
  if (!f) notFound();

  const titre = titreFiche(f);
  const questions = f.questions.map((qid) => preparerQuestion(c.questions.find((q) => q.id === qid)!));
  const technos = f.technos.map((t) => c.technos.find((x) => x.id === t)!);
  const lies: Record<string, string[]> = {};
  for (const m of c.metiers) {
    const ids = m.savoirFaire.filter((s) => s.fiche === f.id).map((s) => s.id);
    if (ids.length) lies[m.id] = ids;
  }
  const issue = `https://github.com/${DEPOT}/issues/new?title=${encodeURIComponent(`Erreur dans la fiche « ${titre} »`)}&body=${encodeURIComponent(
    `Fiche : ${f.id}\nSection concernée : \nCe qui est faux ou manque : \nSource : \n`,
  )}`;
  const edition = `https://github.com/${DEPOT}/edit/main/content/fiches/${f.id}.json`;
  const recents = f.historique.slice(0, 3);
  const anciens = f.historique.slice(3);
  const donnees = donneesPubliques();

  return (
    <article className="fiche lecture">
      <HautDeFiche ficheId={f.id} />
      <div className="fiche-meta">
        <span className="pastille">{GENRE[f.genre]}</span>
        <span className="pastille">{tempsLecture(f)} min</span>
        {f.statut === "brouillon" ? <span className="pastille pastille-relecture">en relecture</span> : null}
      </div>
      <h1>{titre}</h1>

      <AvantApres genre={f.genre} resume={f.resume} lies={lies} technos={technos.map((t) => ({ id: t.id, nom: t.nom }))} />

      <SchemaFiche schema={f.schema} />

      <section className="rubrique">
        <h2>Ce qui reste vrai</h2>
        <ul>
          {f.resteVrai.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
      <section className="rubrique">
        <h2>Ce qui change</h2>
        <ul>
          {f.change.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
      {f.genre === "transposition" && f.reflexe ? (
        <section className="rubrique">
          <h2>Le réflexe à lâcher</h2>
          <p className="reflexe">« {f.reflexe} »</p>
        </section>
      ) : (
        <section className="rubrique">
          <h2>Pourquoi ça n'existait pas chez vous</h2>
          <p>{f.pourquoiNouveau}</p>
        </section>
      )}
      <section className="rubrique">
        <h2>Le piège</h2>
        <p className="encadre">{f.piege}</p>
      </section>
      <section className="rubrique">
        <h2>En télécom, concrètement</h2>
        <p>{f.exemple}</p>
      </section>

      <Verifier ficheId={f.id} questions={questions} />

      <section className="rubrique plus-loin">
        <h2>Pour aller plus loin</h2>
        <ul>
          {[...f.plusLoin]
            .sort((a, b) => Number(b.acces === "gratuit") - Number(a.acces === "gratuit"))
            .map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.nom}
                </a>{" "}
                <span className="pastille">
                  {TYPE_LIEN[l.type]} · {l.langue} · {l.acces}
                  {l.auteur ? ` · ${l.auteur}` : ""}
                </span>
              </li>
            ))}
        </ul>
        <details>
          <summary>Sources de cette fiche</summary>
          <ul>
            {f.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                  {s.nom}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="rubrique historique">
        <h2>Historique de la fiche</h2>
        <ul>
          {recents.map((h) => (
            <li key={h.date + h.changement}>
              {h.date} · {h.changement} <span className="pastille">{h.par}</span>
            </li>
          ))}
        </ul>
        {anciens.length > 0 ? (
          <details>
            <summary>Voir les {anciens.length} versions plus anciennes</summary>
            <ul>
              {anciens.map((h) => (
                <li key={h.date + h.changement}>
                  {h.date} · {h.changement} <span className="pastille">{h.par}</span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
        <div className="corriger">
          <a className="btn" href={issue} target="_blank" rel="noopener noreferrer">
            Signaler une erreur
          </a>
          <a className="btn" href={edition} target="_blank" rel="noopener noreferrer">
            Proposer une correction
          </a>
        </div>
      </section>

      <SuiteFiche ficheId={f.id} donnees={donnees} />
    </article>
  );
}
