import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { chargerContenu } from "@/contenu/charger";
import { FICHE_EXEMPLE } from "@/lib/site";

const RACINE = path.join(import.meta.dirname, "..");

function fichiersSource(dossier: string): string[] {
  const resultat: string[] = [];
  for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) resultat.push(...fichiersSource(p));
    else if (/\.(ts|tsx)$/.test(e.name)) resultat.push(p);
  }
  return resultat;
}

describe("fiche d'exemple de l'accueil", () => {
  it("FICHE_EXEMPLE pointe une fiche existante, une transposition avec un réflexe", () => {
    const fiche = chargerContenu().fiches.find((f) => f.id === FICHE_EXEMPLE);
    expect(fiche, "la fiche « " + FICHE_EXEMPLE + " » doit exister dans content/fiches").toBeDefined();
    expect(fiche?.genre, "la fiche d'exemple doit être une transposition").toBe("transposition");
    expect(fiche?.reflexe, "la fiche d'exemple doit avoir un réflexe à lâcher").toBeTruthy();
  });
});

describe("accueil : ordre des entrées et action principale (C1-C1)", () => {
  it("les entrées précèdent les repères et l'action principale porte btn-principal", () => {
    const page = fs.readFileSync(path.join(RACINE, "src/app/page.tsx"), "utf8");
    const entrees = page.indexOf("accueil-entrees");
    const reperes = page.indexOf("accueil-reperes");
    expect(entrees, "le nav des entrées doit exister").toBeGreaterThanOrEqual(0);
    expect(reperes, "la liste des repères doit exister").toBeGreaterThanOrEqual(0);
    expect(entrees, "les entrées doivent précéder les repères").toBeLessThan(reperes);
    expect(page, "l'action principale doit porter btn-principal").toContain('"btn btn-principal"');
  });
});

describe("accueil : lien vers les compétences (C1-C2)", () => {
  it("« Explorer les compétences » pointe vers /competences", () => {
    const page = fs.readFileSync(path.join(RACINE, "src/app/page.tsx"), "utf8");
    expect(page, "l'entrée Explorer doit pointer vers /competences").toContain('"Explorer les compétences", href: "/competences"');
  });
});

describe("lien du dépôt (C1-C5)", () => {
  it("le défaut de DEPOT est collabagentic/telcoskills-transfo", () => {
    const site = fs.readFileSync(path.join(RACINE, "src/lib/site.ts"), "utf8");
    const ligne = site.split("\n").find((l) => l.includes("export const DEPOT"));
    expect(ligne, "une définition export const DEPOT").toBeDefined();
    expect(ligne, "défaut collabagentic").toContain("collabagentic/telcoskills-transfo");
    expect(ligne, "plus de taoufikbo").not.toContain("taoufikbo");
  });

  it("il n'existe qu'une seule définition de DEPOT dans src/", () => {
    const definitions = fichiersSource(path.join(RACINE, "src")).filter((f) => fs.readFileSync(f, "utf8").includes("const DEPOT"));
    expect(definitions.map((f) => path.relative(RACINE, f).replaceAll("\\", "/"))).toEqual(["src/lib/site.ts"]);
  });
});
