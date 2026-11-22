import type { Essentiel } from "@/contenu/lecture";

const NIVEAUX = [
  { ancre: "essentiel", libelle: "L'essentiel" },
  { ancre: "en-2-minutes", libelle: "En 2 minutes" },
  { ancre: "approfondir", libelle: "Approfondir" },
] as const;

/** Étiquette « avis d'auteur » d'un passage du bandeau (même rendu que dans le corps de la fiche). */
function etiquette(avis: boolean) {
  return avis ? <span className="avis-auteur">avis d'auteur</span> : null;
}

/**
 * Bandeau « L'essentiel en 30 secondes » et repères de niveau : une navigation courte vers les trois niveaux de
 * lecture (L'essentiel · En 2 minutes · Approfondir). Composé uniquement de champs existants, lus tels quels.
 */
export function EssentielFiche({ essentiel }: { essentiel: Essentiel }) {
  const { resume, pivot, changement } = essentiel;
  return (
    <section className="essentiel" id="essentiel" aria-labelledby="essentiel-titre">
      <nav className="essentiel-nav" aria-label="Niveaux de lecture">
        {NIVEAUX.map((n, i) => (
          <span key={n.ancre} className="essentiel-nav-lien">
            {i > 0 ? <span className="essentiel-nav-point" aria-hidden="true">·</span> : null}
            <a href={"#" + n.ancre}>{n.libelle}</a>
          </span>
        ))}
      </nav>
      <h2 className="essentiel-surtitre" id="essentiel-titre">L'essentiel en 30 secondes</h2>
      <div className="essentiel-corps">
        <p className="essentiel-ligne">
          {resume.avant ? (
            <>
              <strong>Avant</strong> {resume.avant} <span aria-hidden="true"> → </span>
            </>
          ) : null}
          <strong>Après</strong> {resume.apres}
          {etiquette(resume.avis)}
        </p>
        <p className="essentiel-ligne">
          <strong>{pivot.type === "reflexe" ? "Le réflexe à lâcher" : "Pourquoi c'est nouveau"}</strong> {pivot.texte}
          {etiquette(pivot.avis)}
        </p>
        <p className="essentiel-ligne">
          <strong>Ce qui change</strong> {changement.texte}
          {etiquette(changement.avis)}
        </p>
      </div>
    </section>
  );
}
