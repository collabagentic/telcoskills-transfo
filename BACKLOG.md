# TelcoSkills · Transformation — Backlog complet

> Rédigé le 2026-11-08. Projet neuf, construit **à partir de zéro** dans ce dossier, en **capitalisant** sur l'existant
> (`dev/telcoskills`, `dev/telco/telcocloud-roadmaps`) sans le forker.
> **Pour Sonnet** : lis d'abord `CLAUDE.md`, puis ce fichier en entier. Travaille **un lot à la fois** (§9), dans l'ordre.
> Les questions ouvertes (§11) ont toutes une **valeur par défaut** : applique-la et continue, sauf mention « BLOQUANT ».
> Ce qu'on attend à la fin (client, promesse, critères de succès, conditions de lancement) est dans **`PRFAQ.md`** :
> toute story doit servir une phrase de ce document. Écarts D1 à D6 du PR/FAQ intégrés le 2026-11-08.
>
> **État au 2026-11-21 : lire d'abord le §14 (fin du fichier).** Les §4 à §9 (écrans à métiers, plan, lots 0 à 8) décrivent
> le produit d'origine, remplacé par la refonte du §13 ; ils restent comme historique. Le §14 dit ce qui existe et ce qui reste.

---

## 1. Pourquoi un nouveau projet

Les sites précédents proposaient des **roadmaps** : des graphes de 16 à 63 compétences qui partent des fondamentaux.
Dans le télécom, c'est rédhibitoire :

- **presque personne ne part de zéro.** Les gens ont 15 à 30 ans de métier (cœur réseau, virtualisation, architecture SI,
  avant-vente). Une roadmap leur dit « commence par Télécoms 101 » (c'est littéralement le premier nœud de la passerelle
  cœur réseau actuelle) : elle nie ce qu'ils savent ;
- **le volume fait fuir** : 544 h affichées pour un parcours, 171 compétences, 11 parcours, 6 portes d'entrée ;
- **la question réelle n'est pas « que dois-je apprendre ? »** mais **« qu'est-ce qui, dans ce que je sais déjà, reste vrai,
  change de forme, ou devient faux ? »**.

Le nouveau produit répond à cette seule question. Sa promesse :

> **Vous ne repartez pas de zéro. Voici ce que vous savez déjà, ce qui change de forme, et les quelques vraies nouveautés.**

La formule des passerelles existantes en est le cœur et devient la signature du produit :
« **Votre dossier PRA, version GitOps.** » · « **Votre matrice de flux, version NetworkPolicy.** »

---

## 2. Principes (ils tranchent les arbitrages)

1. **On part de l'existant, jamais de zéro.** Toute page commence par ce que la personne sait.
2. **KISS à l'écran.** Une question ou une action principale par écran. 4 écrans au total (§4). Pas de graphe, pas de
   carte interactive, pas de métro, pas de filtres multiples, pas de taxonomie visible au-delà du vocabulaire du §3.
3. **Un design extrêmement soigné.** Simple ne veut pas dire pauvre : typographie, rythme vertical, micro-interactions,
   états vides, mode sombre, mobile. La barre de qualité est au §8. Mieux vaut un écran de moins qu'un écran moyen.
4. **Pas de volume horaire cumulé.** Seul chiffre de temps autorisé : le **temps de lecture** d'une fiche, calculé sur son
   texte (mesure, pas hypothèse). Jamais de « 544 h ».
