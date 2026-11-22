import Link from "next/link";
import "./accueil.css";
import { ExempleFiche } from "@/composants/ExempleFiche";
import { Reprise } from "@/composants/Reprise";
import { chargerContenu } from "@/contenu/charger";
import { donneesPubliques } from "@/contenu/publiques";
import { FICHE_EXEMPLE } from "@/lib/site";

const REPERES = [
  { titre: "Ce qui reste.", texte: "Les fondamentaux du télécom et vos réflexes d'ingénieur tiennent toujours." },
  { titre: "Ce qui change.", texte: "Le cloud natif transforme les architectures et les façons de livrer, pas votre expérience." },
  { titre: "Ce qu'il faut apprendre.", texte: "Quelques vraies nouveautés, choisies pour votre métier, sans repartir de zéro." },
] as const;

const ENTREES = [
  { label: "Composer ma feuille de route", href: "/roadmap" },
  { label: "Explorer les compétences", href: "/cockpit" },
  { label: "Contribuer", href: "/contribuer" },
] as const;

export default function Accueil() {
  const c = chargerContenu();
  const donnees = donneesPubliques();
  const fiche = c.fiches.find((f) => f.id === FICHE_EXEMPLE);
  return (
    <>
      <Reprise donnees={donnees} />
      <section className="accueil">
        <p className="sur-titre">Pour les métiers du télécom qui passent au cloud natif</p>
        <h1 className="accueil-titre">Vous connaissez déjà le télécom.</h1>
        <p className="accueil-accroche">
          Le cloud natif change les architectures et les pratiques, mais pas tout ce que vous avez appris ne devient inutile.
        </p>

        <ul className="accueil-reperes">
          {REPERES.map((r) => (
            <li key={r.titre} className="accueil-repere">
              <h2>{r.titre}</h2>
              <p>{r.texte}</p>
            </li>
          ))}
        </ul>

        <nav className="accueil-entrees" aria-label="Entrées du site">
          {ENTREES.map((e) => (
            <Link key={e.href} className="btn" href={e.href}>
              {e.label}
            </Link>
          ))}
        </nav>

        {fiche ? <ExempleFiche fiche={fiche} /> : null}
      </section>
    </>
  );
}
