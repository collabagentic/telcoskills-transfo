#!/usr/bin/env node
// Contrôle automatique de la qualité de la sortie statique out/ (lot L4).
// Usage : node scripts/verifier-sortie.mjs [dossier]
//
// Contrôles (spec.md, commit figé) :
//   (a) chaque lien interne (href commençant par « / », hors « /_next/ ») existe comme fichier ou dossier avec index.html ;
//   (b) chaque ancre #id existe dans la page cible ;
//   (c) chaque page a un <title> non vide, une <meta name="description"> non vide, un lang sur <html>, un seul <h1> ;
//   (d) pas de saut de niveau de titre (h1 → h3) ;
//   (e) chaque <img> a un alt (vide admis seulement s'il est décoratif et marqué aria-hidden ou role="presentation").
//
// Sortie : erreurs → code de sortie 1 ; avertissements seuls → code 0 ; avec la page et la ligne.
// Aucune dépendance : analyse du HTML avec Node seul (expressions régulières prudentes).

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function fichiersHtml(repertoire) {
  const resultats = [];
  const parcourir = (rep) => {
    let entrees;
    try {
      entrees = readdirSync(rep, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entrees) {
      const p = join(rep, e.name);
      if (e.isDirectory()) parcourir(p);
      else if (e.isFile() && e.name.endsWith(".html")) resultats.push(p);
    }
  };
  parcourir(repertoire);
  return resultats.sort();
}

function lignePour(texte, index) {
  let ligne = 1;
  for (let i = 0; i < index; i += 1) {
    if (texte.charCodeAt(i) === 10) ligne += 1;
  }
  return ligne;
}

function decoder(chemin) {
  try {
    return decodeURIComponent(chemin);
  } catch {
    return chemin;
  }
}

// Résout un chemin interne (commençant par « / ») vers un fichier existant, ou null.
function cheminVersFichier(chemin, dossier) {
  const relatif = decoder(chemin).replace(/^\/+/, "");
  if (relatif === "") return join(dossier, "index.html");
  const base = join(dossier, relatif);
  const candidats = [base, join(base, "index.html"), base + ".html"];
  for (const c of candidats) {
    try {
      if (statSync(c).isFile()) return c;
    } catch {
      // candidat absent : on essaie le suivant
    }
  }
  return null;
}

function idsDeLaPage(texte) {
  const ids = new Set();
  for (const m of texte.matchAll(/\bid\s*=\s*"([^"]+)"/gi)) ids.add(m[1]);
  for (const m of texte.matchAll(/\bid\s*=\s*'([^']+)'/gi)) ids.add(m[1]);
  return ids;
}

function pagesDuDossier(repertoire) {
  const pages = [];
  for (const chemin of fichiersHtml(repertoire)) {
    const texte = readFileSync(chemin, "utf8");
    const relatif = chemin.slice(repertoire.length + 1).split("\\").join("/");
    pages.push({ chemin, relatif, texte });
  }
  return pages;
}

export function verifierSortie(racine) {
  const dossier = resolve(racine || "out");
  const erreurs = [];
  const avertissements = [];
  const pages = pagesDuDossier(dossier);
  const idsParPage = new Map(pages.map((p) => [p.relatif, idsDeLaPage(p.texte)]));

  let liensInternes = 0;
  let ancres = 0;
  let images = 0;

  for (const page of pages) {
    const texte = page.texte;
    const relatif = page.relatif;

    // (c) métadonnées et structure de la page
    const titre = texte.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!titre || titre[1].trim() === "") {
      erreurs.push({ page: relatif, ligne: titre ? lignePour(texte, titre.index) : 1, message: "titre absent ou vide" });
    }

    const description = texte.match(/<meta\b[^>]*name\s*=\s*["']description["'][^>]*>/i);
    const contenuDescription = description ? ((description[0].match(/content\s*=\s*["']([^"']*)["']/i) || [])[1] || "") : "";
    if (!description || contenuDescription.trim() === "") {
      erreurs.push({ page: relatif, ligne: description ? lignePour(texte, description.index) : 1, message: "meta description absente ou vide" });
    }

    const baliseHtml = texte.match(/<html\b[^>]*>/i);
    const lang = baliseHtml ? ((baliseHtml[0].match(/\blang\s*=\s*["']([^"']*)["']/i) || [])[1] || "") : "";
    if (!baliseHtml || lang.trim() === "") {
      erreurs.push({ page: relatif, ligne: baliseHtml ? lignePour(texte, baliseHtml.index) : 1, message: "attribut lang absent sur <html>" });
    }

    const h1 = [...texte.matchAll(/<h1\b[^>]*>/gi)];
    if (h1.length !== 1) {
      const ligneH1 = h1.length > 0 ? lignePour(texte, h1[0].index) : 1;
      erreurs.push({ page: relatif, ligne: ligneH1, message: h1.length + " balise(s) <h1> (attendu : exactement une)" });
    }

    // (d) saut de niveau de titre
    const titres = [...texte.matchAll(/<h([1-6])\b[^>]*>/gi)].map((m) => ({ niveau: Number(m[1]), index: m.index }));
    let dernierNiveau = null;
    for (const t of titres) {
      if (dernierNiveau !== null && t.niveau > dernierNiveau + 1) {
        avertissements.push({ page: relatif, ligne: lignePour(texte, t.index), message: "saut de niveau de titre h" + dernierNiveau + " → h" + t.niveau });
      }
      dernierNiveau = dernierNiveau === null ? t.niveau : Math.max(dernierNiveau, t.niveau);
    }

    // (a) liens internes + (b) ancres
    for (const m of texte.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']*)["'][^>]*>/gi)) {
      const href = m[1];
      const ligne = lignePour(texte, m.index);

      // ancre seule (href="#id") : cible la page courante
      if (href.startsWith("#")) {
        const fragment = href.slice(1);
        if (fragment !== "") {
          ancres += 1;
          const ids = idsParPage.get(relatif);
          if (!ids || !ids.has(fragment)) {
            erreurs.push({ page: relatif, ligne, message: "ancre introuvable : " + href });
          }
        }
        continue;
      }

      if (!href.startsWith("/") || href.startsWith("/_next/")) continue;
      liensInternes += 1;
      const diese = href.indexOf("#");
      const chemin = diese === -1 ? href : href.slice(0, diese);
      const fragment = diese === -1 ? "" : href.slice(diese + 1);

      const cible = cheminVersFichier(chemin, dossier);
      if (!cible) {
        erreurs.push({ page: relatif, ligne, message: "lien interne cassé : " + href });
        continue;
      }
      if (fragment !== "") {
        ancres += 1;
        const cibleRelatif = cible.slice(dossier.length + 1).split("\\").join("/");
        const ids = idsParPage.get(cibleRelatif);
        if (!ids || !ids.has(fragment)) {
          erreurs.push({ page: relatif, ligne, message: "ancre introuvable : " + href });
        }
      }
    }

    // (e) images
    for (const m of texte.matchAll(/<img\b[^>]*>/gi)) {
      images += 1;
      const balise = m[0];
      const alt = balise.match(/\balt\s*=\s*["']([^"']*)["']/i);
      const decoratif = /\baria-hidden\s*=\s*["']true["']/i.test(balise) || /\brole\s*=\s*["']presentation["']/i.test(balise);
      const ligne = lignePour(texte, m.index);
      if (!alt) {
        erreurs.push({ page: relatif, ligne, message: "image sans attribut alt" });
      } else if (alt[1].trim() === "" && !decoratif) {
        erreurs.push({ page: relatif, ligne, message: "image avec alt vide et sans marqueur décoratif (aria-hidden ou role=presentation)" });
      }
    }
  }

  return { erreurs, avertissements, pages: pages.length, liensInternes, ancres, images };
}

function afficher(resultat) {
  const tri = (lignes) => lignes.slice().sort((a, b) => (a.page + ":" + a.ligne).localeCompare(b.page + ":" + b.ligne));
  for (const e of tri(resultat.erreurs)) console.log("ERREUR        " + e.page + ":" + e.ligne + "  " + e.message);
  for (const a of tri(resultat.avertissements)) console.log("AVERTISSEMENT " + a.page + ":" + a.ligne + "  " + a.message);
  console.log("");
  console.log(resultat.pages + " page(s), " + resultat.liensInternes + " lien(s) interne(s), " + resultat.ancres + " ancre(s), " + resultat.images + " image(s)");
  console.log("ERREURS : " + resultat.erreurs.length + "  AVERTISSEMENTS : " + resultat.avertissements.length);
}

const estPrincipal = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (estPrincipal) {
  const resultat = verifierSortie(process.argv[2] || "out");
  afficher(resultat);
  process.exitCode = resultat.erreurs.length > 0 ? 1 : 0;
}
