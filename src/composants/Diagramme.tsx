import { useId } from "react";
import { descriptionDiagramme, tracerLiens } from "@/contenu/diagramme";
import type { Diagramme as DonneesDiagramme } from "@/contenu/schemas";

/**
 * Diagramme d'architecture en SVG : zones, composants et flèches étiquetées. Rendu dans le HTML statique (aucun JavaScript),
 * couleurs et traits pilotés par nos jetons. Une description textuelle des flèches est donnée aux lecteurs d'écran.
 */
export function Diagramme({ diagramme: d }: { diagramme: DonneesDiagramme }) {
  const id = useId().replace(/:/g, "");
  const traces = tracerLiens(d);
  const description = descriptionDiagramme(d);
  const chemin = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

  return (
    <figure className="diagramme couche">
      <figcaption className="pastille">{d.legende}</figcaption>
      <div className="diagramme-defile">
        <svg viewBox={`0 0 ${d.largeur} ${d.hauteur}`} width={d.largeur} role="img" aria-labelledby={`${id}-t ${id}-d`} className="diagramme-svg">
          <title id={`${id}-t`}>{d.legende}</title>
          <desc id={`${id}-d`}>{description.join(". ")}</desc>
          <defs>
            <marker id={`${id}-fleche`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M1 1.5 9 5 1 8.5" className="dg-pointe" />
            </marker>
          </defs>

          {d.zones.map((z) => (
            <g key={z.id} className={`dg-zone dg-ton-${z.ton ?? "neutre"}`}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="14" />
              <text x={z.x + 14} y={z.y + 20} className="dg-zone-titre">
                {z.titre}
              </text>
            </g>
          ))}

          {traces.map((t, i) => (
            <path
              key={i}
              d={chemin(t.points)}
              className={`dg-lien${t.pointille ? " dg-pointille" : ""}`}
              markerEnd={`url(#${id}-fleche)`}
              markerStart={t.double ? `url(#${id}-fleche)` : undefined}
              fill="none"
            />
          ))}

          {d.noeuds.map((n) => (
            <g key={n.id} className={`dg-noeud dg-ton-${n.ton ?? "neutre"}`}>
              {n.forme === "base" ? (
                <>
                  <path d={`M${n.x} ${n.y + 10} v${n.h - 20} a${n.w / 2} 10 0 0 0 ${n.w} 0 v${-(n.h - 20)}`} className="dg-forme" />
                  <ellipse cx={n.x + n.w / 2} cy={n.y + 10} rx={n.w / 2} ry="10" className="dg-forme" />
                </>
              ) : (
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" className="dg-forme" />
              )}
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 + (n.detail ? -3 : 5) + (n.forme === "base" ? 6 : 0)} textAnchor="middle" className="dg-texte">
                {n.texte}
              </text>
              {n.detail ? (
                <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 14 + (n.forme === "base" ? 6 : 0)} textAnchor="middle" className="dg-detail">
                  {n.detail}
                </text>
              ) : null}
            </g>
          ))}

          {traces.map((t, i) =>
            t.texte ? (
              <text key={`e${i}`} x={t.milieu.x} y={t.milieu.y - 6} textAnchor="middle" className="dg-etiquette">
                {t.texte}
              </text>
            ) : null,
          )}
        </svg>
      </div>
      <p className="diagramme-aide" aria-hidden="true">
        Faites glisser le schéma pour voir la suite →
      </p>
      <p className="diagramme-source">
        Source :{" "}
        <a href={d.source.url} target="_blank" rel="noopener noreferrer">
          {d.source.nom}
        </a>
      </p>
    </figure>
  );
}
