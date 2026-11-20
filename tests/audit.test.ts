import { describe, expect, it } from "vitest";
import { auditFiches, lireSuivi } from "@/contenu/audit";
import { chargerContenu } from "@/contenu/charger";

describe("audit des fiches", () => {
  const ids = new Set(chargerContenu().fiches.map((f) => f.id));

  it("une ligne par fiche, avec son classement et ce qui reste à vérifier", () => {
    const a = auditFiches();
    expect(a.lignes).toHaveLength(ids.size);
    for (const l of a.lignes) {
      expect(["comprendre", "pratique", "integrer", "diagnostiquer", "decider"]).toContain(l.categorie);
      expect(l.fini).toBe(l.statut === "relu");
      if (!l.fini) expect(l.aVerifier).toContain("Pas relue par l'auteur");
    }
  });

  it("les notes et les classements validés visent des fiches qui existent", () => {
    const s = lireSuivi();
    for (const n of s.notes) expect(ids.has(n.fiche), n.fiche).toBe(true);
    for (const id of s.classementValide) expect(ids.has(id), id).toBe(true);
  });

  it("un classement validé n'est plus signalé « à confirmer »", () => {
    const a = auditFiches();
    for (const l of a.lignes) expect(l.aVerifier.includes("Catégorie à confirmer")).toBe(!l.classementValide);
  });
});
