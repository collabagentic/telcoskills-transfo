# Audit des deux sites : TelcoSkills et TelcoSkills Transformation

27 novembre 2026. Sites lus en ligne : https://www.telcoskills.com (l'ancien) et https://telcoskills-transfo.vercel.app (Transformation). Données mesurées dans les deux dépôts.

> « Jouer au football est très simple, mais jouer un football simple est la chose la plus difficile qui soit. » — Johan Cruyff

Le critère de cet audit en découle : **chaque page répond à une seule question du lecteur, et rien de ce qui est riche n'est perdu, seulement rangé**.

Non testé : le rendu mobile, l'accessibilité au clavier et au lecteur d'écran, et les questionnaires de bout en bout pour chaque combinaison de réponses.

---

## 1. Le constat en une phrase

L'ancien site sait **où** une compétence sert (dans quel métier, à quelle phase du projet, avec quel outil). Transformation sait **comment** l'apprendre quand on vient du télécom (ce qui reste, ce qui change, le réflexe à lâcher). Aucun des deux ne fait les deux.

## 2. Ce que chaque site fait le mieux

| Question du lecteur | Ancien site | Transformation |
|---|---|---|
| « Est-ce pour moi ? » | 10 métiers de départ, larges | Promesse forte : « Vous connaissez déjà le télécom » |
| « Par où je commence ? » | 3 questions, un premier pas, un parcours parmi 6 | 7 questions, une feuille de route sur mesure |
| « Qu'est-ce que je dois apprendre là ? » | Fiche compétence : prérequis, ce que vous saurez faire, mise en situation, ressources | Fiche en 3 temps : partir de l'existant, voir ce qui change, pratiquer |
| « À quoi ça sert dans un vrai projet ? » | **Projet fil rouge** : 9 phases, 11 rôles, 51 activités, livrables, jalons, risques | Absent |
| « Avec quels outils ? » | **Landscape** : 68 outils open source, filtrables par rôle, reliés aux compétences | Les fiches citent leurs outils, mais il n'y a pas de vue d'ensemble |
| « Est-ce que je sais le faire ? » | Paliers 1 à 5 par compétence, avec le palier visé selon le métier ; « acquis (testé) » après un rappel réussi | Case « acquis » et une épreuve par fiche |
| « Est-ce fiable ? » | Ressources gratuites d'abord, liens vérifiés | Sources sur chaque affirmation, « avis d'auteur » étiqueté, page de transparence |

**Lecture.** Le fil rouge et le landscape ne sont pas des « en plus » : ce sont les deux seules réponses à « à quoi ça sert ». Sans eux, Transformation enseigne des compétences hors-sol.

## 3. Faits mesurés

- **Un seul référentiel.** Les 131 compétences de Transformation reprennent exactement les identifiants de l'ancien site, qui en compte 178. Les 47 autres sont surtout l'IA et Sylva.
- **Le landscape se branche presque tel quel.** Les 68 outils renvoient à 81 compétences, dont 64 existent dans Transformation.
- **Le fil rouge aussi.** Ses 51 activités citent 122 compétences, dont 105 existent dans Transformation. Les 17 qui manquent sont toutes du rôle « Ingénieur IA ».
- **Les 10 étapes contre 9 phases s'expliquent.** L'animation de l'ancien site regroupe Design et Dimensionnement, puis Tests et Recette, puis Production et Exploitation. Elle découpe aussi la Construction en 5 étapes (machines, réseau, cluster, plateforme telco, durcissement). Rien n'est faux, mais rien ne le dit au lecteur.
- **Le compteur de l'ancien site varie.** L'accueil annonce 163 compétences puis 178, et la fiche AMF reprend 163. 163 semble être le total sans Sylva : à vérifier, puis afficher un seul nombre.
- **Correction de mon message précédent.** Transformation demande déjà « Que voulez-vous pouvoir faire ? », avec 4 réponses : exploiter, concevoir, intégrer, acheter. L'ancien site a déjà des statuts de preuve : les paliers 1 à 5 et « acquis (testé) ». L'audit collé proposait de les inventer ; il suffit de les reprendre.

