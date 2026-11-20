import { describe, expect, it } from "vitest";
import { verifierContenu } from "@/contenu/regles";
import { competenceSchema, ficheSchema, orientationSchema } from "@/contenu/schemas";
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
    e.fiches[0].competences = ["fantome"];
    expect(erreursDeRegle(e, 1).join()).toContain("fantome");
  });

  it("règle 4 : réflexe et pourquoi-nouveau selon le genre", () => {
    const c = contenuValide();
    c.fiches[0].reflexe = null;
    expect(erreursDeRegle(c, 4).join()).toContain("réflexe");
    const d = contenuValide();
    d.fiches[1].reflexe = "Un réflexe.";
    d.fiches[1].pourquoiNouveau = null;
    expect(erreursDeRegle(d, 4).length).toBe(2);
  });

  it("règle 5 : sources, lien libre, une épreuve", () => {
    const c = contenuValide();
    c.fiches[0].plusLoin = [{ ...c.fiches[0].plusLoin[0], acces: "payant" }];
    expect(erreursDeRegle(c, 5).join()).toContain("libre");
    expect(ficheSchema.safeParse({ ...fiche("x"), sources: [] }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...fiche("x"), epreuve: undefined }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...fiche("x"), competences: [] }).success).toBe(false);
  });

  it("règle 6 : les longueurs maximales sont imposées", () => {
    expect(ficheSchema.safeParse({ ...fiche("x"), piege: "a".repeat(601) }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...fiche("x"), resteVrai: ["a".repeat(141), "b"] }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...fiche("x"), epreuve: { cas: "a".repeat(401), raisonnement: "r", source: "s" } }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...fiche("x"), categorie: "autre" }).success).toBe(false);
  });

  it("règle 7 : techno non citée", () => {
    const d = contenuValide();
    d.technos.push({ id: "inutile", nom: "Inutile", url: "https://exemple.org" });
    expect(erreursDeRegle(d, 7).join()).toContain("inutile");
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

  it("règle 11 : une transposition a un schéma avant, une nouveauté non", () => {
    const c = contenuValide();
    c.fiches[0].schema.avant = null;
    c.fiches[1].schema.avant = [{ texte: "A" }, { texte: "B" }];
    expect(erreursDeRegle(c, 11).length).toBe(2);
  });

  it("règle 12 : prérequis inconnu, auto-référence, boucle, domaine inconnu", () => {
    const a = contenuValide();
    a.competences[1].prerequis = ["fantome"];
    expect(erreursDeRegle(a, 12).join()).toContain("n'existe pas");
    const b = contenuValide();
    b.competences[0].prerequis = ["c1"];
    expect(erreursDeRegle(b, 12).join()).toContain("son propre prérequis");
    const c = contenuValide();
    c.competences[0].prerequis = ["c3"]; // c1 → c3 → c2 → c1
    expect(erreursDeRegle(c, 12).join()).toContain("boucle");
    const d = contenuValide();
    d.competences[0].domaine = "inconnu";
    expect(erreursDeRegle(d, 12).join()).toContain("domaine");
  });

  it("règle 13 : les effets des questions d'orientation référencent des compétences et des domaines existants", () => {
    const a = contenuValide();
    a.orientation.questions[0].options[0].effets = { acquis: ["fantome"] };
    expect(erreursDeRegle(a, 13).join()).toContain("fantome");
    const b = contenuValide();
    b.orientation.questions[0].options[0].effets = { domaines: { inconnu: 2 } };
    expect(erreursDeRegle(b, 13).join()).toContain("domaine");
    const c = contenuValide();
    c.orientation.questions[0].options[0].effets = { cible: ["c1"], acquis: ["c1"] };
    expect(erreursDeRegle(c, 13).join()).toContain("à la fois");
    expect(orientationSchema.safeParse({ ...contenuValide().orientation, questions: contenuValide().orientation.questions.slice(0, 4) }).success).toBe(false);
    expect(competenceSchema.safeParse({ id: "x" }).success).toBe(false);
  });
});

describe("règle 16 : avis d'auteur", () => {
  const erreurs16 = (c: ReturnType<typeof contenuValide>) => verifierContenu(c).filter((e) => e.startsWith("Règle 16 "));

  it("accepte des passages qui existent", () => {
    const c = contenuValide();
    c.fiches[0].avisAuteur = ["resteVrai.0", "change", "piege", "reflexe"];
    expect(erreurs16(c)).toEqual([]);
  });

  it("refuse un champ vide, une puce absente ou un doublon", () => {
    const c = contenuValide();
    c.fiches[1].avisAuteur = ["reflexe"]; // une nouveauté n'a pas de réflexe
    c.fiches[0].avisAuteur = ["resteVrai.3", "piege", "piege"];
    const e = erreurs16(c).join("\n");
    expect(e).toContain("le champ est vide");
    expect(e).toContain("n'existe pas");
    expect(e).toContain("deux fois");
  });

  it("refuse un nom de passage inconnu", () => {
    expect(ficheSchema.safeParse({ ...fiche("x"), avisAuteur: ["titre"] }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...fiche("x"), avisAuteur: ["change.4"] }).success).toBe(false);
  });
});
