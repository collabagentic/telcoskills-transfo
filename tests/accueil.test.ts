import { describe, expect, it } from "vitest";
import { chargerContenu } from "@/contenu/charger";
import { FICHE_EXEMPLE } from "@/lib/site";

describe("fiche d'exemple de l'accueil", () => {
  it("FICHE_EXEMPLE pointe une fiche existante, une transposition avec un réflexe", () => {
    const fiche = chargerContenu().fiches.find((f) => f.id === FICHE_EXEMPLE);
    expect(fiche, "la fiche « " + FICHE_EXEMPLE + " » doit exister dans content/fiches").toBeDefined();
    expect(fiche?.genre, "la fiche d'exemple doit être une transposition").toBe("transposition");
    expect(fiche?.reflexe, "la fiche d'exemple doit avoir un réflexe à lâcher").toBeTruthy();
  });
});
