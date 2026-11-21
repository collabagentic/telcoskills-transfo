import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const RACINE = path.join(import.meta.dirname, "..");
const SCRIPT = path.join(RACINE, "scripts", "verifier-sortie.mjs");

function lancer(fixture: string) {
  return spawnSync(process.execPath, [SCRIPT, path.join(RACINE, "tests", "fixtures", fixture)], {
    encoding: "utf8",
  });
}

describe("scripts/verifier-sortie.mjs", () => {
  it("ne signale rien sur une sortie saine et sort en code 0", () => {
    const r = lancer("sortie-saine");
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toContain("ERREURS : 0");
    expect(r.stdout).toContain("AVERTISSEMENTS : 0");
  });

  it("détecte les cinq familles de défauts et sort en code 1 sur une sortie défectueuse", () => {
    const r = lancer("sortie-defectueuse");
    expect(r.status).toBe(1);
    // (a) lien interne cassé
    expect(r.stdout).toContain("lien interne cassé");
    // (b) ancre introuvable
    expect(r.stdout).toContain("ancre introuvable");
    // (c) titre absent ou vide
    expect(r.stdout).toContain("titre absent ou vide");
    // (d) saut de niveau de titre
    expect(r.stdout).toContain("saut de niveau de titre");
    // (e) image sans attribut alt
    expect(r.stdout).toContain("image sans attribut alt");
    expect(r.stdout).toContain("ERREURS : 4");
    expect(r.stdout).toContain("AVERTISSEMENTS : 1");
  });
});
