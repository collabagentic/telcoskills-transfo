import fs from "node:fs";
import path from "node:path";
import { chargerContenu } from "./charger";
import { tempsLecture, titreFiche } from "./lecture";

/** Audit des fiches : une ligne par fiche, calculée depuis le contenu, plus les notes et validations tenues à la main dans content/audit.json. Serveur uniquement. */

export type LigneAudit = {
  id: string;
  titre: string;
  fini: boolean;
  statut: "brouillon" | "relu";
  categorie: string;
  genre: "transposition" | "nouveaute";
  classementValide: boolean;
  schemaDessine: boolean;
  sources: number;
  ressources: number;
  temps: number;
  misAJour: string;
  aVerifier: string[];
};

export type Audit = { lignes: LigneAudit[]; total: number; finies: number; avecSchema: number; classementsValides: number };

export type Suivi = { classementValide: string[]; notes: { fiche: string; note: string }[] };

export function lireSuivi(): Suivi {
  const brut = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "audit.json"), "utf8")) as Partial<Suivi>;
  return { classementValide: brut.classementValide ?? [], notes: brut.notes ?? [] };
}

export function auditFiches(): Audit {
  const c = chargerContenu();
  const suivi = lireSuivi();
  const lignes = c.fiches.map<LigneAudit>((f) => {
    const classementValide = suivi.classementValide.includes(f.id);
    const aVerifier: string[] = [];
    if (f.statut === "brouillon") aVerifier.push("Pas relue par l'auteur");
    if (!f.diagramme) aVerifier.push("Pas de schéma dessiné (chaîne simple)");
    if (f.sources.length < 2) aVerifier.push("Une seule source");
    if (!f.plusLoin.some((l) => l.acces === "gratuit")) aVerifier.push("Aucune ressource gratuite");
    if (!classementValide) aVerifier.push("Catégorie à confirmer");
    for (const n of suivi.notes) if (n.fiche === f.id) aVerifier.push(n.note);
    return {
      id: f.id,
      titre: titreFiche(f),
      fini: f.statut === "relu",
      statut: f.statut,
      categorie: f.categorie,
      genre: f.genre,
      classementValide,
      schemaDessine: Boolean(f.diagramme),
      sources: f.sources.length,
      ressources: f.plusLoin.length,
      temps: tempsLecture(f),
      misAJour: f.misAJour,
      aVerifier,
    };
  });
  return {
    lignes,
    total: lignes.length,
    finies: lignes.filter((l) => l.fini).length,
    avecSchema: lignes.filter((l) => l.schemaDessine).length,
    classementsValides: lignes.filter((l) => l.classementValide).length,
  };
}
