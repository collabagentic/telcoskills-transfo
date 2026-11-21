# Audit du 2026-11-21 : écart avec l'existant et lots pour les agents

Source : rapport d'audit UX/UI, éditorial, stratégique et fonctionnel v1.0 (21 novembre 2026), comparé au code du dépôt (commit `20442ef`) et à `BACKLOG.md` §13 et §14.
Ce document dit, pour chaque recommandation, ce qui existe déjà, ce qui manque, et ce qui part en lot. `BACKLOG.md` reste la référence produit ; ce plan s'y ajoute (§15).

## 1. Comparaison recommandation par recommandation

Légende : **Fait** · **Partiel** · **Absent** · **Hors code** (travail de l'auteur, pas des agents) · **Écarté** (contredit le backlog ou n'a pas de procédure réelle).

| # | Recommandation de l'audit | État | Constat dans le code | Lot |
|---|---|---|---|---|
| 4.2A | Promesse claire à l'arrivée | Partiel | `src/app/page.tsx` : slogan « Le telco cloud : par où commencer ? » et une seule action. Le « ce qui reste / change / à apprendre » n'est pas dit. | L1 |
| 4.2B | Trois entrées (évaluer, explorer, contribuer) | Absent | Un seul bouton, « Composer ma feuille de route ». | L1 |
| 4.2C | Exemple concret sur l'accueil | Absent | Aucune fiche, aucun schéma montré. | L1 |
| 4.2E | Projet vivant (dernières évolutions) | Absent | `historique` existe par fiche, rien sur l'accueil. Données réelles seulement. | L7 |
| 6.1 | Avant le questionnaire : étapes, durée, sans compte | Partiel | `Assistant.tsx` affiche « Question n sur N » ; rien avant de commencer, ni durée, ni « sans compte ». | L2 |
| 6.2 | Progression, retour arrière, réponses conservées | Fait | « ‹ Précédente », pastilles de question, stockage `ts:bilan`. À contrôler sur mobile (L4). | L4 |
| 6.3 | Restitution actionnable (3 priorités, fiches associées) | À vérifier | Le cockpit reprend la prochaine étape ; l'écran final de l'assistant doit être relu. | L2 |
| 6.4 | Export, comparaison | Écarté (P3) | Pas avant que la restitution soit solide. |  |
| 7.1 | Garder la richesse des fiches | Fait | Toutes les sections de la liste sont présentes (avant/après, reste vrai, change, schéma, réflexe, piège, exemple, prompt, épreuve, ressources, sources, historique). | — |
| 7.2 | Lecture en 3 niveaux (30 s, 2 min, approfondir) | Absent | Une colonne de lecture continue, sans repère de niveau. | L3 |
| 7.4 | Diagrammes lisibles, zoom | Fait | Bouton « Agrandir », contrôles de géométrie au build (règle 15). Mobile : défilement horizontal seulement. | L4 |
| 8 | Statuts et transparence IA | Partiel | `statut` (brouillon), pastille « en relecture », « avis d'auteur », page `/audit`, « Sources et méthode ». Le rôle de l'IA et les niveaux de confiance ne sont pas dits clairement. | L6 |
| 8.2 | « Technically reviewed », « Community feedback » | Écarté | Aucune procédure réelle : ne pas afficher un statut qui n'existe pas. |  |
| 9 | Contribuer sans GitHub | Absent | « Signaler une erreur » ouvre un ticket GitHub ; « Proposer une correction » l'éditeur GitHub. Bloquant pour un professionnel du télécom. | L5 (décision) |
| 9.4 | Visibilité des contributeurs | Partiel | `contributeurs()` dans `src/lib/site.ts`, alimenté par l'historique. Rien d'inventé. | — |
| 10 | Recherche | Absent | Prévue au backlog §13 (« ⌘K »). | L7 |
| 11 | Design system léger documenté | Partiel | `DESIGN.md` et `src/app/tokens.css` ; pas de page d'inventaire des composants. | L4 (inventaire) |
| 12, 13 | Mobile et accessibilité | À mesurer | Backlog §14.4 : « vérification mobile et thème clair seulement partielle ». | L4 |
| 14 | Performance, liens, routes | À mesurer | Aucune mesure, aucun contrôle de liens sur `out/`. | L4 |
| 15 | URL stables, Open Graph, image de partage | Partiel | `generateMetadata` donne titre et description par fiche. Pas d'image de partage, pas d'URL canonique, pas de bouton « Copier le lien ». `noindex` volontaire jusqu'à l'ouverture. | L6bis |
| 16 | Piliers éditoriaux, LinkedIn, masterclasses | Hors code | Travail de l'auteur. | — |
| 17 | Mesure d'audience respectueuse | Hors code pour l'instant | Choix d'outil et consentement à décider (backlog §14.3). | — |
| 5.D | Parcours contributeur de bout en bout | Absent | Dépend de L5. | L5 |

