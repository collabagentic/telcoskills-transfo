import { describe, expect, it } from "vitest";
import { verifierContenu } from "@/contenu/regles";
import { ficheSchema, questionSchema } from "@/contenu/schemas";
import { contenuValide, fiche } from "./fixtures/contenu";

const erreursDeRegle = (c: ReturnType<typeof contenuValide>, n: number) => verifierContenu(c).filter((e) => e.startsWith(`Règle ${n} `));

describe("règles du contenu", () => {
  it("accepte le jeu valide", () => {
    expect(verifierContenu(contenuValide())).toEqual([]);
  });

  it("règle 1 : id en double, référence inconnue", () => {
    const c = contenuValide();
    c.fiches.push(fiche("f1"));
    expect(erreursDeRegle(c, 1).join()).toContain("en double");
    const d = contenuValide();
    d.fiches[0].technos = ["inconnue"];
    expect(erreursDeRegle(d, 1).join()).toContain("n'existe pas");
    const e = contenuValide();
    e.metiers[0].savoirFaire[0].fiche = "fantome";
    expect(erreursDeRegle(e, 1).join()).toContain("fantome");
  });

  it("règle 2 : un acquis sans fiche, un transpose vers une nouveauté", () => {
    const c = contenuValide();
    c.metiers[0].savoirFaire[5].fiche = "f1";
    expect(erreursDeRegle(c, 2).join()).toContain("acquis");
    const d = contenuValide();
    d.metiers[0].savoirFaire[0].fiche = "n1";
    expect(erreursDeRegle(d, 2).join()).toContain("pas une transposition");
  });

  it("règle 3 : l'ordre doit être exactement l'ensemble des fiches", () => {
    const c = contenuValide();
    c.metiers[0].ordre = ["f1", "f1", "f2", "f3", "f4", "n1"];
    const e = erreursDeRegle(c, 3).join();
    expect(e).toContain("deux fois");
    expect(e).toContain("« f5 » manque");
  });

  it("règle 4 : réflexe et pourquoi-nouveau selon le genre", () => {
    const c = contenuValide();
    c.fiches[0].reflexe = null;
    expect(erreursDeRegle(c, 4).join()).toContain("réflexe");
    const d = contenuValide();
    d.fiches[5].reflexe = "Un réflexe.";
    d.fiches[5].pourquoiNouveau = null;
    expect(erreursDeRegle(d, 4).length).toBe(2);
  });

  it("règle 5 : sources, lien libre, exactement 2 questions", () => {
    const c = contenuValide();
    c.fiches[0].plusLoin = [{ ...c.fiches[0].plusLoin[0], acces: "payant" }];
    expect(erreursDeRegle(c, 5).join()).toContain("libre");
    expect(ficheSchema.safeParse({ ...fiche("x"), sources: [] }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...fiche("x"), questions: ["q-x-1"] }).success).toBe(false);
  });

  it("règle 6 : les longueurs maximales sont imposées", () => {
    expect(ficheSchema.safeParse({ ...fiche("x"), piege: "a".repeat(601) }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...fiche("x"), resteVrai: ["a".repeat(141), "b"] }).success).toBe(false);
    expect(questionSchema.safeParse({ id: "q", fiche: "x", enonce: "?", options: ["a", "b"], bonne: 2, explication: "e", source: "s", statut: "brouillon" }).success).toBe(false);
  });

  it("règle 7 : fiche orpheline, techno non citée", () => {
    const c = contenuValide();
    c.fiches.push(fiche("orpheline"));
    c.questions.push(...contenuValide().questions.slice(0, 0));
    expect(erreursDeRegle(c, 7).join()).toContain("orpheline");
    const d = contenuValide();
    d.technos.push({ id: "inutile", nom: "Inutile", url: "https://exemple.org" });
    expect(erreursDeRegle(d, 7).join()).toContain("inutile");
  });

  it("règle 8 : nombre de savoir-faire et d'acquis", () => {
    const c = contenuValide();
    c.metiers[0].savoirFaire = c.metiers[0].savoirFaire.slice(0, 6);
    expect(erreursDeRegle(c, 8).length).toBeGreaterThan(0);
    const d = contenuValide();
    d.metiers[0].savoirFaire[5].statut = "transpose";
    d.metiers[0].savoirFaire[5].fiche = "f1";
    expect(erreursDeRegle(d, 8).join()).toContain("3 savoir-faire acquis");
  });

  it("règle 9 : historique trié, première date = mise à jour", () => {
    const c = contenuValide();
    c.fiches[0].misAJour = "2026-12-01";
    expect(erreursDeRegle(c, 9).join()).toContain("misAJour");
    const d = contenuValide();
    d.fiches[0].historique = [
      { date: "2026-01-01", changement: "x", par: "t", lien: null },
      { date: "2026-11-08", changement: "y", par: "t", lien: null },
    ];
    expect(erreursDeRegle(d, 9).join()).toContain("trié");
  });
});
