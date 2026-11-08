import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { verifierContenu } from "./regles";
import {
  ficheSchema,
  metierAVenirSchema,
  metierSchema,
  questionSchema,
  technoSchema,
  type Contenu,
} from "./schemas";

/**
 * Chargement du contenu au build, côté serveur uniquement : ne jamais importer ce fichier dans un composant client.
 * Toute erreur de schéma ou de règle fait échouer le build, avec le nom du fichier et du champ.
 */

const RACINE = path.join(process.cwd(), "content");

function lireJson(fichier: string): unknown {
  return JSON.parse(fs.readFileSync(fichier, "utf8"));
}

function lireDossier<T extends z.ZodType>(dossier: string, schema: T, erreurs: string[]): z.infer<T>[] {
  const chemin = path.join(RACINE, dossier);
  if (!fs.existsSync(chemin)) return [];
  const resultat: z.infer<T>[] = [];
  for (const nom of fs.readdirSync(chemin).filter((n) => n.endsWith(".json")).sort()) {
    const lu = schema.safeParse(lireJson(path.join(chemin, nom)));
    if (lu.success) resultat.push(lu.data);
    else for (const p of lu.error.issues) erreurs.push(`content/${dossier}/${nom} : champ « ${p.path.join(".") || "(racine)"} » : ${p.message}`);
  }
  return resultat;
}

function lireListe<T extends z.ZodType>(fichier: string, schema: T, erreurs: string[]): z.infer<T>[] {
  const chemin = path.join(RACINE, fichier);
  if (!fs.existsSync(chemin)) return [];
  const resultat: z.infer<T>[] = [];
  const brut = lireJson(chemin);
  if (!Array.isArray(brut)) {
    erreurs.push(`content/${fichier} : une liste est attendue.`);
    return [];
  }
  brut.forEach((element, i) => {
    const lu = schema.safeParse(element);
    if (lu.success) resultat.push(lu.data);
    else for (const p of lu.error.issues) erreurs.push(`content/${fichier} : élément ${i}, champ « ${p.path.join(".") || "(racine)"} » : ${p.message}`);
  });
  return resultat;
}

let cache: Contenu | null = null;

export function chargerContenu(): Contenu {
  if (cache) return cache;
  const erreurs: string[] = [];
  const contenu: Contenu = {
    metiers: lireDossier("metiers", metierSchema, erreurs),
    fiches: lireDossier("fiches", ficheSchema, erreurs),
    questions: lireDossier("questions", questionSchema, erreurs),
    technos: lireListe("technos.json", technoSchema, erreurs),
    aVenir: lireListe("metiers-a-venir.json", metierAVenirSchema, erreurs),
  };
  if (erreurs.length === 0) erreurs.push(...verifierContenu(contenu));
  if (erreurs.length > 0) {
    throw new Error(`Le contenu est invalide (${erreurs.length} erreur${erreurs.length > 1 ? "s" : ""}) :\n- ${erreurs.join("\n- ")}`);
  }
  cache = contenu;
  return contenu;
}
