import Link from "next/link";
import { Reprise } from "@/composants/Reprise";
import { chargerContenu } from "@/contenu/charger";
import { donneesPubliques } from "@/contenu/publiques";

export default function Accueil() {
  const c = chargerContenu();
  const donnees = donneesPubliques();
  return (
    <>
      <Reprise donnees={donnees} />
      <section className="accueil">
        <p className="sur-titre">Pour les métiers du télécom qui passent au cloud natif</p>
        <h1 className="slogan">
          Le telco cloud :
          <br />
          par où commencer&nbsp;?
        </h1>
        <p className="accroche">
          Vous ne repartez pas de zéro. Répondez à quelques questions : parmi {c.competences.length} compétences, votre feuille de route se resserre sur ce qui change pour vous.
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