## 4. Le parcours d'un lecteur, étape par étape

Le lecteur suivi ici : un ingénieur cœur réseau qui part de VMware et vise OpenShift.

### Accueil de Transformation : bon
La promesse est claire et l'exemple de la NetworkPolicy est concret. **Il manque** une porte vers « le projet » et « les outils » : le lecteur ne voit pas où tout cela s'applique.

### Questionnaire : trop long pour ce qu'il produit
- **7 questions**, alors que 4 suffisent à décider : métier, niveau Kubernetes, objectif, plateforme. Le départ (VMware…), le cœur 5G et la sécurité peuvent devenir des réglages facultatifs à la fin.
- **Seulement 4 métiers** (infra, cœur, SI, avant-vente). Il manque supervision et exploitation (NOC), intégration et tests, administration système, gestion de projet. L'ancien site en a 10 : en garder 6, chacun formulé comme une activité.

### Résultat et cockpit : trop d'informations, un « pourquoi » qui n'explique rien
- **80 étapes sur 131** sont affichées d'un coup. Personne ne lit 80 lignes.
- **Le « Pourquoi » est le même sur chaque étape** : « Kubernetes et OpenShift : métier du cœur réseau, départ VMware, plateforme OpenShift ». Il additionne les réponses sans expliquer l'étape. C'est le défaut le plus visible.
- **Trois compteurs** se côtoient : étapes maîtrisées, fiches acquises, fiches lues.
- **Le choix de l'objectif** se fait dans une liste de 80 lignes.

### Fiche de Transformation : le point fort, à garder
Les trois temps, le schéma avant/après, le réflexe à lâcher et l'épreuve sont la vraie valeur du site. **Il manque deux éléments présents dans l'ancien site** :
- « Ce que vous saurez faire », en 3 verbes ;
- « Où ça sert dans le projet » : la phase et le rôle du fil rouge, et les outils du landscape.

### Ancien site : riche, mais tout est montré à la fois
- **Trop de vues.**
  - Une roadmap s'affiche en Arbre, Métro, Objectif ou Liste.
  - La carte du projet s'affiche en Graphe, Couloirs, Flux ou Matrice.
  - L'accueil aligne l'assistant, le schéma des 6 métiers, la carte des prérequis, la recherche, le programme, le landscape, le fil rouge, la progression et Sylva.
- **Une précision qui promet trop.** Le rythme « 2 par semaine, arrivée le 30 avril 2027 » donne une précision qui n'existe pas.
- **Des restes d'une autre vocation** : l'IA, Sylva, les offres, le diagnostic.

## 5. La cible : un site, trois objets, une question par page

**Les trois objets**

| Objet | Question à laquelle il répond | D'où il vient |
|---|---|---|
| **La fiche** | « Comment j'apprends ça, en venant du télécom ? » | Transformation, plus « ce que vous saurez faire » et « où ça sert » repris de l'ancien site |
| **Le projet** | « À quoi ça sert, qui le fait, quand ? » | Le fil rouge de l'ancien site, sans le rôle IA |
| **Les outils** | « Avec quoi ? » | Le landscape de l'ancien site, sans la section IA |

**Les deux portes**
- **« Mon parcours »** : 4 questions, puis une première étape et les 5 suivantes, le reste replié par phase du projet.
- **« Explorer »** : les compétences, le projet, les outils.

