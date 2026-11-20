import { z } from "zod";

/**
 * Schémas du contenu. Les longueurs maximales sont des contraintes de design : le build échoue si elles sont dépassées.
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
    type: z.enum(["opensource", "doc", "cours", "video", "certif", "spec"]),
    nom: texte(200),
    url,
    langue: z.enum(["fr", "en"]).optional(),
    acces: z.enum(["gratuit", "freemium", "payant"]).optional(),
    auteur: texte(120).optional(),
  })
  .strict();
export type Lien = z.infer<typeof lienSchema>;

/** Schéma d'une fiche : une chaîne de 2 à 5 étapes, avant puis après (« avant » est null pour une nouveauté). */
const etape = z.object({ texte: texte(40), detail: texte(60).optional() }).strict();
const chaine = z.array(etape).min(2, "2 étapes au minimum").max(5, "5 étapes au maximum");
export const schemaFicheSchema = z.object({ legende: texte(120), avant: chaine.nullable(), apres: chaine }).strict();
export type SchemaFiche = z.infer<typeof schemaFicheSchema>;

/**
 * Diagramme d'architecture : des zones, des composants placés à la main (coordonnées dans une grille de `largeur` × `hauteur`)
 * et des flèches étiquetées. Le build contrôle les références, les débordements et les chevauchements (règle 15).
 */
const cote = z.enum(["h", "b", "g", "d"]);
const ton = z.enum(["neutre", "chaud", "froid", "ok", "faible"]);
const nombre = z.number().int().min(0).max(1200);
export const diagrammeSchema = z
  .object({
    legende: texte(140),
    largeur: z.number().int().min(300).max(900),
    hauteur: z.number().int().min(120).max(800),
    zones: z.array(z.object({ id: identifiant, titre: texte(40), x: nombre, y: nombre, w: nombre, h: nombre, ton: ton.optional() }).strict()),
    noeuds: z
      .array(
        z
          .object({
            id: identifiant,
            texte: texte(32),
            detail: texte(56).optional(),
            x: nombre,
            y: nombre,
            w: nombre,
            h: nombre,
            ton: ton.optional(),
            forme: z.enum(["boite", "base"]).optional(),
            zone: identifiant.optional(),
          })
          .strict(),
      )
      .min(2),
    liens: z.array(
      z
        .object({
          de: identifiant,
          vers: identifiant,
          texte: texte(32).optional(),
          style: z.enum(["plein", "pointille"]).optional(),
          sens: z.enum(["simple", "double"]).optional(),
          sortie: cote.optional(),
          entree: cote.optional(),
          decalageSortie: z.number().int().min(-80).max(80).optional(),
          decalageEntree: z.number().int().min(-80).max(80).optional(),
        })
        .strict(),
    ),
    source: sourceSchema,
  })
  .strict();
export type Diagramme = z.infer<typeof diagrammeSchema>;

const puces = z.array(texte(140)).min(2, "2 puces au minimum").max(4, "4 puces au maximum");

export const ficheSchema = z
  .object({
    id: identifiant,
    genre: z.enum(["transposition", "nouveaute"]),
    /** Besoin cognitif : décide du canevas de la fiche et du format du prompt à copier. */
    categorie: z.enum(["comprendre", "pratique", "integrer", "diagnostiquer", "decider"]),
    avant: texte(50).nullable(),
    apres: texte(60),
    resume: z.object({ avant: texte(200).nullable(), apres: texte(200) }).strict(),
    resteVrai: puces,
    change: puces,
    reflexe: texte(90).nullable(),
    pourquoiNouveau: texte(500).nullable(),
    piege: texte(600),
    exemple: texte(400),
    /** Mise à l'épreuve : un cas à raisonner, puis le raisonnement attendu (masqué jusqu'à ce que l'apprenant ait écrit le sien) et sa source. */
    epreuve: z.object({ cas: texte(400), raisonnement: texte(700), source: texte(300) }).strict(),
    schema: schemaFicheSchema,
    /** Diagramme d'architecture (facultatif) : affiché à la place de la chaîne avant/après dans « Le schéma ». */
    diagramme: diagrammeSchema.optional(),
    /** Compétences du graphe que cette fiche transforme. */
    competences: z.array(identifiant).min(1, "au moins une compétence"),
    technos: z.array(identifiant),
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

export const domaineSchema = z.object({ id: identifiant, nom: texte(60) }).strict();
export type Domaine = z.infer<typeof domaineSchema>;

/** Une compétence du graphe (migrée de l'ancien site) : reliée à ses prérequis, avec ses ressources. */
export const competenceSchema = z
  .object({
    id: identifiant,
    titre: texte(160),
    domaine: identifiant,
    niveau: z.enum(["fondamental", "intermediaire", "avance", "transverse"]),
    prerequis: z.array(identifiant),
    resume: texte(600),
    ressources: z.array(lienSchema),
    /** Enrichissements facultatifs d'une compétence : son histoire, des cas d'usage, un schéma de base. Chaque élément a sa source. */
    chronologie: z.array(z.object({ periode: texte(30), evenement: texte(240), source: sourceSchema }).strict()).optional(),
    casUsage: z.array(z.object({ titre: texte(90), texte: texte(320), source: sourceSchema }).strict()).optional(),
    diagramme: diagrammeSchema.optional(),
    origine: z.array(identifiant),
    statut,
  })
  .strict();
export type Competence = z.infer<typeof competenceSchema>;

export const technoSchema = z.object({ id: identifiant, nom: texte(60), url }).strict();
export type Techno = z.infer<typeof technoSchema>;

/** Les questions qui recombinent la feuille de route : chaque option a des effets cumulés et lisibles. */
export const effetsSchema = z
  .object({
    acquis: z.array(identifiant).optional(),
    domaines: z.record(identifiant, z.number().int().min(1).max(5)).optional(),
    cible: z.array(identifiant).optional(),
    ecarte: z.array(identifiant).optional(),
  })
  .strict();
export type Effets = z.infer<typeof effetsSchema>;

export const orientationSchema = z
  .object({
    _aide: z.string().optional(),
    statut,
    questions: z
      .array(
        z
          .object({
            id: identifiant,
            texte: texte(120),
            aide: texte(160).optional(),
            options: z
              .array(z.object({ id: identifiant, libelle: texte(60), detail: texte(60).optional(), raison: z.string().max(60), effets: effetsSchema }).strict())
              .min(2),
          })
          .strict(),
      )
      .min(5, "5 questions au minimum")
      .max(10, "10 questions au maximum"),
  })
  .strict();
export type Orientation = z.infer<typeof orientationSchema>;

export const contexteSchema = z
  .object({
    chiffres: z.array(z.object({ texte: texte(240), source: sourceSchema }).strict()).min(1),
    limites: z.array(texte(240)).min(1),
  })
  .strict();
export type Contexte = z.infer<typeof contexteSchema>;

export type Contenu = {
  contexte: Contexte;
  domaines: Domaine[];
  competences: Competence[];
  fiches: Fiche[];
  technos: Techno[];
  orientation: Orientation;
};
