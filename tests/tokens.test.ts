import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const RACINE = path.join(import.meta.dirname, "..");
const css = fs.readFileSync(path.join(RACINE, "src/app/tokens.css"), "utf8");

/** Extrait les déclarations « --nom: #hex » d'un bloc (les couleurs en rgba ne sont pas testées en contraste). */
function jetons(bloc: string): Record<string, string> {
  const r: Record<string, string> = {};
  for (const m of bloc.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) r[m[1]] = m[2];
  return r;
}
const blocs = css.split("@media");
const sombre = jetons(blocs[0]);
const clair = { ...sombre, ...jetons(blocs.find((b) => b.includes("prefers-color-scheme: light")) ?? "") };

function luminance(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contraste(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const TEXTES: [string, string][] = [
  ["encre", "fond"],
  ["encre-2", "fond"],
  ["encre-3", "fond"],
  ["encre", "surface-2"],
  ["encre-2", "surface-3"],
  ["accent-texte", "fond"],
  ["accent-texte", "accent-surface-1"],
  ["teinte-forme", "fond"],
  ["teinte-nouveau", "fond"],
  ["teinte-lacher", "fond"],
  ["teinte-ok", "fond"],
  ["accent-encre", "accent"],
];

describe("jetons de design", () => {
  for (const [nom, theme] of [["sombre", sombre], ["clair", clair]] as const) {
    it(`contraste AA du texte (4,5:1), thème ${nom}`, () => {
      for (const [fg, bg] of TEXTES) {
        expect(theme[fg], `${fg} existe`).toBeDefined();
        expect(theme[bg], `${bg} existe`).toBeDefined();
        expect(contraste(theme[fg], theme[bg]), `${fg} sur ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    });
    it(`contraste des composants (3:1), thème ${nom}`, () => {
      expect(contraste(theme["focus"], theme["fond"]), "anneau de focus").toBeGreaterThanOrEqual(3);
      expect(contraste(theme["filet-fort"], theme["fond"]) > 1.2).toBe(true);
    });
  }

  it("aucune couleur en dur hors de tokens.css", () => {
    const fichiers: string[] = [];
    const parcourir = (dossier: string) => {
      for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
        const p = path.join(dossier, e.name);
        if (e.isDirectory()) parcourir(p);
        else if (/\.(css|tsx?)$/.test(e.name) && e.name !== "tokens.css") fichiers.push(p);
      }
    };
    parcourir(path.join(RACINE, "src"));
    const motif = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(/;
    const fautifs = fichiers.filter((f) => motif.test(fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")));
    // layout.tsx déclare themeColor et opengraph-image.tsx dessine l image de partage hors CSS : valeurs littérales obligatoires
    expect(fautifs.map((f) => path.relative(RACINE, f).replaceAll("\\", "/")).filter((f) => f !== "src/app/layout.tsx" && f !== "src/app/opengraph-image.tsx")).toEqual([]);
  });
});