**Le fil qui relie tout : le rôle dans le projet.**
- Le métier choisi au questionnaire devient un rôle du fil rouge.
- Ce rôle filtre le landscape (comme sur l'ancien site) et range la feuille de route par phase.
- Le « pourquoi » d'une étape devient enfin précis. Par exemple : « Phase 4, Construction de la plateforme : vous configurerez les réseaux secondaires avec l'ingénieur réseau. »

C'est le geste simple qui rend tout le reste lisible. Il coûte peu, puisque les identifiants sont déjà communs.

## 6. Ce qu'on enlève (le plus difficile)

| On enlève | Pourquoi | Ce qui reste à la place |
|---|---|---|
| Vues Métro, Arbre, Flux, Graphe à développer | Quatre façons de voir la même chose | Une liste par phase, et une matrice rôles × phases |
| Rythme et date d'arrivée | Fausse précision | « Prochaine étape » et « ce qu'il reste dans cette phase » |
| Trois compteurs dans le cockpit | Le lecteur ne sait pas lequel compte | Un seul compteur : les étapes au palier visé |
| 3 questions du questionnaire (départ, cœur 5G, sécurité) | Elles affinent sans décider | Des réglages facultatifs, après le résultat |
| Rôle IA, Sylva comme parcours, offres, diagnostic | Hors du sujet de Transformation | Sylva devient une fiche, comme les autres distributions |

## 7. Ordre de réalisation

Chaque étape se livre seule et améliore le site visible.

1. **Corriger le « pourquoi »** : une raison propre à chaque étape. C'est la correction la plus courte, et celle qui se voit le plus.
2. **Importer le projet fil rouge** : 9 phases, 10 rôles hors IA, livrables, jalons, risques, avec une page « Le projet » et la matrice rôles × phases. On dit que les 10 étapes de l'animation regroupent les 9 phases.
3. **Importer le landscape** : 68 outils moins les 11 d'IA, filtrés par rôle. Chaque outil renvoie aux fiches qui le citent.
4. **Relier la fiche au projet** : ajouter « Où ça sert » (phase, rôle, outils) et « Ce que vous saurez faire ».
5. **Refaire le questionnaire** : 6 métiers formulés en activités, 4 questions, et un métier qui devient un rôle du projet.
6. **Ranger la feuille de route par phase** : la première étape et les 5 suivantes, le reste replié.
7. **Reprendre les paliers** à la place de la case « acquis » : repéré, compris, exercé, démontré.
8. **Ensuite, et seulement ensuite**, le scénario « transformer l'existant » : faire évoluer une fonction réseau sans couper le service, du passage NFV → CNF au retour arrière. Il s'ajoute au projet comme second fil rouge.

Les étapes 1 à 4 ne demandent aucun contenu neuf, seulement de la reprise et du rangement. Les étapes 5 à 7 touchent au parcours et méritent un prototype avant d'être appliquées.

## 8. Ce que cet audit rouvre (à trancher par vous)

`BACKLOG.md` §2 fixe des principes qu'on ne rouvre pas sans vous. Trois recommandations ci-dessus les touchent.

| Principe en vigueur | Ce que l'audit propose | Mon avis |
|---|---|---|
| Hors périmètre : « projet fil rouge et ses 9 phases » | L'importer comme troisième objet | Vous l'avez jugé utile en le revoyant. Le garder **sans** la carte interactive ni ses 4 vues : une page, une matrice. |
| Pas de graphe, pas de carte interactive, pas de filtres multiples | Une matrice rôles × phases ; des outils filtrés par **un** rôle | C'est compatible si l'on ne choisit qu'un rôle à la fois. |
| Hors périmètre : « rôles cibles comme porte d'entrée » | Le métier de départ correspond à un rôle du projet | Le rôle n'est pas une porte d'entrée. Il sert à expliquer le « pourquoi », pas à choisir son chemin. |
| Mot interdit à l'écran : « landscape », « palier » | Une page d'outils et 4 niveaux de preuve | À l'écran, on dit « Les outils » et « repéré, compris, exercé, démontré ». |

Le landscape, lui, est déjà prévu (§13 « À faire » : « landscape des outils »). Il ne rouvre rien.

## 9. Décisions qui vous reviennent

1. **Un seul site, sous quel nom et à quelle adresse ?** Par exemple : telcoskills.com accueille Transformation, et l'ancien site redirige page par page.
2. **L'IA reste-t-elle dans le périmètre ?** Si oui, le rôle IA et les 11 outils reviennent avec le fil rouge. Sinon, ils sortent proprement.
3. **Faut-il valider le fil rouge ?** Il est marqué « à valider par un chef de projet » : le faire relire en même temps que les fiches.
