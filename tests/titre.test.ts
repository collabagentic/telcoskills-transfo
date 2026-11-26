import { describe, expect, it } from "vitest";
import { chargerContenu } from "@/contenu/charger";
import { titreFiche } from "@/contenu/lecture";

describe("titre des fiches", () => {
  it("accorde le possessif avec un pluriel", () => {
    expect(titreFiche({ genre: "transposition", avant: "compteurs et alarmes", apres: "métriques" })).toBe("Vos compteurs et alarmes, version métriques.");
    expect(titreFiche({ genre: "transposition", avant: "matrice de flux", apres: "NetworkPolicy" })).toBe("Votre matrice de flux, version NetworkPolicy.");
    expect(titreFiche({ genre: "nouveaute", avant: null, apres: "Les opérateurs" })).toBe("Les opérateurs.");
  });
  it("aucun titre réel ne commence par « Votre » suivi d'un pluriel", () => {
    for (const f of chargerContenu().fiches) expect(titreFiche(f), f.id).not.toMatch(/^Votre \S+[sx]\s/);
  });
});
