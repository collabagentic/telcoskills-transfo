import { z } from "zod";

/**
 * Schémas du contenu (BACKLOG.md §5). Les longueurs maximales sont des contraintes de design : le build échoue si elles sont dépassées.
 * Les types TypeScript sont dérivés des schémas.
 */

const texte = (max: number) => z.string().min(1, "ne peut pas être vide").max(max, `${max} caractères au maximum`);
const dateJour = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date attendue au format AAAA-MM-JJ");
const url = z.string().url("adresse web invalide").startsWith("http", "l'adresse doit commencer par http");
const identifiant = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "identifiant attendu en minuscules, chiffres et tirets");
const statut = z.enum(["brouillon", "relu"]);

export const sourceSchema = z.object({ nom: texte(160), url }).strict();
export type Source = z.infer<typeof sourceSchema>;

export const lienSchema = z
  .object({
    type: z.enum(["opensource", "doc", "cours", "video", "spec"]),
    nom: texte(120),
    url,
    langue: z.enum(["fr", "en"]),
    acces: z.enum(["gratuit", "freemium", "payant"]),
    auteur: texte(80).optional(),
  })
  .strict();
export type Lien = z.infer<typeof lienSchema>;

/** Schéma d'une fiche : une chaîne de 2 à 5 étapes, avant puis après (« avant » est null pour une nouveauté). */
const etape = z.object({ texte: texte(40), detail: texte(60).optional() }).strict();
const chaine = z.array(etape).min(2, "2 étapes au minimum").max(5, "5 étapes au maximum");
export const schemaFicheSchema = z.object({ legende: texte(120), avant: chaine.nullable(), apres: chaine }).strict();
export type SchemaFiche = z.infer<typeof schemaFicheSchema>;

const puces = z.array(texte(140)).min(2, "2 puces au minimum").max(4, "4 puces au maximum");

export const ficheSchema = z
  .object({
    id: identifiant,
    genre: z.enum(["transposition", "nouveaute"]),
    avant: texte(50).nullable(),
    apres: texte(60),
    resume: z.object({ avant: texte(200).nullable(), apres: texte(200) }).strict(),
    resteVrai: puces,
    change: puces,
    reflexe: texte(90).nullable(),
    pourquoiNouveau: texte(500).nullable(),
    piege: texte(600),
    exemple: texte(400),
    schema: schemaFicheSchema,
    technos: z.array(identifiant),
    questions: z.array(identifiant).length(2, "exactement 2 questions"),
    plusLoin: z.array(lienSchema).min(1),
    sources: z.array(sourceSchema).min(1, "au moins une source"),
    statut,
    misAJour: dateJour,
    historique: z
      .array(z.object({ date: dateJour, changement: texte(200), par: texte(80), lien: url.nullable() }).strict())
      .min(1, "l'historique ne peut pas être vide"),
  })
  .strict();
export type Fiche = z.infer<typeof ficheSchema>;

export const savoirFaireSchema = z
  .object({
    id: identifiant,
    texte: texte(90),
    statut: z.enum(["acquis", "transpose"]),
    fiche: identifiant.optional(),
  })
  .strict();
export type SavoirFaire = z.infer<typeof savoirFaireSchema>;

export const metierSchema = z
  .object({
    id: identifiant,
    nom: texte(60),
    accroche: texte(60),
    amorce: texte(90),
    portrait: texte(300),
    savoirFaire: z.array(savoirFaireSchema),
    nouveautes: z.array(identifiant),
    ordre: z.array(identifiant).min(1),
    /** Prérequis conseillés : fiche → fiches à voir avant (la carte les relie). Chaque prérequis précède la fiche dans « ordre ». */
    dependances: z.record(identifiant, z.array(identifiant)).default({}),
    sources: z.array(sourceSchema).min(1),
    statut,
  })
  .strict();
export type Metier = z.infer<typeof metierSchema>;

export const questionSchema = z
  .object({
    id: identifiant,
    fiche: identifiant,
    enonce: texte(400),
    options: z.array(texte(300)).min(2).max(5),
    bonne: z.number().int().min(0),
    explication: texte(700),
    source: texte(300),
    statut,
  })
  .strict()
  .refine((q) => q.bonne < q.options.length, { message: "« bonne » doit désigner une option existante", path: ["bonne"] });
export type Question = z.infer<typeof questionSchema>;

export const technoSchema = z.object({ id: identifiant, nom: texte(60), url }).strict();
export type Techno = z.infer<typeof technoSchema>;

export const metierAVenirSchema = z.object({ id: identifiant, nom: texte(60), accroche: texte(60) }).strict();
export type MetierAVenir = z.infer<typeof metierAVenirSchema>;

export type Contenu = {
  metiers: Metier[];
  fiches: Fiche[];
  questions: Question[];
  technos: Techno[];
  aVenir: MetierAVenir[];
};
