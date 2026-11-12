import Link from "next/link";

export function PiedDePage() {
  return (
    <footer className="pied">
      <nav className="pied-liens" aria-label="Informations">
        <Link href="/a-propos">À propos</Link>
        <Link href="/contribuer">Contribuer</Link>
        <Link href="/sources-et-methode">Sources et méthode</Link>
        <Link href="/confidentialite">Confidentialité</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
      </nav>
      <p>Gratuit, sans compte, sans cookie. Votre feuille de route reste dans votre navigateur.</p>
      <p>Les fiches marquées « en relecture » sont des brouillons sourcés, pas encore relus par l'auteur.</p>
    </footer>
  );
}
