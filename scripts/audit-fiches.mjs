// Génère reports/audit-fiches.md : la même lecture que la page /audit du site, conservée dans le dépôt.
// Usage : node scripts/audit-fiches.mjs
import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const NOMS = { comprendre: "Comprendre", pratique: "Changer de pratique", integrer: "Intégrer", diagnostiquer: "Diagnostiquer", decider: "Décider" };
const suivi = JSON.parse(fs.readFileSync(path.join(RACINE, "content", "audit.json"), "utf8"));
const dossier = path.join(RACINE, "content", "fiches");
const fiches = fs.readdirSync(dossier).filter((n) => n.endsWith(".json")).sort().map((n) => JSON.parse(fs.readFileSync(path.join(dossier, n), "utf8")));

const titre = (f) => (f.genre === "transposition" && f.avant ? `Votre ${f.avant}, version ${f.apres}.` : `${f.apres}.`);
const pluriel = (n) => (n > 1 ? "s" : "");

const lignes = fiches.map((f) => {
  const valide = suivi.classementValide.includes(f.id);
  const aVerifier = [];
  if (f.statut === "brouillon") aVerifier.push("Pas relue par l'auteur");
  if (!f.diagramme) aVerifier.push("Pas de schéma dessiné (chaîne simple)");
  if (f.sources.length < 2) aVerifier.push("Une seule source");
  if (!f.plusLoin.some((l) => l.acces === "gratuit")) aVerifier.push("Aucune ressource gratuite");
  if (!valide) aVerifier.push("Catégorie à confirmer");
  for (const n of suivi.notes) if (n.fiche === f.id) aVerifier.push(n.note);
  return { f, valide, aVerifier };
});

const finies = lignes.filter((l) => l.f.statut === "relu").length;
const schemas = lignes.filter((l) => l.f.diagramme).length;
const validés = lignes.filter((l) => l.valide).length;
const jour = new Date().toLocaleDateString("sv-SE");

const sortie = [
  "# Audit des fiches",
  "",
  `Généré le ${jour} par \`node scripts/audit-fiches.mjs\` (page du site : \`/audit\`). Notes et classements validés : \`content/audit.json\`.`,
  "",
  `**${finies} fiche${pluriel(finies)} finie${pluriel(finies)} sur ${lignes.length}** (fini = relue par l'auteur) · ${schemas} avec un schéma dessiné · ${validés} classement${pluriel(validés)} validé${pluriel(validés)}.`,
  "",
  "| Fiche | État | Classement | Contenu | À vérifier |",
  "| --- | --- | --- | --- | --- |",
  ...lignes.map(({ f, valide, aVerifier }) =>
    [
      `[${titre(f)}](/fiche/${f.id}) (\`${f.id}\`)`,
      f.statut === "relu" ? "Fini" : "Pas fini",
      `${NOMS[f.categorie]} · ${f.genre === "transposition" ? "transposition" : "nouveauté"} · ${valide ? "validé" : "à confirmer"}`,
      `${f.diagramme ? "schéma dessiné" : "chaîne simple"} · ${f.sources.length} source${pluriel(f.sources.length)} · ${f.plusLoin.length} ressource${pluriel(f.plusLoin.length)}`,
      aVerifier.join(" ; "),
    ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
  ),
  "",
].join("\n");

fs.mkdirSync(path.join(RACINE, "reports"), { recursive: true });
fs.writeFileSync(path.join(RACINE, "reports", "audit-fiches.md"), sortie);
console.log(`reports/audit-fiches.md : ${lignes.length} fiches, ${finies} finies`);
