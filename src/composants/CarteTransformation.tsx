"use client";

import "@xyflow/react/dist/style.css";
import { Background, Controls, Handle, MarkerType, Position, ReactFlow, type Edge, type Node, type NodeProps, type ReactFlowInstance } from "@xyflow/react";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { cheminComplet, etatCarte, HAUTEUR_NOEUD, LARGEUR_NOEUD, placer, tailleGraphe, type EtatCarte } from "@/lib/carte";
import type { Etat, Mode } from "@/lib/bilan";
import type { FicheLite, MetierLite } from "@/contenu/publiques";

type DonneesEtape = {
  id: string;
  titre: string;
  temps: number;
  mode: Mode;
  etat: EtatCarte;
  cible: boolean;
  suivante: boolean;
  estompe: boolean;
  [cle: string]: unknown;
};

const LIBELLE_ETAT: Record<EtatCarte, string> = { verifie: "vérifiée", lu: "lue", disponible: "à lire", "a-venir": "conseillée plus tard" };
const LIBELLE_MODE: Record<Mode, string> = { transposition: "Change de forme", nouveaute: "Nouveau", decouvrir: "À découvrir" };

/** Une étape : un vrai lien (clavier et lecteur d'écran fonctionnent sans rien de plus). */
function Etape({ data }: NodeProps<Node<DonneesEtape>>) {
  const classes = ["etape", `etape-${data.etat}`, `etape-${data.mode}`, data.cible ? "etape-cible" : "", data.suivante ? "etape-suivante" : "", data.estompe ? "etape-estompee" : ""].join(" ");
  const repere = data.cible ? "Objectif" : data.suivante ? "Prochaine" : "";
  return (
    <>
      <Handle type="target" position={Position.Left} className="poignee" isConnectable={false} />
      <Link
        href={`/fiche/${data.id}`}
        className={`${classes} nodrag nopan`}
        style={{ width: LARGEUR_NOEUD, height: HAUTEUR_NOEUD }}
        aria-label={`${data.titre} — ${LIBELLE_ETAT[data.etat]}${data.cible ? " — objectif" : ""}${data.suivante ? " — prochaine étape" : ""}`}
      >
        <span className="etape-entete">
          <span className={`etat etat-${data.etat === "verifie" ? "verifie" : data.etat === "lu" ? "lu" : "vide"}`} aria-hidden="true" />
          <span className="etape-genre">{LIBELLE_MODE[data.mode]}</span>
          {repere ? <span className="etape-repere">{repere}</span> : <span className="etape-temps">{data.temps} min</span>}
        </span>
        <span className="etape-titre">{data.titre}</span>
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
  suivante: string | null;
};

/**
 * Carte de transformation (React Flow) : seulement les étapes du métier, reliées par leurs prérequis conseillés.
 * Placement calculé (src/lib/carte.ts), style entièrement piloté par nos jetons ; l'étape est un lien vers la fiche.
 * Le zoom initial garde le texte lisible : si la carte est plus large que l'écran, on la fait glisser plutôt que la rétrécir.
 */
export function CarteTransformation({ metier, fiches, modes, etats, objectif, suivante }: Props) {
  const conteneur = useRef<HTMLDivElement>(null);
  const { noeuds, aretes } = useMemo(() => placer(metier.ordre, metier.dependances), [metier]);
  const taille = useMemo(() => tailleGraphe(noeuds), [noeuds]);
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
      suivante: n.id === suivante && n.id !== objectif,
      estompe: chemin ? !chemin.has(n.id) : false,
    },
  }));
  const edges: Edge[] = aretes.map((a) => {
    const actif = chemin ? chemin.has(a.de) && chemin.has(a.vers) : false;
    return {
      id: `${a.de}->${a.vers}`,
      source: a.de,
      target: a.vers,
      type: "default",
      animated: actif,
      className: actif ? "arete-chemin" : chemin ? "arete-estompee" : "",
      markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
      focusable: false,
    };
  });

  /** Zoom lisible (0,8 à 1), carte alignée à gauche et centrée en hauteur ; le reste se découvre en la faisant glisser. */
  const regler = (rf: ReactFlowInstance<Node<DonneesEtape>, Edge>) => {
    const el = conteneur.current;
    if (!el) return;
    const zoom = Math.min(1, Math.max(0.8, (el.clientWidth - 48) / taille.largeur));
    rf.setViewport({ x: 24, y: Math.max(24, (el.clientHeight - taille.hauteur * zoom) / 2), zoom });
  };

  return (
    <div className="carte" ref={conteneur} role="group" aria-label={`Carte de transformation : ${metier.nom}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={TYPES}
        onInit={regler}
        minZoom={0.5}
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
      </ReactFlow>
      <p className="carte-aide pastille">Faites glisser pour explorer · Ctrl + molette pour zoomer</p>
    </div>
  );
}
