import { describe, expect, it } from "vitest";
import { cheminComplet, DIMS_ENSEMBLE, placer, tailleGraphe } from "@/lib/carte";

const ordre = ["a", "b", "c", "d", "e"];
const dep = { b: ["a"], c: ["a"], d: ["b", "c"], e: ["d"] };

describe("placer", () => {
  it("place chaque étape une couche après ses prérequis", () => {
    const couche = Object.fromEntries(placer(ordre, dep).noeuds.map((n) => [n.id, n.couche]));
    expect(couche).toEqual({ a: 0, b: 1, c: 1, d: 2, e: 3 });
  });

  it("deux étapes d'une même couche n'ont pas la même position", () => {
    const { noeuds } = placer(ordre, dep);
    const b = noeuds.find((n) => n.id === "b")!;
    const c = noeuds.find((n) => n.id === "c")!;
    expect(b.x).toBe(c.x);
    expect(b.y).not.toBe(c.y);
  });

  it("relie chaque prérequis à son étape, en ignorant les prérequis absents", () => {
    expect(placer(ordre, dep).aretes.length).toBe(5);
    expect(placer(["x", "y"], { y: ["x", "absent"] }).aretes).toEqual([{ de: "x", vers: "y" }]);
  });

  it("sans dépendances, toutes les étapes sont dans la première couche", () => {
    expect(placer(["x", "y"], {}).noeuds.every((n) => n.couche === 0)).toBe(true);
  });

  it("ne plante pas sur une boucle (interdite par les règles du build)", () => {
    expect(() => placer(["a", "b"], { a: ["b"], b: ["a"] })).not.toThrow();
  });

  it("la vue d'ensemble est plus compacte", () => {
    const grand = tailleGraphe(placer(ordre, dep).noeuds);
    const petit = tailleGraphe(placer(ordre, dep, DIMS_ENSEMBLE).noeuds, DIMS_ENSEMBLE);
    expect(petit.largeur).toBeLessThan(grand.largeur);
  });

  it("chemin complet", () => {
    expect([...cheminComplet("d", dep)].sort()).toEqual(["a", "b", "c", "d"]);
  });
});
