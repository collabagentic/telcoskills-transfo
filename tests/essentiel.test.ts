import { describe, expect, it } from "vitest";
import { chargerContenu } from "@/contenu/charger";
import { essentiel } from "@/contenu/lecture";

// L3-C1 : le bandeau « L'essentiel en 30 secondes » s'applique aux 21 fiches réelles.
describe("essentiel (bandeau 30 secondes)", () => {
  it("s'applique aux 21 fiches réelles sans champ vide", () => {
    const fiches = chargerContenu().fiches;
    expect(fiches.length).toBeGreaterThanOrEqual(21);
    for (const f of fiches) {
      const e = essentiel(f);
      expect(e.resume.apres.trim().length, f.id + " : resume.apres").toBeGreaterThan(0);
      expect(e.pivot.texte.trim().length, f.id + " : pivot").toBeGreaterThan(0);
      expect(e.changement.texte.trim().length, f.id + " : change[0]").toBeGreaterThan(0);
      if (e.resume.avant !== null) {
        expect(e.resume.avant.trim().length, f.id + " : resume.avant").toBeGreaterThan(0);
      }
    }
  });

  it("lit les textes tels quels (aucune réécriture)", () => {
    for (const f of chargerContenu().fiches) {
      const e = essentiel(f);
      expect(e.resume.apres, f.id + " : resume.apres").toBe(f.resume.apres);
      expect(e.resume.avant, f.id + " : resume.avant").toBe(f.resume.avant);
      expect(e.changement.texte, f.id + " : change[0]").toBe(f.change[0]);
      const pivotAttendu = f.genre === "transposition" ? f.reflexe : f.pourquoiNouveau;
      expect(e.pivot.texte, f.id + " : pivot").toBe(pivotAttendu);
      expect(e.pivot.type, f.id + " : type").toBe(f.genre === "transposition" ? "reflexe" : "pourquoiNouveau");
    }
  });

  it("met l'étiquette quand le champ source est dans avisAuteur", () => {
    for (const f of chargerContenu().fiches) {
      const avis = f.avisAuteur ?? [];
      const e = essentiel(f);
      expect(e.resume.avis, f.id + " : resume").toBe(avis.includes("resume"));
      expect(e.pivot.avis, f.id + " : pivot").toBe(avis.includes(e.pivot.type));
      expect(e.changement.avis, f.id + " : change.0").toBe(avis.includes("change") || avis.includes("change.0"));
    }
  });
});
