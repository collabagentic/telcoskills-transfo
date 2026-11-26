# Audit avant ouverture : 26 novembre 2026

Site audité : la production `telcoskills-transfo.vercel.app`, identique à `main` (commit `426ea10`).
Contenu audité : 21 fiches, 131 compétences, 10 domaines, 7 questions, 351 liens externes.
Parcours joué de bout en bout : un ingénieur cœur réseau, qui a lu sur Kubernetes sans pratiquer, part de VMware, connaît bien la 5G et vise OpenShift.

## Fait dans la nuit du 26 novembre, à la demande de l'auteur

- **Relecture.** La mention « en relecture » n'est plus affichée nulle part. Chaque fiche se termine par un lien discret « Relire cette fiche » : un ticket pré-rempli, étiqueté « relecture », pour l'auteur et les experts. Les textes du pied de page, de « À propos », de « Sources et méthode » et des mentions légales disent que les fiches sont relues au fil de l'eau.
- **Fiches nouvelles (4)**, sourcées sur la documentation Kubernetes, avec des liens vérifiés (13 sur 13 répondent) :
  - LUN et datastore → PV, PVC et StorageClass (« Stockage Kubernetes », 2e priorité du profil cœur réseau) ;
  - mise en maintenance d'un serveur → cordon et drain ;
  - syslog centralisé → journaux de conteneurs ;
  - durcissement des serveurs → Pod Security Standards.
  Elles passent le site de 21 à 25 fiches.
- **Base d'ouverture :**
  - `robots.txt` et plan du site (164 adresses), générés au build ;
  - page 404 en français ;
  - icône ;
  - image de partage du site ;
  - adresse de base des métadonnées ;
  - nouvelle description de l'accueil.
- **Textes :**
  - titres au pluriel corrigés (« Vos interfaces… », « Vos compteurs… »), avec un test ;
  - phrase de l'accueil corrigée (« mais ce que vous avez appris reste utile »).
- **Liens :** le lien mort (annonce CNCF 2018) et 7 liens déplacés (ANSSI, PagerDuty, SecNumCloud, OpenCost, CHAOSS) sont remplacés par leur nouvelle adresse.
- **Pas fait : la contribution par bouton** (un ticket créé automatiquement, sans que la personne voie GitHub).
  - Le site est un export statique, sans serveur. Il faut soit quitter l'export statique, soit ajouter une fonction serveur à part.
  - Il faut aussi un jeton GitHub limité à la création de tickets sur ce seul dépôt, que l'auteur saisit lui-même dans Vercel.
  - Enfin, il faut une protection contre le spam : limite par adresse et champ piège.
  - À décider ensemble avant de coder.
- **Pas fait : le déploiement automatique.** La production reste déployée à la main.
  - Relier Vercel au dépôt public demande une action de l'auteur dans Vercel (accès de Vercel à l'organisation GitHub).
  - Le plan Hobby bloque les commits signés par le compte bot des agents.

## Verdict

**Le site n'est pas prêt pour une ouverture publique.**

- **Ce qui est solide :**
  - le fond technique des fiches ;
  - la cohérence des données ;
  - les liens internes ;
  - la confidentialité.
- **Quatre points bloquent l'ouverture :**
  - aucune fiche n'a été relue par l'auteur ;
  - plus de la moitié du parcours ne mène à aucune fiche ;
  - signaler une erreur ou contacter l'auteur demande un compte GitHub ;
  - la base technique d'une ouverture (indexation, page 404, icône, image de partage) n'est pas en place.

## Ce qui va bien

- **Exactitude technique.** J'ai vérifié une vingtaine d'affirmations, toutes justes :
  - RBAC purement additif ;
  - quorum etcd de 5 membres ;
  - readiness et liveness ;
  - « selfHeal » d'Argo CD désactivé par défaut ;
  - 99,9 % sur 30 jours, soit 43,2 min ;
  - port 38412 en SCTP pour NGAP ;
  - API Ingress figée au profit de Gateway API ;
  - évaluation des règles Prometheus toutes les minutes par défaut ;
  - request copiée depuis la limit quand elle manque.