### Contradictions et points à ne pas suivre à la lettre

1. **Statuts** : l'audit propose cinq statuts. Seuls deux correspondent à une procédure réelle : « sources contrôlées » (relecture sourcée des lots A à D, par agent) et « relu par l'auteur » (0 fiche sur 21 aujourd'hui). Les autres ne s'affichent pas (§21.3 de l'audit).
2. **« Compétences à acquérir » / scores** : pas de score précis ; le moteur `src/lib/parcours.ts` donne des effets lisibles, pas une note.
3. **Masterclasses, LinkedIn, analytics** : ne relèvent pas des agents de code.
4. **Site statique** (`output: "export"`, principe 7 du backlog) : tout formulaire avec envoi serveur casse ce principe. D'où la décision L5.
5. **Ouverture au public** : toujours bloquée par le test utilisateur (E13) et par la décision sur le dépôt public. Aucun lot ne retire le `noindex`.

## 2. Règles communes à tous les lots

À donner telles quelles aux agents, en plus de `CLAUDE.md` et `AGENTS.md` du dépôt :

- Un lot = une branche = une PR. Lots indépendants par fichiers, sauf mention contraire.
- Avant de coder : lire `BACKLOG.md` §2, §13, §14, `DESIGN.md`, `CLAUDE.md` et `node_modules/next/dist/docs/` pour toute API Next.
- Ne supprimer aucune section de fiche, ne réécrire aucun contenu : les nouveaux textes sont des textes d'interface, en français, vouvoiement, sans jargon.
- Rien d'inventé : aucune statistique, aucun contributeur, aucune activité. Les blocs « récent » se calculent depuis `historique`, ou ne s'affichent pas.
- Pas de compte, pas de pistage, pas de dépendance sans une ligne de justification dans le commit.
- Critères d'acceptation vérifiés par la CI : lint, types, tests, build verts. Un test (Vitest) par logique ajoutée dans `src/lib` ou `src/contenu`.
- Compte rendu ≤ 10 lignes dans `reports/lots/<lot>.md` : fait, fichiers, tests, **non testé**, limites.
- Les vérifications visuelles (mobile 360, 390, 430, tablette, clair et sombre) et les mesures Lighthouse ne sont pas faisables dans la sandbox : elles sont faites ensuite, sur la branche de la PR, avec un navigateur. L'agent le dit dans son rapport au lieu de les déclarer faites.

## 3. Lots

Ordre : L1 → L2 → L3 en série (ils touchent l'accueil, l'assistant et la fiche, fichiers distincts : L1, L2 et L3 peuvent en réalité partir ensemble). L4 en parallèle. L5 attend la décision. L6, L6bis et L7 ensuite.

### L1 · Accueil (P0)
- **Problème** : la promesse n'est pas dite, une seule porte, aucun exemple.
- **Solution** : accroche « Vous connaissez déjà le télécom » + trois phrases « Ce qui reste. Ce qui change. Ce qu'il faut apprendre. » ; trois entrées de poids égal : *Composer ma feuille de route* (`/roadmap`), *Explorer les compétences* (`/cockpit`, programme), *Contribuer* (`/contribuer`) ; un exemple réel : la première fiche d'un tableau fixé dans `src/lib/site.ts` (avant → après, réflexe à lâcher, lien), tiré du contenu et non recopié ; pas de compteur (DESIGN.md). Page courte.
- **Fichiers** : `src/app/page.tsx`, `src/app/globals.css`, éventuellement un composant d'exemple.
- **Impact** : compréhension en quelques secondes. **Complexité** : faible. **Risque** : le `Reprise` actuel (reprise de session) doit rester au-dessus.
- **Validation** : build vert ; test de rendu statique de l'accueil (3 liens, 1 exemple issu des fiches) ; pas de débordement à 360 px (contrôlé après coup).

### L2 · Assistant et restitution (P0)
- **Problème** : rien n'est dit avant la première question ; la restitution finale doit viser « trois priorités ».
- **Solution** : écran d'entrée « N questions · environ 2 minutes · sans compte · vos réponses restent dans votre navigateur » (N lu dans `orientation.json`, la durée calculée ou écrite sobrement) ; écran final : en haut « Ce que vous maîtrisez déjà », puis **trois priorités au plus** avec la raison de chacune (le moteur fournit déjà « pourquoi cette étape »), liens vers les fiches, bouton vers la feuille de route complète. Pas de score. Inspecter d'abord l'écran final actuel et ne changer que l'écart.
- **Fichiers** : `src/composants/Assistant.tsx`, `src/lib/parcours.ts` (si une sélection de priorités manque, fonction pure testée), `tests/parcours.test.ts`.
- **Risque** : régression du stockage `ts:bilan` ; test de non-régression obligatoire.
- **Validation** : tests `parcours` ; retour arrière conserve les réponses ; sans réponse, la feuille complète reste affichée.

### L3 · Fiche en trois niveaux de lecture (P0/P1)
- **Problème** : lecture continue et dense.
- **Solution** : bandeau « L'essentiel en 30 secondes » en tête, **composé des champs existants** (`resume`, `reflexe` ou `pourquoiNouveau`, première puce de `change`) ; repère « 2 minutes » (reste vrai, change, réflexe, exemple) et « Approfondir » (schéma détaillé, piège, épreuve, ressources, sources, historique) avec ancres ; aucune section retirée ni déplacée de façon destructive ; les étiquettes « avis d'auteur » restent visibles dans le bandeau si le champ source en porte une.
- **Fichiers** : `src/app/fiche/[id]/page.tsx`, composant neuf, `globals.css`.
- **Risque** : la mise en page « Pilotage » (cockpit à trois colonnes, sous 62 rem une colonne) ; ne pas la casser.
- **Validation** : test sur les 21 fiches (le bandeau n'est jamais vide) ; build vert.

### L4 · Qualité mesurée (P0)
- **Solution** : script `scripts/verifier-sortie.mjs` qui parcourt `out/` : liens internes cassés, ancres, routes sans titre ni description, images sans alternative, ordre des titres h1 puis h2. Branché dans la CI. Rapport `reports/qualite-2026-11-21.md` : problèmes classés par gravité. Inventaire des composants (`reports/composants.md`) : boutons, pastilles, encadrés, états vides et d'erreur. Corrections limitées aux défauts évidents et locaux ; le reste est listé.
- **Mesures faites hors sandbox** (par Claude Code sur la branche) : Lighthouse, 360/390/430, clair et sombre, clavier et focus, `prefers-reduced-motion`.
- **Risque** : le script ne doit pas faire échouer la CI sur du contenu externe ; les liens externes ne sont pas testés dans la CI.
- **Validation** : script vert sur `out/` ; rapport avec « non testé » explicite.

### L5 · Contribuer sans GitHub (P1) : décision requise
Deux voies, au choix de l'auteur (voir la question posée) :
- **A. Sans serveur** : bouton « Signaler ou améliorer cette fiche » qui ouvre un message prérempli (fiche, section, type de retour, texte, source) vers une adresse de contact publique de l'auteur. Aucun secret, compatible avec l'export statique, aucune donnée stockée. Limite : demande un client de messagerie.
- **B. Formulaire** : une fonction serveur crée un ticket GitHub depuis le formulaire. Plus confortable, mais : sort du principe « site statique », demande un jeton GitHub (saisi par l'auteur seul, jamais par un agent), un anti-spam, et la décision sur le dépôt public.
- Dans les deux cas : fiche identifiée automatiquement, 4 types (erreur, amélioration, ressource, retour d'expérience), confirmation, aucune donnée personnelle demandée, texte de confidentialité mis à jour.
- **Fichiers** : `src/app/fiche/[id]/page.tsx`, `src/app/contribuer/page.tsx`, `src/app/confidentialite/page.tsx`, `CONTRIBUTING.md`.

### L6 · Transparence éditoriale (P1)
- **Solution** : sur « Sources et méthode » : le rôle de l'IA (rédaction et relecture sourcée par agents), le rôle de l'auteur, les deux statuts réels et leur définition (« sources contrôlées », « relu par l'auteur »), comment signaler une erreur, les limites. Sur la fiche : une ligne de statut (état, date, lien vers la méthode) au lieu de la seule pastille « en relecture ». Les valeurs viennent du contenu (`statut`, `audit.json`) : zéro « relu » tant que l'auteur ne l'a pas posé.
- **Validation** : test : aucune fiche n'affiche « relu par l'auteur » sans le champ correspondant.

### L6bis · Partage (P1)
- **Solution** : image de partage par fiche (titre, avant → après, identité TelcoSkills ; vérifier dans `node_modules/next/dist/docs/` que le rendu d'image est possible en export statique, sinon images générées par script au build), `alternates.canonical`, `openGraph.url`, bouton « Copier le lien » sur la fiche. `noindex` conservé.
- **Validation** : build vert ; une image par fiche dans `out/` ; titres et descriptions non génériques.

### L7 · Recherche et évolutions récentes (P2)
- **Solution** : recherche ⌘K statique (index JSON produit au build : noms de compétence, fiches, acronymes de `technos.json`, tolérante aux accents et à la casse) ; bloc « Dernières évolutions » sur l'accueil, calculé depuis `historique`, **masqué s'il y a moins de trois entrées réelles**.
- **Risque** : poids de l'index ; mesure dans le rapport.

### Non confié aux agents
Relecture des 21 fiches par l'auteur ; fiche « diagnostiquer » ; 13 compétences réglementaires sans diagramme ; test utilisateur (3 à 5 personnes) ; ouverture du dépôt et du site, domaine, retrait du `noindex` ; mesure d'audience ; masterclasses et LinkedIn ; fusion des PR et déploiement (toujours l'auteur).

## 4. Prérequis d'infrastructure (aucun n'est fait)

1. Le dépôt vit dans `taoufikbo/telcoskills-transfo` (privé, personnel). Les agents n'écrivent que dans l'organisation « usine » `collabagentic` (aujourd'hui : `modele-projet`, `projet-test`). Il faut un dépôt `collabagentic/telcoskills-transfo`, privé, avec l'accès du bot `taoufikAI` en écriture.
2. Le projet Vercel `telcoskills-transfo` est relié au dépôt personnel ; ne pas y toucher pendant le développement : aucun déploiement sans accord.
3. Un projet dans le cockpit (`alkhadam/cockpit-projets`) avec ce plan comme spécification validée, puis un envoi par lot (label `agents:go`).
