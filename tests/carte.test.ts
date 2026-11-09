import { describe, expect, it } from "vitest";
import { cheminComplet, cheminRestant, etatCarte, placer, prerequisTransitifs } from "@/lib/carte";
import { chargerContenu } from "@/contenu/charger";

const ordre = ["a", "b", "c", "d", "e"];
const dep = { b: ["a"], c: ["a"], d: ["b", "c"], e: ["d"] };

describe("placer", () => {
  it("place chaque étape une couche après ses prérequis", () => {
    const { noeuds } = placer(ordre, dep);
    const couche = Object.fromEntries(noeuds.map((n) => [n.id, n.couche]));
    expect(couche).toEqual({ a: 0, b: 1, c: 1, d: 2, e: 3 });
  });

  it("deux étapes d'une même couche n'ont pas la même position", () => {
    const { noeuds } = placer(ordre, dep);
    const b = noeuds.find((n) => n.id === "b")!;
    const c = noeuds.find((n) => n.id === "c")!;
    expect(b.x).toBe(c.x);
    expect(b.y).not.toBe(c.y);
  });

  it("relie chaque prérequis à son étape", () => {
    expect(placer(ordre, dep).aretes).toContainEqual({ de: "b", vers: "d" });
    expect(placer(ordre, dep).aretes.length).toBe(5);
  });

  it("sans dépendances, toutes les étapes sont dans la première couche", () => {
    expect(placer(["x", "y"], {}).noeuds.every((n) => n.couche === 0)).toBe(true);
  });

  it("ne plante pas sur une boucle (interdite par les règles du build)", () => {
    expect(() => placer(["a", "b"], { a: ["b"], b: ["a"] })).not.toThrow();
  });
});

describe("états et chemin", () => {
  it("une étape est disponible quand ses prérequis sont lus, à venir sinon, jamais verrouillée", () => {
    expect(etatCarte("a", {}, dep)).toBe("disponible");
    expect(etatCarte("b", {}, dep)).toBe("a-venir");
    expect(etatCarte("b", { a: "lu" }, dep)).toBe("disponible");
    expect(etatCarte("b", { b: "lu" }, dep)).toBe("lu");
    expect(etatCarte("b", { b: "verifie" }, dep)).toBe("verifie");
  });

  it("prérequis transitifs", () => {
    expect([...prerequisTransitifs("e", dep)].sort()).toEqual(["a", "b", "c", "d"]);
    expect([...prerequisTransitifs("a", dep)]).toEqual([]);
  });

  it("chemin restant : prérequis non vérifiés puis la cible, dans l'ordre", () => {
    expect(cheminRestant("d", ordre, dep, {})).toEqual(["a", "b", "c", "d"]);
    expect(cheminRestant("d", ordre, dep, { a: "verifie", b: "verifie" })).toEqual(["c", "d"]);
    expect(cheminRestant("d", ordre, dep, { a: "verifie", b: "verifie", c: "verifie", d: "verifie" })).toEqual([]);
    expect(cheminRestant("inconnue", ordre, dep, {})).toEqual([]);
  });

  it("chemin complet", () => {
    expect([...cheminComplet("d", dep)].sort()).toEqual(["a", "b", "c", "d"]);
  });
});

describe("cartes du contenu réel", () => {
  it("chaque métier se place sans chevauchement", () => {
    for (const m of chargerContenu().metiers) {
      const { noeuds } = placer(m.ordre, m.dependances);
      expect(noeuds.length).toBe(m.ordre.length);
      const cles = noeuds.map((n) => `${n.x}:${n.y}`);
      expect(new Set(cles).size, m.id).toBe(cles.length);
    }
  });
});