- **Transparence.** Chaque fiche a ses sources, une épreuve sourcée et des passages « avis d'auteur » signalés. Rien n'est présenté comme relu alors qu'il ne l'est pas : la pastille « en relecture » est partout.
- **Données saines.** Aucune référence cassée, aucun identifiant en double et aucun cycle de prérequis. Les 7 questions ne citent que des compétences et des domaines qui existent. Chaque compétence a au moins une ressource et un résumé.
- **Liens internes.** Le vérificateur de sortie donne 0 erreur sur 164 pages et 2 240 liens internes.
- **Liens externes.** Sur 351 liens, 320 répondent normalement et un seul est mort (détail plus bas).
- **Confidentialité tenue.** Aucune requête vers un tiers : les polices sont servies par le site, il n'y a ni cookie ni mesure d'audience. La page « Confidentialité » dit vrai et le bouton « Effacer mes données » fonctionne.
- **Parcours principal.** Accueil, questionnaire (7 questions, retour arrière), restitution en trois priorités, cockpit, fiche : tout s'enchaîne sans erreur.
- **Mobile.** Pas de défilement horizontal à 375 px sur l'accueil et la fiche. Le menu de la fiche est replié derrière un bouton.

## Bloquants (à régler avant d'ouvrir)

### 1. Aucune fiche relue par l'auteur

- 21 fiches sur 21 et 131 compétences sur 131 sont en « brouillon ».
- Les passages « avis d'auteur » sont nombreux :
  - 9 champs dans « patch des serveurs » ;
  - 8 dans « procédure de changement » et « dossier d'architecture » ;
  - 7 dans « appel d'offres », « chiffrage », « CMDB », « dimensionnement » et « matrice de flux ».
- Sur certaines fiches, le résumé, le schéma, le réflexe et l'exemple sont tous des avis d'auteur.
- **À faire (auteur) :**
  - relire au minimum les fiches les plus exposées : celle de l'accueil (matrice de flux), puis celles des trois premières étapes des parcours types ;
  - transformer en affirmations sourcées les avis qui peuvent l'être ;
  - créer le statut « relu par l'auteur » et ne l'afficher que pour les fiches relues.

### 2. Plus de la moitié du parcours ne mène à aucune fiche

- **Couverture globale.** Seules 45 compétences sur 131 ont une fiche.
- **Domaines vides ou presque.**
  - Le domaine « Stockage et virtualisation » n'en a aucune, alors que « Stockage Kubernetes » arrive en deuxième priorité pour l'ingénieur cœur réseau.
  - « Cœur 5G » n'a qu'une fiche pour 22 compétences.
  - « Sécurité et conformité » en a 2 pour 20.
- **Le parcours testé.** Sur 80 étapes, 32 mènent à une fiche. Les 48 autres mènent à une page de compétence : un résumé, un schéma de base et une liste de ressources, avec la mention « Pas encore de fiche de transformation ».
- **Pourquoi c'est bloquant.** La promesse de l'accueil (« ce qui reste, ce qui change ») ne tient que sur 40 % du chemin.
- **Choisir l'une de ces trois voies :**
  - écrire d'abord les fiches des étapes les plus fréquentes dans les parcours types (dont « Stockage Kubernetes ») ;
  - ou dire clairement, dans le cockpit et dans le menu, quelles étapes ont une fiche et lesquelles ne sont qu'un point de départ ;
  - ou les deux.

### 3. Contribuer ou contacter l'auteur demande un compte GitHub

