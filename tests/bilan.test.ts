import { describe, expect, it } from "vitest";
import { calculerBilan, calculerPlan, ficheSuivante, type Bilan, type FichePourBilan, type MetierPourBilan } from "@/lib/bilan";
import { melanger, tempsLecture, titreFiche } from "@/contenu/lecture";
import { fiche } from "./fixtures/contenu";

const metier: MetierPourBilan = {
  id: "m",
  savoirFaire: [
    { id: "a", statut: "transpose", fiche: "t1" },
    { id: "b", statut: "transpose", fiche: "t2" },
    { id: "c", statut: "acquis" },
    { id: "d", statut: "acquis" },
  ],
  nouveautes: ["n1"],
  ordre: ["t1", "t2", "n1"],
};
const fiches: Record<string, FichePourBilan> = {
  t1: { id: "t1", genre: "transposition", reflexe: "r1" },
  t2: { id: "t2", genre: "transposition", reflexe: "r2" },
  n1: { id: "n1", genre: "nouveaute", reflexe: null },
};

describe("calculerBilan", () => {
  it("tout coché", () => {
    expect(calculerBilan(metier, fiches, [])).toMatchObject({ forme: 2, nouveaux: 1, lacher: 2, decouvrir: 0, total: 3 });
  });

  it("tout décoché : les transpositions restent dans le plan, à découvrir, sans réflexe compté", () => {
    const r = calculerBilan(metier, fiches, ["a", "b", "c", "d"]);
    expect(r).toMatchObject({ forme: 0, nouveaux: 1, lacher: 0, decouvrir: 2, total: 3 });
    expect(r.fiches.map((f) => f.mode)).toEqual(["decouvrir", "decouvrir", "nouveaute"]);
  });

  it("décocher des acquis ne change rien au plan", () => {
    expect(calculerBilan(metier, fiches, ["c", "d"])).toEqual(calculerBilan(metier, fiches, []));
  });

  it("une transposition décochée passe en « à découvrir »", () => {
    const r = calculerBilan(metier, fiches, ["a"]);
    expect(r).toMatchObject({ forme: 1, lacher: 1, decouvrir: 1 });
    expect(r.fiches[0]).toEqual({ id: "t1", mode: "decouvrir" });
  });

  it("un réflexe n'est compté qu'une fois même si deux savoir-faire renvoient à la même fiche", () => {
    const deux: MetierPourBilan = { ...metier, savoirFaire: [...metier.savoirFaire, { id: "e", statut: "transpose", fiche: "t1" }] };
    expect(calculerBilan(deux, fiches, []).lacher).toBe(2);
    expect(calculerBilan(deux, fiches, ["a"]).fiches[0].mode).toBe("transposition"); // « e » reste coché
  });
});

describe("calculerPlan", () => {
  const bilan = (f: Bilan["fiches"]): Bilan => ({ v: 1, metier: "m", decoches: [], fiches: f });

  it("la reprise est la première fiche non vérifiée", () => {
    const p = calculerPlan(bilan({ t1: { lu: "2026-11-08", verifie: "2026-11-08" }, t2: { lu: "2026-11-08" } }), metier, fiches);
    expect(p.reprise).toBe("t2");
    expect(p).toMatchObject({ verifiees: 1, lues: 2, total: 3, termine: false });
  });

  it("le plan est terminé quand toutes les fiches sont lues", () => {
    const j = "2026-11-08";
    const p = calculerPlan(bilan({ t1: { lu: j }, t2: { lu: j, verifie: j }, n1: { lu: j } }), metier, fiches);
    expect(p.termine).toBe(true);
    expect(p.reprise).toBe("t1");
  });

  it("fiche suivante", () => {
    const p = calculerPlan(bilan({}), metier, fiches);
    expect(ficheSuivante(p, "t1")).toBe("t2");
    expect(ficheSuivante(p, "n1")).toBeNull();
  });
});

describe("lecture", () => {
  it("titre d'une transposition et d'une nouveauté", () => {
    expect(titreFiche(fiche("x"))).toBe("Votre ancien, version nouveau.");
    expect(titreFiche(fiche("x", "nouveaute"))).toBe("nouveau.");
  });

  it("temps de lecture : minimum 2 minutes, arrondi supérieur", () => {
    expect(tempsLecture(fiche("x"))).toBe(2);
    const long = { ...fiche("x"), piege: Array(450).fill("mot").join(" ") };
    expect(tempsLecture(long)).toBe(3);
  });

  it("le mélange est déterministe et conserve les éléments", () => {
    const a = melanger([1, 2, 3, 4, 5], "graine");
    expect(a).toEqual(melanger([1, 2, 3, 4, 5], "graine"));
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
