"use client";

import "@xyflow/react/dist/style.css";
import { Background, Controls, Handle, MarkerType, Position, ReactFlow, ReactFlowProvider, useReactFlow, type Edge, type Node, type NodeProps } from "@xyflow/react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { cheminComplet, DIMS_ENSEMBLE, DIMS_ETAPE, placer, tailleGraphe } from "@/lib/carte";
import type { EtatEtape, Etape, Feuille } from "@/lib/parcours";

type DonneesEtape = {
  id: string;
  titre: string;
  niveau: Etape["niveau"];
  etat: EtatEtape;
  cible: boolean;
  suivante: boolean;
  estompe: boolean;
  fiche: boolean;
  ensemble: boolean;
  [cle: string]: unknown;
};

const LIBELLE_NIVEAU: Record<Etape["niveau"], string> = { fondamental: "Fondamental", intermediaire: "Intermédiaire", avance: "Avancé", transverse: "Transverse" };
const LIBELLE_ETAT: Record<EtatEtape, string> = { faite: "faite", disponible: "à faire", "a-venir": "conseillée plus tard" };

/** Une étape : un vrai lien vers la compétence (clavier et lecteur d'écran fonctionnent sans rien de plus). */
function EtapeNoeud({ data }: NodeProps<Node<DonneesEtape>>) {
  const classes = ["etape", `etape-${data.etat}`, `niveau-${data.niveau}`, data.cible ? "etape-cible" : "", data.suivante ? "etape-suivante" : "", data.estompe ? "etape-estompee" : "", data.ensemble ? "etape-ensemble" : ""].join(" ");
  const d = data.ensemble ? DIMS_ENSEMBLE : DIMS_ETAPE;
  return (
    <>
      <Handle type="target" position={Position.Left} className="poignee" isConnectable={false} />
      <Link
        href={`/competence/${data.id}`}
        className={`${classes} nodrag nopan`}
        style={{ width: d.largeur, height: d.hauteur }}
        aria-label={`${data.titre} — ${LIBELLE_ETAT[data.etat]}${data.cible ? " — objectif" : ""}${data.suivante ? " — prochaine étape" : ""}`}
        tabIndex={data.ensemble ? -1 : 0}
      >
        {data.ensemble ? null : (
          <>
            <span className="etape-entete">
              <span className={`etat etat-${data.etat === "faite" ? "verifie" : "vide"}`} aria-hidden="true" />
              <span className="etape-genre">{LIBELLE_NIVEAU[data.niveau]}</span>
              {data.cible ? <span className="etape-repere">Objectif</span> : data.suivante ? <span className="etape-repere">Prochaine</span> : data.fiche ? <span className="etape-temps">Fiche</span> : null}
            </span>
            <span className="etape-titre">{data.titre}</span>
          </>
        )}
      </Link>
      <Handle type="source" position={Position.Right} className="poignee" isConnectable={false} />
    </>
  );
}

const TYPES = { etape: EtapeNoeud };

type Props = {
  feuille: Feuille;
  etats: Record<string, EtatEtape>;
  objectif: string | null;
  suivante: string | null;
};

/** Recadre la carte, en douceur, chaque fois que la feuille de route change. */
function Recadrage({ signature }: { signature: string }) {
  const rf = useReactFlow();
  useEffect(() => {
    const t = window.setTimeout(() => void rf.fitView({ duration: 500, padding: 0.1, maxZoom: 1 }), 60);
    return () => window.clearTimeout(t);
  }, [signature, rf]);
  return null;
}

function Carte({ feuille, etats, objectif, suivante }: Props) {
  const ensemble = feuille.complete;
  const dims = ensemble ? DIMS_ENSEMBLE : DIMS_ETAPE;
  const dependances = useMemo(() => Object.fromEntries(feuille.etapes.map((e) => [e.id, e.prerequis])), [feuille]);
  const { noeuds, aretes } = useMemo(() => placer(feuille.etapes.map((e) => e.id), dependances, dims), [feuille, dependances, dims]);
  const chemin = useMemo(() => (objectif && dependances[objectif] ? cheminComplet(objectif, dependances) : null), [objectif, dependances]);
  const parId = useMemo(() => new Map(feuille.etapes.map((e) => [e.id, e])), [feuille]);
  const taille = tailleGraphe(noeuds, dims);

  const nodes: Node<DonneesEtape>[] = noeuds.map((n) => {
    const e = parId.get(n.id)!;
    return {
      id: n.id,
      type: "etape",
      position: { x: n.x, y: n.y },
      width: dims.largeur,
      height: dims.hauteur,
      draggable: false,
      selectable: false,
      focusable: false,
      data: {
        id: n.id,
        titre: e.titre,
        niveau: e.niveau,
        etat: etats[n.id] ?? "a-venir",
        cible: n.id === objectif,
        suivante: n.id === suivante && n.id !== objectif,
        estompe: chemin ? !chemin.has(n.id) : false,
        fiche: e.fiches.length > 0,
        ensemble,
      },
    };
  });
  const edges: Edge[] = aretes.map((a) => {
    const actif = chemin ? chemin.has(a.de) && chemin.has(a.vers) : false;
    return {
      id: `${a.de}->${a.vers}`,
      source: a.de,
      target: a.vers,
      type: "default",
      animated: actif,
      className: actif ? "arete-chemin" : chemin ? "arete-estompee" : "",
      markerEnd: ensemble ? undefined : { type: MarkerType.ArrowClosed, width: 14, height: 14 },
      focusable: false,
    };
  });

  return (
    <div className={`carte${ensemble ? " carte-ensemble" : ""}`} role="group" aria-label={`Feuille de route : ${feuille.etapes.length} compétences`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={TYPES}
        fitView
        fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
        minZoom={0.15}
        maxZoom={1.4}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={44} size={1} />
        <Controls showInteractive={false} position="bottom-right" />
        <Recadrage signature={`${ensemble}:${nodes.length}:${taille.largeur}`} />
      </ReactFlow>
      <p className="carte-aide pastille">{ensemble ? "Vue d'ensemble : répondez aux questions, elle se resserre sur vous" : "Faites glisser pour explorer · Ctrl + molette pour zoomer"}</p>
    </div>
  );
}

/**
 * La feuille de route en carte (React Flow). Elle se recompose en direct : chaque réponse déplace, retire ou ajoute des étapes,
 * et la carte se recadre. Sans réponse, c'est la vue d'ensemble (petits blocs) ; dès la première, les étapes se détaillent.
 */
export function CarteTransformation(props: Props) {
  return (
    <ReactFlowProvider>
      <Carte {...props} />
    </ReactFlowProvider>
  );
}
