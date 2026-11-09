"use client";

import "@xyflow/react/dist/style.css";
import { Background, Controls, Handle, MarkerType, Position, ReactFlow, type Edge, type Node, type NodeProps } from "@xyflow/react";
import Link from "next/link";
import { useMemo } from "react";
import { cheminComplet, etatCarte, HAUTEUR_NOEUD, LARGEUR_NOEUD, placer, type EtatCarte } from "@/lib/carte";
import type { Etat, Mode } from "@/lib/bilan";
import type { FicheLite, MetierLite } from "@/contenu/publiques";

type DonneesEtape = {
  id: string;
  titre: string;
  temps: number;
  mode: Mode;
  etat: EtatCarte;
  cible: boolean;
  surChemin: boolean;
  estompe: boolean;
  [cle: string]: unknown;
};

const LIBELLE_ETAT: Record<EtatCarte, string> = { verifie: "vérifiée", lu: "lue", disponible: "à lire", "a-venir": "conseillée plus tard" };
const LIBELLE_MODE: Record<Mode, string> = { transposition: "change de forme", nouveaute: "nouveau", decouvrir: "à découvrir" };

/** Une étape : un vrai lien (clavier et lecteur d'écran fonctionnent sans rien de plus). */
function Etape({ data }: NodeProps<Node<DonneesEtape>>) {
  const classes = ["etape", `etape-${data.etat}`, `etape-${data.mode}`, data.cible ? "etape-cible" : "", data.estompe ? "etape-estompee" : ""].join(" ");
  return (
    <>
      <Handle type="target" position={Position.Left} className="poignee" isConnectable={false} />
      <Link href={`/fiche/${data.id}`} className={`${classes} nodrag nopan`} style={{ width: LARGEUR_NOEUD, height: HAUTEUR_NOEUD }} aria-label={`${data.titre} — ${LIBELLE_ETAT[data.etat]}`}>
      <span className="pastille">
        <span className={`etat etat-${data.etat === "verifie" ? "verifie" : data.etat === "lu" ? "lu" : "vide"}`} aria-hidden="true" />
        {LIBELLE_MODE[data.mode]} · {data.temps} min
      </span>
      <span className="etape-titre">{data.titre}</span>
      {data.cible ? <span className="pastille etape-objectif">Objectif</span> : null}
      </Link>
      <Handle type="source" position={Position.Right} className="poignee" isConnectable={false} />
    </>
  );
}

const TYPES = { etape: Etape };

type Props = {
  metier: MetierLite;
  fiches: Record<string, FicheLite>;
  modes: Record<string, Mode>;
  etats: Record<string, Etat>;
  objectif: string | null;
};

/**
 * Carte de transformation (React Flow) : seulement les étapes du métier, reliées par leurs prérequis conseillés.
 * Placement calculé (src/lib/carte.ts), style entièrement piloté par nos jetons ; l'étape est un lien vers la fiche.
 */
export function CarteTransformation({ metier, fiches, modes, etats, objectif }: Props) {
  const { noeuds, aretes } = useMemo(() => placer(metier.ordre, metier.dependances), [metier]);
  const chemin = useMemo(() => (objectif ? cheminComplet(objectif, metier.dependances) : null), [objectif, metier]);

  const nodes: Node<DonneesEtape>[] = noeuds.map((n) => ({
    id: n.id,
    type: "etape",
    position: { x: n.x, y: n.y },
    width: LARGEUR_NOEUD,
    height: HAUTEUR_NOEUD,
    draggable: false,
    selectable: false,
    focusable: false,
    data: {
      id: n.id,
      titre: fiches[n.id]?.titre ?? n.id,
      temps: fiches[n.id]?.temps ?? 0,
      mode: modes[n.id] ?? "transposition",
      etat: etatCarte(n.id, etats, metier.dependances),
      cible: n.id === objectif,
      surChemin: chemin?.has(n.id) ?? false,
      estompe: chemin ? !chemin.has(n.id) : false,
    },
  }));
  const edges: Edge[] = aretes.map((a) => {
    const actif = chemin ? chemin.has(a.de) && chemin.has(a.vers) : false;
    return {
      id: `${a.de}->${a.vers}`,
      source: a.de,
      target: a.vers,
      type: "smoothstep",
      animated: actif,
      className: actif ? "arete-chemin" : chemin ? "arete-estompee" : "",
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      focusable: false,
    };
  });

  return (
    <div className="carte" role="group" aria-label={`Carte de transformation : ${metier.nom}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={TYPES}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.4}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={44} size={1} />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
