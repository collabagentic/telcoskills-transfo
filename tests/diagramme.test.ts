import { describe, expect, it } from "vitest";
import { ancrage, cotesAuto, tracer, tracerLiens, verifierDiagramme } from "@/contenu/diagramme";
import type { Diagramme } from "@/contenu/schemas";
import { chargerContenu } from "@/contenu/charger";

const base = (): Diagramme => ({
  legende: "Test",
  largeur: 400,
  hauteur: 200,
  zones: [],
  noeuds: [
    { id: "a", texte: "A", x: 20, y: 70, w: 100, h: 40 },
    { id: "b", texte: "B", x: 280, y: 70, w: 100, h: 40 },
  ],
  liens: [{ de: "a", vers: "b", texte: "x" }],
  source: { nom: "Source", url: "https://exemple.org" },
});

describe("géométrie", () => {
  const boite = { x: 100, y: 50, w: 80, h: 40 };
  it("ancrages au milieu des côtés, avec décalage", () => {
    expect(ancrage(boite, "g")).toEqual({ x: 100, y: 70 });
    expect(ancrage(boite, "d", 10)).toEqual({ x: 180, y: 80 });
    expect(ancrage(boite, "h")).toEqual({ x: 140, y: 50 });
    expect(ancrage(boite, "b", -5)).toEqual({ x: 135, y: 90 });
  });

  it("côtés automatiques selon l'axe le plus écarté", () => {
    expect(cotesAuto(boite, { x: 300, y: 50, w: 80, h: 40 })).toEqual({ sortie: "d", entree: "g" });
    expect(cotesAuto(boite, { x: 100, y: 300, w: 80, h: 40 })).toEqual({ sortie: "b", entree: "h" });
    expect(cotesAuto({ x: 300, y: 50, w: 80, h: 40 }, boite)).toEqual({ sortie: "g", entree: "d" });
  });

  it("tracé droit si aligné, en Z si décalé, en L si perpendiculaire", () => {
    expect(tracer({ x: 0, y: 10 }, "d", { x: 100, y: 10 }, "g")).toHaveLength(2);
    expect(tracer({ x: 0, y: 10 }, "d", { x: 100, y: 50 }, "g")).toHaveLength(4);
    expect(tracer({ x: 0, y: 10 }, "b", { x: 100, y: 50 }, "g")).toEqual([
      { x: 0, y: 10 },
      { x: 0, y: 50 },
      { x: 100, y: 50 },
    ]);
  });

  it("chaque flèche est tracée avec son étiquette", () => {
    const t = tracerLiens(base());
    expect(t).toHaveLength(1);
    expect(t[0].texte).toBe("x");
    expect(t[0].milieu).toEqual({ x: 200, y: 90 });
  });
});

describe("contrôles du build", () => {
  it("accepte un diagramme valide", () => {
    expect(verifierDiagramme(base())).toEqual([]);
  });

  it("refuse un composant qui déborde du cadre", () => {
    const d = base();
    d.noeuds[1].x = 350;
    expect(verifierDiagramme(d).join()).toContain("dépasse du cadre");
  });

  it("refuse deux composants qui se chevauchent", () => {
    const d = base();
    d.noeuds[1].x = 100;
    expect(verifierDiagramme(d).join()).toContain("se chevauchent");
  });

  it("refuse un texte trop long pour sa boîte", () => {
    const d = base();
    d.noeuds[0].texte = "Un titre beaucoup trop long";
    expect(verifierDiagramme(d).join()).toContain("trop long");
  });

  it("refuse une flèche vers un composant inconnu", () => {
    const d = base();
    d.liens.push({ de: "a", vers: "fantome" });
    expect(verifierDiagramme(d).join()).toContain("inconnu");
  });

  it("refuse une flèche qui traverse un autre composant", () => {
    const d = base();
    d.noeuds.push({ id: "c", texte: "C", x: 150, y: 70, w: 100, h: 40 });
    expect(verifierDiagramme(d).join()).toContain("traverse");
  });

  it("refuse un composant qui sort de sa zone ou empiète sur une zone étrangère", () => {
    const d = base();
    d.zones.push({ id: "z", titre: "Zone", x: 10, y: 60, w: 130, h: 60 });
    expect(verifierDiagramme(d).join()).toContain("empiète");
    d.noeuds[0].zone = "z";
    d.noeuds[0].w = 140;
    expect(verifierDiagramme(d).join()).toContain("sort de sa zone");
  });
});

describe("diagrammes du contenu", () => {
  it("sont tous valides et il y en a plusieurs", () => {
    const c = chargerContenu();
    const tous = [...c.competences.flatMap((x) => (x.diagramme ? [x.diagramme] : [])), ...c.fiches.flatMap((f) => (f.diagramme ? [f.diagramme] : []))];
    expect(tous.length).toBeGreaterThanOrEqual(6);
    for (const d of tous) expect(verifierDiagramme(d), d.legende).toEqual([]);
  });
});
