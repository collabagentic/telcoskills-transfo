import { Amorce, type PaireAmorce } from "@/composants/Amorce";
import { ChoixMetier, type OptionMetier } from "@/composants/ChoixMetier";
import { Reprise } from "@/composants/Reprise";
import { chargerContenu } from "@/contenu/charger";
import { donneesPubliques } from "@/contenu/publiques";

export default function Accueil() {
  const c = chargerContenu();
  const donnees = donneesPubliques();
  // Phrases courtes seulement (hauteur stable, lisibles sur mobile). Les amorces sont calculées à partir des transpositions du contenu : rien d'écrit à la main dans le code.
  const paires: PaireAmorce[] = c.fiches.filter((f) => f.genre === "transposition" && f.avant && f.avant.length + f.apres.length <= 40).slice(0, 5).map((f) => ({ avant: f.avant!, apres: f.apres }));
  const metiers: OptionMetier[] = [
    ...c.metiers.map((m) => ({ id: m.id, nom: m.nom, accroche: m.accroche, disponible: true, enRelecture: m.statut === "brouillon" })),
    ...c.aVenir.map((m) => ({ id: m.id, nom: m.nom, accroche: m.accroche, disponible: false })),
  ];
  return (
    <>
      <Reprise donnees={donnees} />
      <section className="accueil">
        <p className="sur-titre">Votre métier ne disparaît pas. Il change de forme.</p>
        <Amorce paires={paires} />
        <ChoixMetier metiers={metiers} />
      </section>
    </>
  );
}
