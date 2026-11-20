import { describe, expect, it } from "vitest";
import { analyserParcours } from "@/lib/stockage";

describe("stockage : de « vérifiée » à « acquise »", () => {
  const brut = (fiches: unknown) => JSON.stringify({ v: 2, reponses: {}, maitrisees: [], fiches });

  it("reprend une ancienne fiche « vérifiée » comme « acquise », avec sa date", () => {
    const p = analyserParcours(brut({ f1: { lu: "2026-11-01", verifie: "2026-11-02" } }))!;
    expect(p.fiches.f1).toEqual({ lu: "2026-11-01", acquis: "2026-11-02" });
  });

  it("garde une fiche déjà « acquise » et une fiche seulement lue", () => {
    const p = analyserParcours(brut({ f1: { lu: "j", acquis: "k" }, f2: { lu: "j" } }))!;
    expect(p.fiches.f1.acquis).toBe("k");
    expect(p.fiches.f2).toEqual({ lu: "j" });
  });
});
