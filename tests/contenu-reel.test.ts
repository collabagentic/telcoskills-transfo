import { describe, expect, it } from "vitest";
import { chargerContenu } from "@/contenu/charger";
import { tempsLecture } from "@/contenu/lecture";

// Le contenu publié doit être valide : c'est la même vérification que le build (la CI échoue sinon).
describe("contenu réel", () => {
  it("se charge sans erreur", () => {
    const c = chargerContenu();
    expect(c.competences.length).toBeGreaterThan(100);
    expect(c.orientation.questions.length).toBeGreaterThanOrEqual(5);
    expect(c.fiches.every((f) => f.statut === "brouillon" || f.statut === "relu")).toBe(true);
  });

  it("le temps de lecture de chaque fiche est raisonnable (2 à 10 minutes)", () => {
    for (const f of chargerContenu().fiches) {
      const t = tempsLecture(f);
      expect(t, f.id).toBeGreaterThanOrEqual(2);
      expect(t, f.id).toBeLessThanOrEqual(10);
    }
  });
});
