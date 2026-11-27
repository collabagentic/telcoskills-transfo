import Link from "next/link";

export function PiedDePage() {
  return (
    <footer className="pied">
      <nav className="pied-liens" aria-label="Informations">
        <Link href="/projet">Le projet</Link>
        <Link href="/outils">Les outils</Link>
        <Link href="/a-propos">À propos</Link>
        <Link href="/contribuer">Contribuer</Link>
        <Link href="/sources-et-methode">Sources et méthode</Link>
        <Link href="/confidentialite">Confidentialité</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/audit" className="pied-audit" title="Où en sont les fiches : finies, à vérifier, classement">
          Audit
        </Link>
      </nav>
      <p>Gratuit, sans compte, sans cookie. Votre feuille de route reste dans votre navigateur.</p>
      <p>Les fiches sont des textes sourcés, relus au fil de l'eau par l'auteur et par des experts : chaque fiche se termine par un lien « Relire cette fiche ».</p>
    </footer>
  );
}
