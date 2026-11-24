import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FicheLecon } from "@/composants/lecon/FicheLecon";
import { chargerContenu } from "@/contenu/charger";
import { construireLecon } from "@/contenu/lecon";
import { titreFiche } from "@/contenu/lecture";
import { donneesPubliques } from "@/contenu/publiques";
import { NOM_VARIANTE, VARIANTES, type Variante } from "../../../variantes";

export const dynamicParams = false;

type Props = { params: Promise<{ v: string; id: string }> };

export function generateStaticParams() {
  return VARIANTES.flatMap((v) => chargerContenu().fiches.map((f) => ({ v, id: f.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { v, id } = await params;
  const f = chargerContenu().fiches.find((x) => x.id === id);
  return { title: `Prototype ${v.toUpperCase()} · ${f ? titreFiche(f) : "Fiche"}` };
}

export default async function PrototypeFiche({ params }: Props) {
  const { v, id } = await params;
  const c = chargerContenu();
  const f = c.fiches.find((x) => x.id === id);
  if (!f || !(VARIANTES as readonly string[]).includes(v)) notFound();
  const variante = v as Variante;
  return (
    <div className="lc-page">
      <nav className="lc-barre-variantes" aria-label="Variantes du prototype">
        <span>Prototype</span>
        {VARIANTES.map((x) => (
          <Link key={x} href={`/prototypes/${x}/fiche/${f.id}`} aria-current={x === variante ? "page" : undefined}>
            {NOM_VARIANTE[x].court} · {NOM_VARIANTE[x].titre}
          </Link>
        ))}
        <Link className="lc-barre-actuel" href={`/fiche/${f.id}`}>
          Fiche actuelle (menu de 7 étapes)
        </Link>
      </nav>
      <FicheLecon l={construireLecon(f, c)} donnees={donneesPubliques()} variante={variante} base={`/prototypes/${variante}/fiche`} />
    </div>
  );
}
