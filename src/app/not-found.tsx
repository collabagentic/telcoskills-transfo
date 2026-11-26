import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page introuvable" };

/** Page 404 en français, avec les trois portes d'entrée du site. */
export default function PageIntrouvable() {
  return (
    <div className="vide">
      <h1 className="titre-page">Cette page n'existe pas.</h1>
      <p>Le lien est peut-être ancien, ou l'adresse a été mal recopiée.</p>
      <p style={{ display: "flex", flexWrap: "wrap", gap: "var(--e-2)", justifyContent: "center" }}>
        <Link className="btn btn-principal" href="/roadmap">
          Composer ma feuille de route
        </Link>
        <Link className="btn" href="/competences">
          Explorer les compétences
        </Link>
        <Link className="btn" href="/">
          Retour à l'accueil
        </Link>
      </p>
    </div>
  );
}