5. **Le chemin d'abord, pas le palmarès.** L'écran de bilan ne met pas en avant ce qui reste valable : il dit « votre métier
   tient » en une phrase et pousse vers la première fiche. Les chiffres affichés (changent de forme, nouveaux, à lâcher) sont
   **calculés** à partir du contenu, jamais écrits à la main. (Décision de l'auteur, 2026-11-08.)
6. **Rien d'inventé.** Chaque affirmation technique d'une fiche a une source. Tout contenu non relu par l'auteur porte le
   statut `brouillon` et la mention visible « en relecture ».
7. **Aucun compte, aucun serveur.** Le bilan vit dans le navigateur. Le partage passe par un lien ou une impression.
8. **Un mot par chose** (§3). Les mots « roadmap », « nœud », « parcours », « palier », « landscape » n'apparaissent pas.
9. **Gratuit, participatif, rien à vendre.** Le site est aussi la vitrine de l'auteur. Une erreur signalée est une
   contribution : on la rend facile à signaler, on la corrige vite, et l'historique de chaque fiche est public.

### Ce qu'on ne fait pas (anti-périmètre, ne pas rouvrir)

Roadmaps de 16 à 63 compétences (voir §12 : la carte de transformation, elle, existe) · dagre · diagnostic multi-questions · test de positionnement · projet fil
rouge et ses 9 phases · vue Équipe (reportée, §7 E11) · rôles cibles comme porte d'entrée · heures, rythme, date
d'arrivée · révisions espacées · vidéos générées · analyses, frameworks, offres · Sylva comme rubrique.

---

## 3. Vocabulaire (le seul autorisé à l'écran)

| Mot | Définition | Objet de contenu |
|---|---|---|
| **Métier** | Ce que la personne fait aujourd'hui (« Architecte infra et virtualisation »). Point d'entrée unique. | `metiers/*.json` |
| **Savoir-faire** | Une chose que ce métier sait faire, **dans ses mots** (« Je rédige une matrice de flux »). | dans le métier |
| **Fiche** | Une page courte qui transforme un savoir-faire. Deux genres : *transposition* et *nouveauté*. | `fiches/*.json` |
| **Transposition** | « Votre X, version Y » : ce qui reste vrai, ce qui change, le réflexe à lâcher, le piège. | fiche `genre: transposition` |
| **Nouveauté** | Ce qui n'a pas d'équivalent dans le métier d'origine (la boucle de réconciliation, les opérateurs). | fiche `genre: nouveauté` |
| **Réflexe à lâcher** | Ce qui était juste avant et devient faux (« corriger en SSH sur la machine »). | champ d'une transposition |
| **Bilan** | Le résultat pour une personne : acquis / se transpose / nouveau / à lâcher. | calculé |
| **Plan** | La liste ordonnée des fiches de son bilan, avec ce qui est lu et vérifié. | calculé + stockage local |

Les savoir-faire **acquis** (qui restent vrais tels quels : « arbitrer entre fournisseurs ») n'ont **pas** de fiche : ils
sont listés pour être reconnus. C'est voulu, c'est le message.

---

## 4. Les 4 écrans

Navigation principale : logo · « Mon plan » (visible seulement s'il existe un bilan). Rien d'autre. Pied de page : à
propos, contribuer, sources et méthode, confidentialité, mentions légales.

### Écran 1 · `/` — « Quel est votre métier aujourd'hui ? »

```
┌──────────────────────────────────────────────────────────────┐
│ TelcoSkills                                       Mon plan → │
│                                                              │
│   Vous ne repartez pas de zéro.                              │
│   Le cloud natif change la forme de votre métier,            │
│   pas sa valeur.                                             │
│                                                              │
│   Quel est votre métier aujourd'hui ?                        │
│                                                              │
│   ┌────────────────────────┐  ┌────────────────────────┐     │
│   │ Architecte infra et    │  │ Ingénieur cœur réseau  │     │
│   │ virtualisation         │  │ EPC · IMS · VoLTE      │     │
│   │ VMware · DC · stockage │  │                        │     │
│   └────────────────────────┘  └────────────────────────┘     │
│   ┌────────────────────────┐  ┌────────────────────────┐     │
│   │ Architecte SI          │  │ Avant-vente technique  │     │
│   │ TOGAF · ITIL · PRA     │  │ chiffrage · AO         │     │
│   └────────────────────────┘  └────────────────────────┘     │
│                                                              │
│   « Votre matrice de flux, version NetworkPolicy. »          │
│   (la phrase tourne lentement parmi les amorces des métiers) │
└──────────────────────────────────────────────────────────────┘
```

Action unique : choisir un métier. Revenant (bilan existant) : un bandeau discret au-dessus des cartes, « Reprendre
votre plan · Architecte infra · 3 fiches sur 9 », sans changer le reste de la page.

### Écran 2 · `/metier/[id]` — « Ce que vous savez déjà »

La liste des savoir-faire du métier, **tous cochés par défaut**. La personne décoche ce qu'elle ne fait pas. Le bilan se
recalcule en direct sous la liste.

```
┌──────────────────────────────────────────────────────────────┐
│ ‹ Changer de métier        Architecte infra et virtualisation │
│                                                              │
│ Ce que vous savez faire. Décochez ce qui ne vous parle pas.  │
│                                                              │
│ [✓] Je dimensionne des clusters de virtualisation            │
│ [✓] Je rédige une matrice de flux                            │
│ [✓] Je découpe le réseau en VLAN                             │
│ [✓] J'organise la haute disponibilité actif/passif           │
│ [ ] Je pilote des migrations à grande échelle                │
│ …                                                            │
│ ──────────────────────────────────────────────────────────── │
│  Votre bilan                                                 │
│  ┌────────────┐┌────────────┐┌────────────┐                 │
│  │ 6          ││ 3          ││ 4          │                 │
│  │ changent   ││ vraiment   ││ réflexes   │                 │
│  │ de forme   ││ nouveaux   ││ à lâcher   │                 │
│  └────────────┘└────────────┘└────────────┘                 │
│                                                              │
│  Votre métier tient. Neuf choses évoluent : une par une.     │
│                    [ Commencer par la première · 6 min → ]  │
└──────────────────────────────────────────────────────────────┘
```

Règle de calcul (testée, §6) :
- savoir-faire coché **acquis** → compté nulle part à l'écran du bilan (étiquette « reste valable » sur la ligne seulement) ;
- savoir-faire coché lié à une **transposition** → « changent de forme » ; son réflexe à lâcher compte dans « à lâcher » ;
- savoir-faire **décoché** lié à une transposition → la fiche reste dans le plan, mais passe en « à découvrir »
  (affichée sans la colonne « avant ») ;
- les **nouveautés** du métier → « vraiment nouveaux », toujours dans le plan.
- Phrase clé : « Votre métier tient. N choses évoluent : une par une. » avec N = nombre de fiches du plan (le bouton nomme la première fiche et son temps de lecture).

### Écran 3 · `/plan` — « Votre plan »

Une liste, pas un graphe. Ordre défini par le métier (champ `ordre`). Chaque ligne : genre (pastille), titre
« Votre X, version Y », temps de lecture, état (à lire / lu / vérifié).

```
┌──────────────────────────────────────────────────────────────┐
│ Votre plan · Architecte infra et virtualisation   [Imprimer] │
│ 3 fiches vérifiées sur 9                       ▓▓▓░░░░░░     │
│                                                              │
│  Reprendre : Votre matrice de flux, version NetworkPolicy  → │
│                                                              │
│  CHANGE DE FORME                                             │
│  ✓ Vos VLAN, version réseaux du cluster          8 min  vérifié│
│  ✓ Votre matrice de flux, version NetworkPolicy  6 min  vérifié│
│  ○ Votre actif/passif, version réplicas          7 min        │
│  …                                                           │
│  VRAIMENT NOUVEAU                                            │
│  ○ L'état désiré : la boucle de réconciliation   9 min        │
│  …                                                           │
│  RESTE VALABLE (rien à lire)                                 │
│  Arbitrer entre fournisseurs · Piloter une migration · …     │
│                                                              │
│  [Partager ce plan]  [Modifier mon bilan]                    │
└──────────────────────────────────────────────────────────────┘
```

Action principale : « Reprendre » (la première fiche non vérifiée).

### Écran 4 · `/fiche/[id]` — la fiche (composant signature « Avant → Après »)

```
┌──────────────────────────────────────────────────────────────┐
│ ‹ Mon plan                                 Change de forme · 6 min │
│                                                              │
│  Votre matrice de flux,                                      │
│  version NetworkPolicy.                                      │
│                                                              │
│  ┌───────── AVANT ─────────┐   ┌───────── APRÈS ──────────┐  │
│  │ Une ligne = IP source,  │ → │ Une règle = des labels,  │  │
│  │ IP destination, port.   │   │ un namespace, un port.   │  │
│  │ Validée par le pare-feu.│   │ Versionnée dans Git.     │  │
│  └─────────────────────────┘   └──────────────────────────┘  │
│                                                              │
│  CE QUI RESTE VRAI      (puces courtes)                      │
│  CE QUI CHANGE          (puces courtes)                      │
│  LE RÉFLEXE À LÂCHER    « Une IP identifie une machine. »    │
│  LE PIÈGE               (un paragraphe, encadré)             │
│  EN TÉLÉCOM, CONCRÈTEMENT  (un exemple 5G : N2 en SCTP…)     │
│                                                              │
│  ── Vérifier (2 questions) ──────────────────────────────── │
│  Q1 …  ( ) a  ( ) b  ( ) c  ( ) je ne sais pas               │
│                                                              │
│  Pour aller plus loin : 3 liens (libres d'abord)  · Sources  │
│                                     [ Fiche suivante → ]     │
└──────────────────────────────────────────────────────────────┘
```

Une fiche « nouveauté » a la même structure sans « Avant » ni « réflexe à lâcher » : un bloc « Pourquoi ça n'existait
pas chez vous » le remplace. Une fiche « à découvrir » (savoir-faire décoché) masque la colonne « Avant ».

---

## 5. Modèle de contenu

Tout le contenu est en JSON dans `content/`, validé par **Zod au build** (le build échoue sinon). Aucune valeur éditoriale
dans le code.

### `content/metiers/<id>.json`

```jsonc
{
  "id": "infra-virtualisation",
  "nom": "Architecte infra et virtualisation",
  "accroche": "VMware · datacenter · stockage",          // 3 mots-clés max, affichés sur la carte
  "amorce": "Votre matrice de flux, version NetworkPolicy.",
  "portrait": "Environ 20 ans de datacenter…",              // 2 phrases, reprises des personas
  "savoirFaire": [
    { "id": "sf-vlan", "texte": "Je découpe le réseau en VLAN", "statut": "transpose", "fiche": "vlan-reseaux-cluster" },
    { "id": "sf-fournisseurs", "texte": "J'arbitre entre fournisseurs", "statut": "acquis" }
  ],
  "nouveautes": ["reconciliation", "operateurs"],         // ids de fiches genre nouveauté
  "ordre": ["vlan-reseaux-cluster", "matrice-networkpolicy", "reconciliation", "…"], // ordre du plan
  "sources": [{ "nom": "…", "url": "…" }],                // d'où vient le portrait (personas existants)
  "statut": "brouillon"                                   // brouillon | relu
}
```

### `content/fiches/<id>.json`

```jsonc
{
  "id": "matrice-networkpolicy",
  "genre": "transposition",                 // transposition | nouveaute
  "avant": "Votre matrice de flux",         // forme « Votre X »
  "apres": "NetworkPolicy",                 // forme « version Y »
  "resume": { "avant": "…", "apres": "…" }, // 2 à 3 lignes chacun, pour le composant Avant → Après
  "resteVrai": ["…"],                        // 2 à 4 puces, ≤ 140 caractères chacune
  "change": ["…"],                           // 2 à 4 puces
  "reflexe": "Une IP identifie une machine.", // obligatoire si transposition, interdit si nouveauté
  "pourquoiNouveau": null,                   // obligatoire si nouveauté
  "piege": "…",                              // 1 paragraphe ≤ 600 caractères
  "exemple": "…",                            // obligatoirement télécom (5GC, CNF, CaaS)
  "technos": ["kubernetes", "ovn-kubernetes"], // ids de content/technos.json
  "questions": ["q-netpol-labels", "q-netpol-defaut"], // 2 ids de content/questions/*.json
  "plusLoin": [{ "type": "opensource|doc|cours|spec", "nom": "…", "url": "…", "langue": "fr|en", "acces": "gratuit|freemium|payant" }],
  "sources": [{ "nom": "…", "url": "…" }],   // ≥ 1, et chaque puce technique doit être couverte
  "statut": "brouillon",
  "misAJour": "2026-11-08",
  "historique": [                            // ≥ 1 entrée, la plus récente en premier ; affiché en bas de fiche
    { "date": "2026-11-08", "changement": "Première version.", "par": "Taoufik Bouazza", "lien": null } // lien : issue ou PR GitHub
  ]
}
```

### `content/questions/<fiche>.json`

Reprend **le format existant** de `content/pratique/*.json` (`enonce`, `options`, `bonne`, `explication`, `source`,
`statut`) sans changement, rattaché à une fiche au lieu d'un nœud. Toujours une option « je ne sais pas » ajoutée par
l'interface (pas dans le contenu).

### `content/technos.json`

Sous-ensemble de `landscape.json` (id, nom, url, logo) : seulement les technos citées par au moins une fiche. Sert aux
pastilles de logo dans « Après ». Pas de page techno.

### Règles vérifiées au build (chacune a son test)

1. Ids uniques ; toute référence (fiche, question, techno, savoir-faire) existe.
2. Un savoir-faire `transpose` pointe une fiche `transposition` ; un `acquis` n'a pas de fiche.
3. `ordre` d'un métier = exactement l'ensemble de ses fiches (transpositions + nouveautés), sans doublon.
4. Une transposition a `reflexe`, pas `pourquoiNouveau` ; l'inverse pour une nouveauté.
5. Chaque fiche a ≥ 1 source avec URL, ≥ 1 lien `plusLoin` libre (`opensource` ou `doc` gratuit), exactement 2 questions.
6. Longueurs maximales (titres, puces, piège) respectées : c'est une contrainte de design.
7. Une fiche est utilisée par ≥ 1 métier ; une techno est citée par ≥ 1 fiche.
8. Un métier a entre 8 et 16 savoir-faire, au moins 3 `acquis`.
9. Chaque fiche a un `historique` non vide, trié du plus récent au plus ancien, dont la première date égale `misAJour`.

---

## 6. État local (navigateur)

Une seule clé : `ts:bilan`, versionnée.

```ts
type Bilan = {
  v: 1;
  metier: string;
  decoches: string[];                 // ids de savoir-faire décochés (le défaut est « tout coché »)
  fiches: Record<string, { lu?: string; verifie?: string }>; // dates ISO (jour)
};
```

- Un seul métier actif à la fois ; changer de métier demande confirmation (« votre plan actuel sera remplacé »).
- « Vérifié » = les 2 questions justes du premier coup **ou** au second essai après lecture de l'explication. « Je ne
  sais pas » ne vérifie pas.
- « Lu » = la fiche a été ouverte et défilée jusqu'à « Vérifier » (IntersectionObserver).
- Le calcul du bilan (`calculerBilan(metier, decoches)`) et du plan (`calculerPlan(bilan, contenu)`) sont des
  **fonctions pures**, testées, sans accès au stockage.

---

## 7. Épics et stories

Taille : **S** ≈ une demi-session Sonnet, **M** ≈ une session, **L** ≈ deux sessions. Priorité : **MVP** (lancement),
**V1** (juste après), **Plus tard**. Chaque story liste ses critères d'acceptation (CA).

### E0 · Socle technique — MVP

**E0-1 · Initialiser le dépôt (S)**
Next.js 16 (App Router, export statique si possible), TypeScript strict, Tailwind v4, Zod, Vitest, ESLint (config
Next + règles react-hooks strictes de l'ancien dépôt).
CA : `node node_modules/next/dist/bin/next build` passe ; page `/` « hello » ; `git init`, identité Git réglée
(`CLAUDE.md`) ; `.gitignore` ; licences MIT (code) et CC BY-SA 4.0 (contenu) reprises de `dev/telcoskills`.

**E0-2 · Scripts sans npx (S)**
Les lanceurs npm/npx sont bloqués sur le poste : `package.json` documente les commandes `node node_modules/...`
(dev, build, lint, tsc, test) et `CLAUDE.md` les liste.
CA : chaque commande documentée fonctionne telle quelle dans Git Bash.

**E0-3 · CI GitHub (S)**
Reprendre `dev/telcoskills/.github/workflows/ci.yml` : lint, types, tests, build.
CA : la CI passe sur la branche principale ; elle échoue si un contenu est invalide.

**E0-4 · Déploiement Vercel (S) — sur accord explicite de l'auteur seulement**
Nouveau projet Vercel (équipe `limada`), `noindex` tant que l'auteur n'a pas dit « on ouvre ».
CA : URL de préproduction fonctionnelle ; aucun déploiement sans accord dans la conversation ; piège des commits
signés documenté (voir `CLAUDE.md`).

### E1 · Système de design — MVP (à faire avant tout écran)

**E1-1 · Jetons (M)**
Reprendre `telcocloud-roadmaps/src/app/theme-v4.css` comme base (palette décidée D3 : canevas `#f7f6f3`, encre
`#141414`, 7 teintes pastel et leur texte, accent `#ff5a36` **réservé aux actions** avec texte noir) et la typographie
D4 (**Lexend** texte, **Geist Mono** identifiants et chiffres). Un seul fichier `src/app/tokens.css`, sans les ponts
hérités (`--color-brand-*`, `--accent` de compatibilité). Ajouter : échelle typographique (6 tailles max), échelle
d'espacement (4 px de base), durées et courbes d'animation, ombres (2 max), rayons.
Attribution des teintes : une teinte par **genre** et par **catégorie du bilan** (changent de forme
/ nouveau / à lâcher), pas par domaine.
CA : clair et sombre ; test de contraste repris de `palette-v4.test.ts` (AA texte, 3:1 composants) ; aucune couleur
en dur hors de ce fichier (règle ESLint ou test de grep).

**E1-2 · Composants de base (M)**
`Bouton` (principal accent / secondaire / lien), `Carte` (cliquable, état survol, focus visible), `Pastille` (genre,
état), `CaseACocher` (grande cible tactile, animation de coche), `Jauge` (progression fine), `Encadre` (piège),
`Lien externe` (icône, `rel`), `EnTete`, `PiedDePage`.
CA : tous les états (repos, survol, focus clavier, actif, désactivé) ; cibles tactiles ≥ 44 px ; `prefers-reduced-motion`
respecté ; page `/dev/design` (non indexée, absente en production) qui montre tout en clair et en sombre.

**E1-3 · Composant signature « Avant → Après » (M)**
Deux panneaux côte à côte (bureau) ou empilés avec une flèche verticale (mobile) ; « Avant » en teinte neutre
atténuée, « Après » en teinte du genre ; apparition en léger décalage (avant puis après, 150 ms) à l'entrée dans
l'écran, désactivée si `prefers-reduced-motion`.
CA : lisible à 320 px ; sans JavaScript, les deux panneaux s'affichent (pas d'animation bloquante) ; capture dans
`/dev/design`.

**E1-4 · Tuile de chiffre du bilan (S)**
Grand chiffre en Geist Mono, libellé deux lignes, teinte de catégorie ; animation de comptage à chaque recalcul
(≤ 300 ms, désactivable).
CA : le chiffre est lisible par un lecteur d'écran (`aria-live="polite"` sur le bloc bilan, pas sur chaque tuile).

**E1-5 · Phrase d'amorce animée (S)**
Rotation lente (6 s) des amorces des métiers sur l'accueil, fondu, pause au survol et au focus.
CA : arrêt complet si `prefers-reduced-motion` (une seule amorce affichée) ; aucun décalage de mise en page (hauteur
réservée).

### E2 · Contenu et validation — MVP

**E2-1 · Schémas Zod (M)**
`src/contenu/schemas.ts` pour métier, fiche, question, techno, conformes au §5.
CA : types TypeScript dérivés des schémas ; messages d'erreur en français qui nomment le fichier et le champ.

**E2-2 · Chargement et règles du build (M)**
`src/contenu/charger.ts` (lecture au build, jamais côté client) et les 8 règles du §5.
CA : un test par règle avec un jeu de contenu invalide dans `tests/fixtures/` ; le build échoue avec un message
explicite.

**E2-3 · Temps de lecture (S)**
`tempsLecture(fiche)` : mots de tous les champs texte ÷ 200 mots/min, arrondi à la minute supérieure, minimum 2.
CA : testé ; affiché « 6 min ». C'est le seul temps du site.

**E2-4 · Statut brouillon (S)**
Toute fiche ou métier `brouillon` affiche la mention « en relecture » (pastille discrète) en production.
CA : visible sur la carte métier, la ligne du plan et l'en-tête de fiche.

### E3 · Reprise et rédaction du contenu — MVP (le plus gros chantier)

> Règle : Sonnet **rédige des brouillons sourcés** ; l'auteur relit et passe le statut à `relu`. Rien n'est inventé :
> une affirmation sans source n'est pas écrite.

**E3-1 · Scripts de reprise (M)**
`scripts/reprise/` (exécutés une fois, conservés pour traçabilité) :
- `personas.json` (4 personas, contexte chiffré sourcé) → squelettes de `metiers/*.json` (nom, portrait, amorce,
  sources) ;
- `content/pratique/*.json` → `content/questions/` pour les fiches qui reprennent un nœud existant (table de
  correspondance nœud → fiche écrite à la main dans le script) ;
- `landscape.json` + `public/logos/*.svg` + `LICENCES.md` → `content/technos.json` et `public/logos/` (seulement les
  technos citées) ;
- `ressources/apprentissage.json` et ressources des nœuds → candidats `plusLoin` par fiche.
CA : les scripts lisent l'ancien dépôt par un chemin passé en argument ; ils n'écrivent que dans ce dépôt ; rapport
`reports/reprise.md` (ce qui a été repris, ce qui manque).

**E3-2 · Fiche modèle : « Vos VLAN, version réseaux du cluster » (M)**
Réécrire `telcocloud-roadmaps/content/passerelles/reseau-ocp-deux-plans.json` (déjà sourcé : plan primaire OVN /
NetworkPolicy, plan secondaire Multus / SR-IOV, egress, SCTP via MetalLB) au format fiche.
CA : fiche complète, validée par le build ; **sert d'étalon** de ton et de longueur pour toutes les autres ; l'auteur la
relit avant E3-4 (point d'arrêt).

**E3-3 · Les 4 métiers (M)**
Compléter les squelettes : 8 à 16 savoir-faire par métier, dans les mots du métier (« Je… »), statut acquis /
transpose, `nouveautes`, `ordre`. Base : champs `socle`, `atouts`, `manque` des personas.
CA : règles 2, 3, 8 vertes ; rapport `reports/metiers.md` avec, par métier, le bilan par défaut (5 / 6 / 3 / 4…).

**E3-4 · Les fiches (L, à découper par métier)**
Catalogue de départ (proposition, à confirmer — voir Q3). Une fiche peut servir plusieurs métiers.

| id | Votre… | version… | Infra | Cœur | SI | AV |
|---|---|---|:-:|:-:|:-:|:-:|
| vlan-reseaux-cluster | VLAN et interfaces | réseaux du cluster (primaire / Multus, SR-IOV) | ● | ● | | |
| matrice-networkpolicy | matrice de flux | NetworkPolicy, EgressFirewall | ● | | ● | |
| pra-gitops | dossier PRA, RTO/RPO | GitOps et reconstruction déclarative | ● | | ● | |
| changement-pr | procédure de changement (MOP, CAB) | pull request et pipeline | ● | ● | ● | |
| vm-pod | VM et template | conteneur, pod, déploiement | ● | | ● | |
| actif-passif-replicas | haute dispo actif/passif | réplicas, sondes, PodDisruptionBudget | ● | ● | | |
| patch-images | patch des serveurs | images immuables, chaîne d'approvisionnement | ● | | ● | |
| supervision-prometheus | compteurs et supervision OSS | métriques Prometheus, alertes sur symptômes | ● | ● | | |
| interfaces-sbi | interfaces S1AP, GTP, Diameter | SBI HTTP/2, N2 en SCTP, N3 en réseau secondaire | | ● | | |
| appliance-cnf | boîte équipementier | CNF et son cycle de vie (Helm, opérateur) | | ● | | ● |
| dimensionnement-ressources | dimensionnement vCPU / RAM | requests, limits, CPU pinning, NUMA, hugepages | ● | ● | | ● |
| lb-services | load balancer (F5) | Service, Ingress/Route, MetalLB BGP | ● | | ● | |
| dossier-archi-code | dossier d'architecture validé en comité | architecture versionnée (décisions d'architecture, as code) | | | ● | ● |
| cmdb-git | CMDB et inventaire | Git comme source de vérité, labels | ● | | ● | |
| acces-rbac | comptes, sudo, accès root | RBAC, comptes de service, secrets | ● | | ● | |
| chiffrage-slo | chiffrage et TCO | coût par SLO, FinOps | | | | ● |
| ao-exigences-cnf | appel d'offres multi-fournisseurs | exigences CNF et critères d'éligibilité | | ● | | ● |
| reconciliation *(nouveauté)* | — | l'état désiré et la boucle de réconciliation | ● | ● | ● | ● |
| operateurs *(nouveauté)* | — | opérateurs et ressources personnalisées | ● | ● | ● | |
| observabilite-traces *(nouveauté)* | — | traces distribuées (OpenTelemetry) | ● | ● | | |
| plateforme-produit *(nouveauté)* | — | la plateforme comme produit interne | | | ● | ● |

Ordre de rédaction : les fiches de « Architecte infra et virtualisation » d'abord (le métier le plus couvert), puis
cœur réseau, SI, avant-vente.
CA par fiche : règles du §5 vertes ; 2 questions (reprises si elles existent, sinon rédigées et sourcées) ; exemple
télécom ; ton et longueur alignés sur la fiche étalon ; statut `brouillon`.

**E3-5 · Page « Sources et méthode » (S)**
Comment les métiers ont été construits (archétypes anonymisés à partir de CV et d'offres publics, pas une étude),
contexte chiffré sourcé (repris de `personas.json › contexte`), limites, comment signaler une erreur.
CA : chaque chiffre a sa source cliquable.

### E4 · Écran 1 — Accueil — MVP

**E4-1 · Accueil (M)** : maquette §4, rendu statique (lisible sans JavaScript), cartes métier triées par `ordre` de
configuration, amorce animée (E1-5).
CA : action unique ; Lighthouse ≥ 95 (perf, a11y, bonnes pratiques, SEO) ; aucun appel réseau tiers (sauf la mesure, après
accord seulement).

**E4-2 · Bandeau « Reprendre » (S)** : visible seulement si `ts:bilan` existe ; hydratation sans saut de mise en page
(hauteur réservée ou apparition en fondu).
CA : métier, avancement « 3 fiches sur 9 », lien vers la première fiche non vérifiée.

### E5 · Écran 2 — Bilan — MVP

**E5-1 · Fonctions `calculerBilan` / `calculerPlan` (M)** : règles du §4 (écran 2) et du §6.
CA : tests couvrant tout coché, tout décoché, acquis décochés, transposition décochée → « à découvrir », réflexes
comptés une seule fois.

**E5-2 · Page métier (M)** : liste à cocher, bilan en direct (3 tuiles E1-4 : changent de forme, nouveaux, à lâcher), phrase clé,
bouton « Commencer par la première · N min ».
CA : rendu serveur = tout coché (bilan par défaut) ; une case décochée met à jour bilan et bouton sans rechargement ;
clavier complet (espace coche) ; le bilan est enregistré au clic sur « Voir mon plan », pas avant.
**Contre la flatterie** (PR/FAQ D5) : la tuile « réflexes à lâcher » a exactement le même poids visuel que les deux
autres (taille, intensité de la teinte) ; plus aucun chiffre ne célèbre l'acquis, et la phrase clé ne promet pas « dès demain ».

**E5-3 · Changer de métier (S)** : confirmation si un plan existe déjà avec au moins une fiche lue.

### E6 · Écran 4 — Fiche — MVP

**E6-1 · Page fiche (L)** : maquette §4, variantes transposition / nouveauté / à découvrir, logos des technos,
« Pour aller plus loin » (libres d'abord), sources repliées, « Fiche suivante » selon le plan.
CA : rendu statique complet (le texte est dans le HTML) ; balisage sémantique (un `h1`, sections titrées) ; largeur de
lecture 60 à 72 caractères ; métadonnées Open Graph par fiche (titre « Votre X, version Y ») ; en bas de fiche,
l'historique (date, changement, contributeur, lien) replié après les 3 entrées les plus récentes, et le bouton
« Corriger cette fiche » (E10-6).

**E6-2 · Marquer « lu » (S)** : au défilement jusqu'à « Vérifier ».

**E6-3 · Fiche hors plan (S)** : une fiche ouverte depuis un lien partagé, sans bilan, s'affiche normalement avec, en
bas, « Et vous, quel est votre métier ? » vers l'accueil.

### E7 · Vérification — MVP

**E7-1 · Bloc « Vérifier » (M)** : 2 questions, options mélangées à chaque affichage (graine stable par fiche et par
jour pour éviter le clignotement à l'hydratation), « je ne sais pas », explication et source après réponse, second
essai autorisé.
CA : règle « vérifié » du §6 ; état « vérifié » visible en tête de fiche et dans le plan ; accessible (groupe radio,
retour annoncé).

Réutilisable : `telcocloud-roadmaps/src/components/v4/QuestionVerification.tsx` (à réhabiller, logique à relire).

### E8 · Écran 3 — Plan — MVP

**E8-1 · Page plan (M)** : maquette §4, regroupement par catégorie, ligne par fiche, jauge, « Reprendre ».
CA : sans bilan, `/plan` affiche un état vide soigné (« Commencez par votre métier » → accueil) ; rien ne clignote à
l'hydratation (état vide = rendu serveur, comme `/moi` de la v4).

**E8-2 · Impression du plan (S)** : feuille de style d'impression (A4, une page si possible) : métier, bilan, liste des
fiches avec état, adresse du site. Usage : entretien avec un manager.
CA : aperçu avant impression propre dans Chrome et Edge, en clair même si le site est en sombre.

**E8-3 · Fin de plan (S)** (PR/FAQ D4) : quand toutes les fiches du plan sont lues, le haut de `/plan` devient « Vous
avez transformé votre métier » : le bilan final (ce qui reste valable, ce que vous avez transposé, les nouveautés
découvertes), les 3 meilleurs liens « pour aller plus loin » du plan (libres d'abord, les plus cités par les fiches),
et les certifications liées si `content/certifications.json` les couvre (repris de
`telcocloud-roadmaps/content/ciblage/referentiels.json`, rattachés aux fiches au lieu des nœuds ; pondérations à
revérifier avant citation, comme le dit leur note).
CA : pas de rôle cible proposé ; pas de félicitation creuse (pas de confettis) ; l'écran se calcule sans donnée
inventée ; il reste accessible tant que le bilan existe.

### E9 · Partage — V1

**E9-1 · Lien de bilan (M)** : `/plan?b=<encodage>` (métier + décochés + états, compact, avec somme de contrôle) pour
retrouver son plan sur un autre appareil ou le montrer. Reprendre la logique de lien de sauvegarde de l'ancien produit
Progression (somme de contrôle, fusion sans perte).
CA : ouvrir le lien propose « Remplacer » ou « Fusionner » si un bilan local existe ; aucune donnée personnelle.

**E9-2 · Image de partage d'une fiche (S)** : image Open Graph générée au build (Avant → Après en deux colonnes).

### E10 · Transverse — MVP sauf mention

**E10-1 · Pages légales (S)** : mentions légales, confidentialité (aucun cookie, stockage local seulement, ce qu'il
contient, comment l'effacer : bouton « Effacer mes données »).

**E10-2 · Accessibilité (M)** : RGAA niveau AA visé ; navigation clavier, lien d'évitement, focus visibles, contrastes
testés, langue `fr`, textes alternatifs des logos.
CA : audit axe sans erreur sur les 4 écrans, clair et sombre.

**E10-3 · Captures de non-régression (M)** : script `scripts/captures.mjs` (Chrome local en headless, pas de npx) :
4 écrans × {375, 1280} × {clair, sombre} → `reports/captures/`.
CA : lancé avant chaque fin de lot ; les captures sont jointes au résumé du lot.

**E10-4 · SEO (S)** : titres, descriptions, plan du site, `robots.txt` (`noindex` tant que non ouvert), données
structurées `LearningResource` par fiche.

**E10-5 · Mesure d'audience (M, MVP)** (PR/FAQ D1) : reprendre le produit Consentement + Mesure de l'ancien dépôt
(bandeau, script chargé après accord, `NEXT_PUBLIC_ANALYTICS`). Événements : accueil vu, métier choisi, plan créé
(« Voir mon plan »), fiche lue, fiche vérifiée, plan terminé (toutes les fiches lues), retour (activité un autre jour
que la création du plan, une fois par jour).
CA : les 5 indicateurs de `PRFAQ.md` §4 se calculent à partir de ces événements (fonction pure testée, reprise de
`calculerIndicateurs`) ; script `scripts/indicateurs.mjs` qui les sort à partir d'un export ; aucune donnée personnelle,
aucun identifiant de métier croisé avec autre chose.

**E10-6 · Corriger cette fiche (S, MVP)** (PR/FAQ D3) : en bas de chaque fiche, deux liens : « Signaler une erreur »
(issue GitHub préremplie : id de fiche, titre, section concernée à choisir) et « Proposer une correction » (ouvre le
fichier JSON de la fiche dans l'éditeur GitHub). Gabarits d'issue dans `.github/ISSUE_TEMPLATE/` (erreur, nouvelle
fiche, nouveau métier).
CA : les liens fonctionnent sans compte sur le site ; le gabarit demande une source ; la correction acceptée ajoute une
entrée à `historique` (avec le nom du contributeur s'il l'accepte).

**E10-7 · Page Contribuer (S, MVP)** (PR/FAQ D3) : `/contribuer` : ce qu'on peut faire (signaler, corriger, proposer une
fiche ou un métier), les règles (une source par affirmation, le ton, les longueurs du §5), le gabarit JSON d'une fiche
commenté, le délai de réponse que l'auteur s'engage à tenir (Q10), la liste des contributeurs (calculée à partir des
`historique`). Mettre à jour `CONTRIBUTING.md` du dépôt avec les mêmes règles.
CA : un contributeur extérieur peut proposer une fiche valide en suivant la page seule ; la liste des contributeurs ne
contient que des noms présents dans les historiques.

**E10-8 · Page À propos, la vitrine (S, MVP)** (PR/FAQ D6) : pourquoi ce site, la méthode en trois points (on part de
l'existant, chaque affirmation est sourcée, les corrections sont publiques), l'auteur (nom, phrase de présentation,
LinkedIn si fourni : Q8), le code ouvert (lien vers le dépôt), les chiffres calculés (métiers, fiches, sources,
contributeurs, dernière mise à jour). Rien à vendre, aucun appel à prendre contact pour une prestation.
CA : la page est soignée comme un écran principal (barre de qualité §8) ; tous les chiffres sont calculés au build.

### E13 · Test utilisateur — MVP (PR/FAQ D2)

**E13-1 · Protocole (S)** : `reports/test/protocole.md` : 5 consignes (« trouvez votre métier », « dites ce que
signifie votre bilan », « ouvrez la fiche qui vous semble la plus utile », « vérifiez-la », « que feriez-vous de ce
plan ? »), ce qu'on note par personne (réussite sans aide, hésitations, phrases spontanées citées mot pour mot, réaction
au chiffre du bilan : convaincu / sceptique / flatté), le seuil de `PRFAQ.md` §4 (4 personnes sur 5 trouvent leur
métier et comprennent leur bilan sans aide).
CA : passable en 15 minutes par personne, sur la préproduction, sans explication préalable.

**E13-2 · Passation et synthèse (par l'auteur, S)** : 3 à 5 personnes réelles, au moins deux métiers différents.
Sonnet prépare la grille de notes vide et, après réception des notes, la synthèse `reports/test/synthese.md` (seuil
atteint ou non, 3 corrections prioritaires).
CA : **point d'arrêt bloquant** : pas de lot 7 tant que le seuil n'est pas atteint (un second tour après corrections
si besoin).

### E11 · Équipe (manager) — Plus tard

Un manager choisit les métiers de son équipe (« 3 infra, 2 cœur réseau ») et obtient le bilan agrégé : ce qui est déjà
là, les fiches communes, les nouveautés à travailler ensemble. Imprimable. Ne pas commencer avant quatre semaines de
données de la mesure E10-5.

### E12 · Plus tard

Nouveaux métiers (Q2) · anglais · comptes · IA (fiches « version IA » d'un métier) · moteur de recherche de fiches
(seulement au-delà de 40 fiches).

---

## 8. Barre de qualité design (Definition of Done visuelle)

Un écran n'est terminé que si :

- il a **une** action principale, en accent, et pas plus ;
- il est impeccable à 320, 375, 768, 1280 et 1600 px, en clair et en sombre (captures E10-3) ;
- les états vide, chargement (s'il existe), erreur et survol/focus sont dessinés ;
- aucun saut de mise en page à l'hydratation (CLS = 0 mesuré) ;
- les animations durent ≤ 300 ms, ont une raison (montrer un changement d'état), et se coupent avec
  `prefers-reduced-motion` ;
- le texte respecte la largeur de lecture, l'échelle typographique et l'espacement des jetons — aucune valeur ad hoc ;
- aucune phrase à l'écran ne contient un mot banni (§3) ;
- Lighthouse ≥ 95 sur les quatre axes.

Definition of Done technique : lint, types, tests et build verts ; contenu valide ; captures jointes ; résumé de lot
écrit dans `reports/lots/<n>.md` ; commit en français, petit et explicite.

---

## 9. Lots pour Sonnet (ordre d'exécution)

| Lot | Contenu | Point d'arrêt (attendre l'auteur) |
|---|---|---|
| 0 | E0-1, E0-2, E0-3 | — |
| 1 | E1 complet + `/dev/design` | **Oui** : l'auteur valide le rendu du système (captures) |
| 2 | E2 complet + E3-1 | — |
| 3 | E3-2 (fiche étalon) | **Oui** : l'auteur relit la fiche étalon |
| 4 | E3-3 + fiches du métier infra (E3-4) | **Oui** : l'auteur relit le métier infra |
| 5 | E4, E5, E6, E7, E8 (les 4 écrans et la fin de plan, sur le métier infra) ; E10-6 ; E0-4 en préproduction `noindex` **sur accord** | **Oui** : l'auteur essaie les 4 écrans |
| 6 | E13-1 (protocole) ; en parallèle E3-4 pour cœur réseau, SI, avant-vente ; E3-5 | **BLOQUANT** : test passé par l'auteur (E13-2), seuil atteint |
| 7 | Corrections issues du test ; E10-1 à E10-5, E10-7, E10-8 | **Oui** : l'auteur vérifie les conditions de lancement (`PRFAQ.md` §4) |
| 8 | Ouverture publique (retrait du `noindex`, domaine : Q1) **sur accord** | — |
| 9 | V1 : E9 | — |

Conditions de lancement (reprises de `PRFAQ.md` §4) : fiche étalon relue par l'auteur ; test passé et seuil atteint ;
mesure en place ; « Corriger cette fiche » et « Contribuer » en service ; 4 écrans conformes au §8.

À chaque fin de lot : résumé en dix lignes au plus, captures, questions éventuelles. Aux points d'arrêt, ne pas
enchaîner. Hors points d'arrêt, enchaîner sans redemander.

---

## 10. Ce qu'on reprend de l'existant

| Source (`dev/telco/telcocloud-roadmaps` sauf mention) | Usage ici | Action |
|---|---|---|
| `src/app/theme-v4.css`, `palette-v4.test.ts` | jetons et test de contraste | adapter (E1-1) |
| Polices Lexend et Geist Mono (déclarées dans `src/app/`) | typographie | reprendre |
| `src/components/v4/QuestionVerification.tsx`, `BarreProgression.tsx`, `PastilleChiffre.tsx`, `SiteHeaderV4.tsx`, `SiteFooterV4.tsx` | point de départ de composants | réhabiller, relire la logique |
| `content/passerelles/personas.json` | 4 métiers, contexte chiffré sourcé | reprendre par script (E3-1) |
| `content/passerelles/reseau-ocp-deux-plans.json` | fiche étalon | réécrire (E3-2) |
| `content/roadmaps/passerelle-*.json` | gisement de nouveautés et de ressources | consulter, ne pas reprendre la structure |
| `content/pratique/*.json` (56 fichiers, 117 questions en brouillon) | questions de vérification | reprendre par script |
| `content/landscape.json`, `public/logos/` + `LICENCES.md` | technos et logos | reprendre le sous-ensemble cité |
| `content/ressources/apprentissage.json` | « Pour aller plus loin » | candidats par script |
| Produits Consentement et Mesure (`src/produits/`), dont `calculerIndicateurs` | mesure d'audience (MVP) | reprendre (E10-5) |
| `content/ciblage/referentiels.json` (CKA, KCNA, LFCS…) | certifications de la fin de plan | reprendre, rattacher aux fiches (E8-3) |
| Lien de sauvegarde du produit Progression | partage V1 | reprendre la logique (E9-1) |
| `scripts/verifier-liens.mjs` | contrôle des liens | reprendre |
| `dev/telcoskills/.github/workflows/ci.yml`, `LICENSE`, `LICENSE-CONTENU.md`, `CONTRIBUTING.md` | dépôt | reprendre |
| Pièges de `HANDOFF.md` (commits signés Vercel, npx bloqué, `node:fs` côté client, règles react-hooks) | `CLAUDE.md` | reprendre |
| Roadmaps, graphe, métro, objectif, cockpit, diagnostic, Sylva, vidéos, projet fil rouge, analyses | — | **ne pas reprendre** |

---

## 11. Questions ouvertes (valeur par défaut appliquée si pas de réponse)

| # | Question | Défaut retenu |
|---|---|---|
| Q1 | Nom et adresse : garder **TelcoSkills** et le domaine telcoskills.com (qui remplacerait l'ancien site), ou un nouveau nom ? | Nom TelcoSkills, nouveau projet Vercel en `noindex` ; la bascule du domaine se décide au lot 8. **BLOQUANT au lot 8 seulement.** |
| Q2 | Les 4 métiers suffisent-ils au lancement ? Candidats : exploitant NOC / supervision, ingénieur transport IP/MPLS, chef de projet télécom, sécurité. | 4 métiers au MVP ; l'exploitant NOC en premier ajout (V1). |
| Q3 | Le catalogue de 21 fiches (§7 E3-4) est-il le bon point de départ ? | Oui, en brouillon ; l'auteur ajuste au lot 4. |
| Q4 | Vouvoiement ou tutoiement ? Les amorces actuelles tutoient (« Ton dossier PRA »). | **Vouvoiement** (public senior, cadre d'entreprise) ; amorces réécrites « Votre… ». |
| Q5 | La destination est-elle seulement le cloud natif télécom (CaaS, CNF 5GC, GitOps, observabilité), ou aussi l'IA ? | Cloud natif seulement ; l'IA en « Plus tard ». |
| Q6 | Les décideurs (convaincre, équiper une équipe) : vue Équipe au lancement ou après ? | Après (E11), une fois la mesure en place. |
| Q7 | Une personne peut-elle combiner deux métiers (ex. infra **et** cœur réseau) ? | Non au MVP : un métier à la fois, KISS. |
| Q8 | Lien vers l'auteur (LinkedIn) sur la page À propos ? | Oui si l'adresse est fournie (variable d'environnement), masqué sinon. |
| Q9 | Que devient l'ancien site telcoskills ? | Il reste en ligne tel quel jusqu'à la bascule ; aucune modification. |
| Q10 | Quel délai de réponse vous engagez-vous à tenir sur un signalement (affiché sur la page Contribuer) ? | « Sous 7 jours ». |
| Q11 | Les contributeurs sont-ils nommés dans l'historique par défaut ? | Oui s'ils l'acceptent dans l'issue (case à cocher du gabarit), sinon « un contributeur ». |

---

## 12. Évolution du 2026-11-09 : cockpit, carte et schémas (décision de l'auteur)

L'auteur veut un vrai cockpit, une progression et une carte, à partir du projet d'origine, **adaptés à la transformation** (pas à des parcours complets). Ce qui est ajouté, et ce qui reste exclu :

- **Carte de transformation** (React Flow, `@xyflow/react`) : seulement les 7 à 12 étapes du métier, reliées par des **prérequis conseillés** (`dependances` du métier, règle 10 : chaque prérequis précède la fiche dans `ordre`). Jamais de verrou. Placement calculé (`src/lib/carte.ts`), style par les jetons, chaque étape est un lien vers la fiche. Sur petit écran, la liste remplace la carte.
- **Cockpit** (`/plan`) : où j'en suis (vérifiées, lues), prochaine étape, **objectif** (une fiche à atteindre : étapes restantes et temps de lecture restant, chemin surligné sur la carte). Stocké dans `ts:bilan` (`objectif`, facultatif).
- **Schémas** (règle 11) : chaque fiche a une chaîne d'étapes « avant » puis « après » (SVG et HTML statique), sauf la nouveauté qui n'a pas d'« avant ».
- **Ressources** : les ressources d'apprentissage de l'ancien dépôt sont reprises par fiche (`scripts/reprise/ressources.mjs`), le gratuit et le français d'abord ; types `cours` et `video` ajoutés.
- **Toujours exclus** : heures cumulées, rythme et date d'arrivée estimée (le seul temps affiché est la somme des temps de lecture), parcours complets, rôles cibles, vue Métro, vue Arbre.

---

## 13. Refonte du 2026-11-09 : une seule feuille de route vivante (décision de l'auteur)

L'ancien site (telcoskills.com) était « trop complexe ». Ce projet le **remplace** : on migre ce qui vaut, on élague le reste. Il n'y a plus de parcours fixes ni de métier à choisir en premier.

- **Graphe migré** (`scripts/migration/graphe.mjs`, rapport `reports/migration-graphe.md`) : 131 compétences reliées par leurs prérequis, avec leurs ressources, réparties en 10 domaines (`content/competences/`, `content/domaines.json`). Élagage : les 47 compétences propres aux parcours « IA agentique » et « Sylva » sont retirées (hors périmètre, Q5).
- **Fiches de transformation** : chacune est rattachée à des compétences (`competences`). Une compétence sans fiche reste dans la feuille de route, avec ses ressources, en attendant sa fiche.
- **Questions et moteur** : `content/orientation.json` (7 questions, 5 à 10 admises, règle 13) et `src/lib/parcours.ts` (fonctions pures, testées). Les réponses ont des effets cumulés et lisibles (acquis, poids de domaine, cible, écarté) ; chaque étape dit pourquoi elle est là. Sans réponse : la feuille de route complète (vue d'ensemble).
- **Deux écrans** : `/roadmap` est l'assistant (une question par écran ; à côté, les dix domaines en groupes qui se resserrent en direct, de 131 compétences à votre feuille de route). Dès la première réponse, `/cockpit` est le cockpit d'apprentissage : reprendre la prochaine étape, progression par domaine, objectif et chemin restant, programme en blocs repliables ou carte. `/competence/<id>` : résumé, prérequis, fiches, ressources, « Je maîtrise déjà ».
- **Retirés** : choix du métier, liste de savoir-faire cochés, bilan à trois tuiles, `/metier`, `/plan` (le cockpit reprend leur rôle).
- **À faire** (portage depuis l'ancien site) : pratique par compétence (117 questions), landscape des outils, recherche ⌘K, redirections de telcoskills.com, mesure d'audience.
- **Diagrammes d'architecture** (`diagramme` d'une fiche ou d'une compétence) : zones, composants placés à la main, flèches étiquetées tracées automatiquement, rendu en SVG dans le HTML statique (`src/composants/Diagramme.tsx`, géométrie pure dans `src/contenu/diagramme.ts`). Règle 15 : le build refuse un composant qui déborde, deux composants qui se chevauchent, un texte trop long pour sa boîte, une flèche qui en traverse un autre ou vers un composant inconnu. Premiers diagrammes : architecture Kubernetes, boucle de réconciliation, réseaux primaire et secondaire, NetworkPolicy, cœur 5G (SBI), GitOps (`scripts/migration/diagrammes.mjs`). Une fiche sans diagramme garde sa chaîne avant → après.
- **Couverture des diagrammes** (2026-11-10, trois lots) : les 21 fiches et 105 compétences sur 131 ont un diagramme. Gabarits de l'atelier (`scripts/migration/outils-diagramme.mjs`) : rangées, colonnes, zones, flux, étoile. Lots : `diagrammes-lot1.mjs` (fiches), `diagrammes-lot2.mjs` (Kubernetes, OpenShift, réseau, stockage, performance), `diagrammes-lot3.mjs` (cœur 5G, exploitation, sécurité, livraison, gouvernance, fondations). Les compétences sans diagramme sont surtout réglementaires (`reg-*`) ou organisationnelles ; la source d'un diagramme de compétence est sa première ressource libre.
- **Relecture des diagrammes** (2026-11-10) : le build contrôle aussi les étiquettes de flèches (elles ne chevauchent ni un composant ni une autre étiquette ; sur un trait vertical elles se posent à côté du trait). Les gabarits flux et étoile élargissent les écarts selon la longueur des étiquettes. Sur mobile, un diagramme se fait défiler horizontalement (indication affichée).
- **Lot 4** (2026-11-12) : 13 compétences techniques de plus (`diagrammes-lot4.mjs`) ; 118 compétences sur 131 ont un diagramme. Les 13 restantes sont réglementaires (`reg-*`, `reglementation-5gc`) ou de simple liste (`certifs`) : un schéma juridique se rédige et se relit avec l'auteur, on n'invente pas de portée légale.
- **Pages d'information** (2026-11-12) : À propos, Sources et méthode, Contribuer, Confidentialité (avec « Effacer mes données ») et Mentions légales, liées depuis le pied de page ; `content/contexte.json` (chiffres de contexte sourcés, limites) ; chiffres du site calculés au build (`src/lib/site.ts`) ; `CONTRIBUTING.md` et gabarits de tickets (`.github/ISSUE_TEMPLATE/`). Reste : mesure d'audience avec consentement, test utilisateur, relecture des fiches, ouverture du dépôt et du site (Q1).

---

## 14. État au 2026-11-21 : ce qui existe, ce qui reste

Ce paragraphe fait foi sur l'état du produit. Il remplace les §4 à §9 (historique) ; le §12 et le §13 restent exacts.

### Ce qui existe (en production sur telcoskills-transfo.vercel.app, `noindex`)

- **Une feuille de route vivante** (§13) et un cockpit d'apprentissage ; 131 compétences migrées, 21 fiches, 118 diagrammes.
- **Fiche en cockpit « Pilotage »** (2026-11-20, `reports/lots/epreuve.md`) : ligne de métro à correspondances collée en haut (`src/lib/metro.ts`), feuille de route à gauche, lecture au centre, « prochain geste » à droite (une ressource à lire d'abord, le prompt, l'épreuve) ; une seule colonne sous 62 rem. Les schémas restent dans la colonne de lecture et s'agrandissent dans une fenêtre.
- **Mise à l'épreuve** à la place du quiz : un cas, le raisonnement de l'apprenant (15 caractères au moins) avant d'afficher le raisonnement attendu et sa source, puis « Je l'avais » / « À revoir ». « Vérifié » devient « Acquis » (stockage migré sans perte). Le texte écrit n'est pas conservé.
- **Catégorie par fiche** (`categorie` : comprendre, pratique, integrer, diagnostiquer, decider) et **prompt à copier** : un gabarit à blancs « [à compléter] » pour poser la bonne question à l'IA de son choix ; le format de réponse demandé suit la catégorie (`src/lib/prompt.ts`).
- **Avis d'auteur** (`avisAuteur`, règle 16) : les passages qui ne sont pas des faits sourcés (conseils, comparaisons avec « avant ») sont étiquetés sur le site ; tout le reste doit avoir sa source.
- **Audit des fiches** (`/audit`, lien discret en pied de page, `noindex`) : fini ou non, classement, contenu, points à vérifier. Rapport `reports/audit-fiches.md` (`node scripts/audit-fiches.mjs`), notes et classements validés dans `content/audit.json`.
- **Relecture sourcée** (`reports/relecture/`) : une relecture par fiche, chaque affirmation classée confirmée, non sourcée ou douteuse. Lots A1, A2, B, C et D appliqués : les 21 fiches sont relues contre leurs sources (synthèses `reports/relecture/lot-A1.md`, `lot-A2.md` et `lots-B-C-D.md`), aucune n'est encore passée en « relu » par l'auteur.

### Ce qui reste

1. **Contenu**
   - **Relecture par l'auteur** des 21 fiches (les corrections sourcées des lots A à D sont appliquées) : « relu » n'est posé que par lui, aujourd'hui 0 fiche finie sur 21.
   - Points à sourcer connus (colonne « À vérifier » de `/audit`) : actif/passif, SCTP porté par un Service LoadBalancer, nom « N2 », NetworkPolicy sur le réseau primaire, RTO et RPO.
   - **Fiche « diagnostiquer »** (dépanner Kubernetes) à écrire avec l'auteur ; arbitrer `plateforme-produit` (decider ou comprendre) ; valider les classements.
   - **Canevas propres à chaque catégorie** (aujourd'hui la catégorie ne change que le prompt) ; relecture des 21 épreuves (brouillons dérivées de l'ancien quiz).
   - 13 compétences sans diagramme (réglementaires), à rédiger avec l'auteur.
2. **Fonctions**
   - Rappel espacé d'une fiche acquise (par exemple à J+7).
   - Portage depuis l'ancien site : 117 questions de pratique, paysage des outils, recherche ⌘K, redirections de telcoskills.com.
3. **Ouverture au public** (questions Q1 et Q8)
   - Nom de domaine et bascule de l'ancien site ; dépôt GitHub à rendre public (les liens « Signaler une erreur » et « Proposer une correction » ne marchent pas sinon) ; accès de l'application GitHub à Vercel puis `vercel git connect` ; retrait du `noindex`.
   - Adresse Vercel des mentions légales et lien LinkedIn à confirmer ; mesure d'audience avec consentement.
   - **Test utilisateur** (3 à 5 personnes, E13) : point d'arrêt bloquant avant l'ouverture.
4. **Entretien** : vérification mobile et thème clair seulement partielle ; diagrammes du lot 4 et pages d'information non relus visuellement.

### Méthode retenue pour compléter les fiches

Des lots par catégorie, un prompt commun par lot (pas un par fiche). Pour chaque fiche : un agent lit les sources et classe chaque affirmation ; les corrections sont proposées, puis appliquées ; ce qui est une opinion reste mais porte l'étiquette « avis d'auteur » ; l'auteur relit et passe la fiche en « relu ». Les sources illisibles (redirigées, 404) sont retirées plutôt que citées.

---

## 15. Audit du 2026-11-21 : plan pour les agents

Le rapport d'audit UX/UI, éditorial et fonctionnel du 2026-11-21 est comparé à l'existant, recommandation par recommandation, dans `reports/audit-2026-11-21/plan-agents.md`, avec les lots L1 à L7 confiés aux agents (accueil, assistant, fiche en trois niveaux, qualité mesurée, contribution sans GitHub, transparence, partage, recherche). Ce plan complète le §14 ; il ne rouvre pas les principes du §2.
