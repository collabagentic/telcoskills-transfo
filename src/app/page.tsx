import Link from "next/link";
import { Amorce, type PaireAmorce } from "@/composants/Amorce";
import { Reprise } from "@/composants/Reprise";
import { chargerContenu } from "@/contenu/charger";
import { donneesPubliques } from "@/contenu/publiques";

export default function Accueil() {
  const c = chargerContenu();
  const donnees = donneesPubliques();
  // Phrases courtes seulement (hauteur stable, lisibles sur mobile), calculées à partir des fiches : rien d'écrit à la main dans le code.
  const paires: PaireAmorce[] = c.fiches
    .filter((f) => f.genre === "transposition" && f.avant && f.avant.length + f.apres.length <= 40)
    .slice(0, 5)
    .map((f) => ({ avant: f.avant!, apres: f.apres }));
  return (
    <>
      <Reprise donnees={donnees} />
      <section className="accueil">
        <p className="sur-titre">Votre métier ne disparaît pas. Il change de forme.</p>
        <Amorce paires={paires} />
        <p className="question-metier" style={{ marginTop: "var(--e-8)" }}>
          {c.competences.length} compétences, reliées par leurs prérequis. Quelques questions, et la feuille de route se resserre sur vous.
        </p>
        <div className="action-accueil">
          <Link className="btn btn-principal" href="/roadmap">
            Composer ma feuille de route
          </Link>
        </div>
      </section>
    </>
  );
}