- « Signaler une erreur », « Proposer une correction » et le contact des mentions légales passent tous par GitHub.
- Le public visé, des professionnels du télécom, n'en a souvent pas. C'est la décision « contribuer sans GitHub » restée ouverte depuis l'audit du 21 novembre.
- **Choisir l'une de ces deux voies :**
  - un message pré-rempli vers une adresse de contact publique (sans serveur, compatible avec le site statique) ;
  - un formulaire qui crée un ticket (demande une fonction serveur et un jeton saisi par l'auteur).
- **Mentions légales.** Ajouter au minimum une adresse de contact joignable sans compte.

### 4. La base technique d'une ouverture manque

| Élément | État en production | À faire |
|---|---|---|
| Indexation | `noindex, nofollow` sur toutes les pages (voulu jusqu'ici) | Retirer le jour de l'ouverture, pas avant |
| `robots.txt`, `sitemap.xml` | 404 | Les générer au build |
| Page 404 | Celle par défaut de Next.js, en anglais (« This page could not be found. ») | Page 404 en français, avec des liens vers l'accueil, la feuille de route et les compétences |
| Icône du site | Absente (404) | Ajouter une icône |
| Image de partage, URL canonique | Absentes sur toutes les pages | Une image par fiche, plus une image générale ; URL canonique |
| Description de l'accueil | « Le telco cloud : par où commencer ? » : ancienne accroche, ne correspond plus au titre « Vous connaissez déjà le télécom » | La réécrire |
| Déploiement | Production déployée à la main depuis le poste ; le projet Vercel est relié au dépôt privé | Relier Vercel au dépôt public `collabagentic/telcoskills-transfo` (déploiement à chaque fusion), ou garder le déploiement manuel en le disant |
| Branche `main` | Non protégée | Exiger la CI verte avant fusion |
| Domaine | `*.vercel.app` | Choisir un domaine si vous en voulez un |

## Important (à régler juste après, ou avant si possible)

### Deux styles cohabitent

- **Fiche et cockpit, nouveau style :** fond uni, pas d'ombres, titres en casse normale.
- **Toutes les autres pages, ancien style :** accueil, questionnaire, liste des compétences, pages de compétence, à propos, pages légales. Elles gardent le halo orange, la grille de fond, les cartes arrondies avec ombre et les étiquettes en capitales.
- **Effet visible :** depuis le menu d'une fiche, deux étapes sur trois ouvrent une page de compétence dans l'ancien style, sans le menu. Le visiteur change de site visuellement et perd sa navigation.
- **À faire :** appliquer les mêmes règles à la page de compétence (en priorité, avec le menu à gauche), puis au questionnaire, à l'accueil et aux autres pages.

### Le menu de la fiche ne suit pas le parcours de la personne

- **Ce que montre le menu :** toutes les compétences du domaine, dans l'ordre du catalogue, y compris celles déjà acquises ou hors du parcours. Exemple : « Sécurité et conformité · étape 2 sur 20 ».
- **Ce que montre le cockpit :** le parcours personnel, par niveau. Exemple : 15 étapes de sécurité pour le profil testé. Les deux comptes ne correspondent pas.
- **Libellés différents.** L'entrée du menu porte le nom de la compétence (« Architecture Kubernetes »), mais la page ouverte porte le titre de la fiche (« L'état désiré et la boucle de réconciliation »).
- **À faire :**
  - quand la personne a répondu, le menu montre ses étapes, dans l'ordre de son parcours, avec leur état ;
  - sans réponses, il garde le catalogue du domaine ;
  - à côté de chaque étape qui a une fiche, afficher le titre de la fiche.

### Le « pourquoi » se répète dans le cockpit

- Chaque étape d'un domaine affiche la même raison, par exemple « Kubernetes et OpenShift : métier du cœur réseau, départ VMware, plateforme OpenShift ».
- La correction déjà faite pour la restitution de l'assistant (une seconde ligne propre à chaque compétence) n'a pas été reportée dans le cockpit.

### Erreurs visibles dans le texte

- **Titres de fiche fautifs :**
  - « Votre interfaces dédiées entre nœuds, version interfaces SBI. » ;
  - « Votre compteurs et alarmes, version métriques et alertes sur symptômes. ».
- **Cause :** le titre est construit par « Votre » suivi du champ `avant`. Corriger avec « Vos » pour un pluriel, ou ajouter un champ de titre explicite.
- **Phrase fautive de l'accueil :** « mais pas tout ce que vous avez appris ne devient inutile ». Proposition : « mais ce que vous avez appris reste utile ».
- **Chiffre à vérifier (fiche « appel d'offres ») :** 42,86 % est attribué à l'interopérabilité dans « Ce qui change », et aux API/CRD incompatibles dans l'épreuve. Les deux lignes citent la même enquête CNCF 2022 avec le même pourcentage : à vérifier dans la source.

### Le questionnaire ne couvre que quatre métiers

- **Métiers proposés :** architecte infra et virtualisation, ingénieur cœur réseau, architecte SI, avant-vente technique.
- **Métiers absents :** radio et RAN, transport et IP, exploitation et supervision (NOC), sécurité des réseaux.
- **Pourquoi c'est important :** une partie des professionnels visés devra choisir un métier qui n'est pas le sien. Ajouter au moins « Exploitation et supervision » et « Réseau IP et transport », ou une option « Autre » qui ne présuppose rien.

### Liens externes à corriger

- **Mort.** L'annonce CNCF de 2018 sur Kubernetes, premier projet diplômé, renvoie 404. Elle est utilisée dans la chronologie de la compétence « Architecture Kubernetes ».
- **Déplacés, à mettre à jour :**
  - ANSSI : 3 liens, passés sur `messervices.cyber.gouv.fr` ;
  - PagerDuty : 2 liens, passés sur `docs.pagerduty.com` ;
  - Green Software Foundation ;
  - CHAOSS ;
  - OpenCost ;
  - le PDF SecNumCloud, qui redirige vers une adresse temporaire signée : mettre la page de présentation.
- **Refusés aux robots, à ouvrir à la main :** 22 liens, presque tous vers la documentation Red Hat, plus Udemy, ACM Queue, Légifrance et ISO. Ils marchent probablement dans un navigateur.
- **Versions incohérentes.** Les compétences citent la documentation OpenShift 4.18, la fiche « VLAN » la 4.20. Choisir une version de référence et l'indiquer sur « Sources et méthode ».
- **Source vieillissante.** La fiche « PRA » cite une page AWS « historique » : citer la page en vigueur.

## Mineur

- **Genre de l'UPF.** « Une UPF » et « un UPF » coexistent, parfois dans la même fiche (« VLAN »). Choisir et harmoniser.
- **Préfixes d'exemple.** « Exemple illustratif », « Cas illustratif » et « Cas d'école » alternent selon les fiches. Harmoniser, ou laisser l'étiquette « avis d'auteur » faire ce travail.
- **Mentions de méthode dans les raisonnements.** Plusieurs raisonnements d'épreuve contiennent des phrases comme « que la documentation ne formule pas ainsi », « calcul simple, non fourni par la source » ou « lecture de l'auteur ». Elles sont honnêtes mais alourdissent la lecture : les remplacer par l'étiquette « avis d'auteur » en fin de phrase.
- **Double signal.** Dans « dossier d'architecture », « à mon avis » est écrit en clair alors que l'étiquette est déjà là.
- **Fiche « opérateurs ».** Elle décrit OLM dans sa forme classique (Subscription, InstallPlan). Préciser la version d'OpenShift visée, car OLM v1 change les objets.
- **Typographie.** Les deux-points et points-virgules sont précédés d'une espace normale : une coupure de ligne peut les isoler. Une espace insécable ajoutée au rendu suffit.
- **Questionnaire.** Chaque domaine affiche « 12 » puis « 12 compétences » : le chiffre est dit deux fois.
- **En-tête du site.** Il ne contient que « Mon cockpit ». « Compétences » et « Ma feuille de route » ne sont accessibles que par l'accueil ou le pied de page.
- **Page « Audit ».** Elle est publique et figure dans le pied de page. Décider si elle doit l'être à l'ouverture.
- **Fiche « plateforme produit ».** C'est la plus pauvre en ressources : 2 sources et 2 liens pour aller plus loin.

## Les 21 fiches une par une

| Fiche | Fond | Remarques |
|---|---|---|
| Accès root → RBAC | Juste | 5 passages en avis d'auteur |
| Actif/passif → réplicas et sondes | Juste | Mention de méthode dans l'épreuve |
| Appel d'offres → exigences CNF | Juste | Chiffre de 42,86 % à vérifier ; 7 avis |
| Appliance → CNF et Helm | Juste | « Cas d'école » ; 6 avis |
| Changement → pull request | Juste | 8 avis : la fiche est surtout un avis |
| Chiffrage → coût par SLO | Juste (calcul vérifié) | 7 avis |
| CMDB → Git et labels | Juste | 7 avis |
| Dimensionnement → requests, limits | Juste | « Un UPF » ; 7 avis |
| Dossier d'architecture → ADR | Juste | « À mon avis » en double de l'étiquette ; 8 avis |
| Interfaces dédiées → SBI | Juste, références 3GPP précises | **Titre fautif** |
| Load balancer → Service, MetalLB | Juste | 5 avis |
| Matrice de flux → NetworkPolicy | Juste | Fiche de l'accueil : à relire en premier |
| Traces distribuées | Juste | Mentions de méthode dans l'épreuve |
| Opérateurs | Juste pour OLM classique | Version d'OpenShift à préciser |
| Patch → images immuables | Juste | 9 avis, le plus élevé |
| Plateforme produit | Juste | La plus pauvre en sources et ressources |
| PRA → GitOps | Juste | Source AWS « historique » à remplacer |
| Réconciliation | Juste | Ouverte depuis l'étape « Architecture Kubernetes » (titre différent) |
| Compteurs → Prometheus | Juste | **Titre fautif** |
| VLAN → réseaux du cluster | Juste | « Une UPF » et « un UPF » ; Red Hat 4.20 contre 4.18 ailleurs |
| VM → pod | Juste | — |

## Ce qui n'a pas été vérifié

- **Mesures non faites :**
  - performance et Lighthouse ;
  - lecteur d'écran et navigation complète au clavier ;
  - largeurs 360 et 430 px ;
  - Safari sur iPhone.
- **Rendu mobile.** Vérifié seulement à 375 px, sur l'accueil et la fiche.
- **Contenu des 131 pages de compétence.** Vérifié par script (résumé, ressources, références), pas relu une à une.
- **Liens refusés aux robots.** Les 22 liens n'ont pas été ouverts à la main.
- **Conformité juridique.** Mentions légales et RGPD lus, mais ce n'est pas un avis juridique.

## Ordre proposé

1. **Auteur.** Relire les fiches les plus exposées, choisir comment contribuer sans GitHub, choisir le domaine et la date d'ouverture.
2. **Agents, correctifs rapides :**
   - les deux titres fautifs et la phrase de l'accueil ;
   - la description de l'accueil ;
   - la page 404 en français ;
   - l'icône ;
   - `robots.txt` et `sitemap.xml` ;
   - les liens morts et déplacés ;
   - le « pourquoi » propre à chaque étape dans le cockpit.
3. **Agents, parcours :**
   - le menu de la fiche suit le parcours de la personne ;
   - la page de compétence passe au nouveau style avec le menu ;
   - le cockpit et le menu indiquent quelles étapes ont une fiche.
4. **Agents, reste du site :** questionnaire, accueil, liste des compétences et pages secondaires passent au nouveau style.
5. **Auteur et agents, contenu :** écrire les fiches manquantes les plus fréquentes dans les parcours, en commençant par « Stockage Kubernetes ».
6. **Ouverture :** retirer le `noindex`, brancher l'image de partage, relier le déploiement au dépôt public et protéger `main`.
