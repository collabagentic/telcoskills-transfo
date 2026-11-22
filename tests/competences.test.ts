import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { chargerContenu } from "@/contenu/charger";

const RACINE = path.join(import.meta.dirname, "..");
const page = fs.readFileSync(path.join(RACINE, "src/app/competences/page.tsx"), "utf8");

describe("page /competences (C1-C3)", () => {
  it("chaque compétence appartient à un domaine listé et les domaines couvrent toutes les compétences", () => {
    const c = chargerContenu();
    const ids = new Set(c.domaines.map((d) => d.id));
    for (const x of c.competences) {
      expect(ids.has(x.domaine), "domaine inconnu pour " + x.id).toBe(true);
    }
    const total = c.domaines.reduce((n, d) => n + c.competences.filter((x) => x.domaine === d.id).length, 0);
    expect(total, "les domaines couvrent toutes les compétences").toBe(c.competences.length);
  });

  it("chaque fiche rattache des compétences existantes (liens de la pastille fiche)", () => {
    const c = chargerContenu();
    const ids = new Set(c.competences.map((x) => x.id));
    for (const f of c.fiches) {
      for (const cid of f.competences) {
        expect(ids.has(cid), "compétence inconnue " + cid + " dans la fiche " + f.id).toBe(true);
      }
    }
  });

  it("la page lit les domaines dans l'ordre et lie chaque compétence vers /competence/", () => {
    expect(page, "la page charge le contenu").toContain("chargerContenu()");
    expect(page, "la page parcourt les domaines dans l'ordre de domaines.json").toContain("c.domaines.map");
    expect(page, "la page lie vers /competence/").toContain("/competence/");
  });
});

describe("page /competences (C1-C4)", () => {
  it("tout le texte affiché vient de chargerContenu, aucun chiffre écrit à la main", () => {
    expect(page).toContain("x.titre");
    expect(page).toContain("x.resume");
    expect(page).toContain("x.niveau");
    expect(page).toContain("d.nom");
    expect(page, "le nombre de fiches est calculé").toContain("fiches.length");
  });
});

