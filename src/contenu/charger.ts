import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { verifierContenu } from "./regles";
import { competenceSchema, contexteSchema, domaineSchema, ficheSchema, orientationSchema, questionSchema, technoSchema, type Contenu } from "./schemas";

/**
 * Chargement du contenu au build, côté serveur uniquement : ne jamais importer ce fichier dans un composant client.
 * Toute erreur de schéma ou de règle fait échouer le build, avec le nom du fichier et du champ.
 */

const RACINE = path.join(process.cwd(), "content");

function lireJson(fichier: string): unknown {
  return JSON.parse(fs.readFileSync(fichier, "utf8"));
}

function signaler(erreurs: string[], fichier: string, e: z.ZodError, prefixe = "") {
  for (const p of e.issues) erreurs.push(`content/${fichier} : ${prefixe}champ « ${p.path.join(".") || "(racine)"} » : ${p.message}`);
}

/** Un dossier de fichiers, chacun contenant un objet. */
function lireDossier<T extends z.ZodType>(dossier: string, schema: T, erreurs: string[]): z.infer<T>[] {
  const chemin = path.join(RACINE, dossier);
  if (!fs.existsSync(chemin)) return [];
  const resultat: z.infer<T>[] = [];
  for (const nom of fs.readdirSync(chemin).filter((n) => n.endsWith(".json")).sort()) {
    const lu = schema.safeParse(lireJson(path.join(chemin, nom)));
    if (lu.success) resultat.push(lu.data);
    else signaler(erreurs, `${dossier}/${nom}`, lu.error);
  }
  return resultat;
}

/** Une liste d'objets dans un fichier ou dans chaque fichier d'un dossier. */
function lireListes<T extends z.ZodType>(cible: string, schema: T, erreurs: string[]): z.infer<T>[] {
  const chemin = path.join(RACINE, cible);
  if (!fs.existsSync(chemin)) return [];
  const fichiers = fs.statSync(chemin).isDirectory() ? fs.readdirSync(chemin).filter((n) => n.endsWith(".json")).sort().map((n) => path.join(cible, n)) : [cible];
  const resultat: z.infer<T>[] = [];
  for (const f of fichiers) {
    const brut = lireJson(path.join(RACINE, f));
    if (!Array.isArray(brut)) {
      erreurs.push(`content/${f} : une liste est attendue.`);
      continue;
    }
    brut.forEach((element, i) => {
      const lu = schema.safeParse(element);
      if (lu.success) resultat.push(lu.data);
      else signaler(erreurs, f, lu.error, `élément ${i}, `);
    });
  }
  return resultat;
}

let cache: Contenu | null = null;

export function chargerContenu(): Contenu {
  if (cache) return cache;
  const erreurs: string[] = [];
  const orientation = orientationSchema.safeParse(lireJson(path.join(RACINE, "orientation.json")));
  if (!orientation.success) signaler(erreurs, "orientation.json", orientation.error);
  const contexte = contexteSchema.safeParse(lireJson(path.join(RACINE, "contexte.json")));
  if (!contexte.success) signaler(erreurs, "contexte.json", contexte.error);
  const contenu = {
    contexte: contexte.success ? contexte.data : undefined,
    domaines: lireListes("domaines.json", domaineSchema, erreurs),
    competences: lireListes("competences", competenceSchema, erreurs),
    fiches: lireDossier("fiches", ficheSchema, erreurs),
    questions: lireDossier("questions", questionSchema, erreurs),
    technos: lireListes("technos.json", technoSchema, erreurs),
    orientation: orientation.success ? orientation.data : undefined,
  };
  if (erreurs.length === 0 && contenu.orientation && contenu.contexte) erreurs.push(...verifierContenu(contenu as Contenu));
  if (erreurs.length > 0) {
    throw new Error(`Le contenu est invalide (${erreurs.length} erreur${erreurs.length > 1 ? "s" : ""}) :\n- ${erreurs.join("\n- ")}`);
  }
  cache = contenu as Contenu;
  return cache;
}
