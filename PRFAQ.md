# TelcoSkills · Transformation — PR/FAQ (méthode Amazon « Working Backwards »)

> Rédigé le 2026-11-08, **avant** la validation de `BACKLOG.md`. On écrit d'abord ce qu'on veut pouvoir annoncer à la
> fin. Le backlog doit livrer exactement ça, ni plus ni moins. Si une story ne sert aucune phrase de ce document, elle sort.
> Les citations sont des **citations cibles** : elles sont fictives et disent ce qu'on veut entendre. Le test utilisateur
> les confirme ou les dément.

---

## 1. Les cinq questions préalables

| Question | Réponse |
|---|---|
| **Qui est le client ?** | Un ingénieur ou un architecte télécom de 45 à 55 ans, avec 15 à 30 ans de métier (cœur réseau, infra et virtualisation, architecture SI, avant-vente). Son entreprise passe au cloud natif (CaaS, CNF 5GC, GitOps). Il n'a pas choisi ce changement. |
| **Quel est son problème ?** | Tout ce qu'on lui propose part de zéro (« Kubernetes pour débutants », des roadmaps de 500 h). Il en conclut que son expérience ne vaut plus rien, ou que la marche est trop haute. Ni l'un ni l'autre n'est vrai, mais personne ne lui montre ce qui, dans son métier, reste vrai, change de forme ou devient faux. |
| **Quel est le bénéfice principal ?** | En dix minutes, il voit que la plus grande partie de son métier tient toujours, et il sait exactement quelles quelques choses changent. En une à deux heures de lecture, réparties comme il veut, il a transposé son métier. |
| **Comment sait-on ce qu'il veut ?** | Hypothèse, pas encore preuve. Indices : le retour « parcours trop complexe » sur la V2 ; les 4 passerelles écrites à partir de CV et d'offres publics ; le contexte sourcé (âge moyen de 45 à 50 ans chez un grand opérateur, montée en compétences interne devant le recrutement en 2026, moins de 4 % de postes cloud natif juniors). **Aucun utilisateur réel n'a encore été interrogé** : c'est la première chose à faire. |
| **À quoi ressemble l'expérience ?** | Il choisit son métier, décoche ce qu'il ne fait pas, voit son bilan, lit une fiche « Votre X, version Y » et répond à deux questions. Il imprime son plan pour son entretien annuel. |

---

## 2. Le communiqué de presse

**TelcoSkills lance « Transformation » : les métiers du télécom passent au cloud natif sans repartir de zéro**

*Un site gratuit, ouvert aux contributions et sans inscription, qui montre à un professionnel du télécom ce qui reste valable dans son métier, ce
qui change de forme et les quelques vraies nouveautés du cloud natif.*

**Paris, [date de lancement à fixer]** — Les opérateurs télécom migrent leurs cœurs de réseau vers des plateformes
cloud natives. Les équipes qui les opèrent ont souvent vingt ans de métier. Pourtant, les formations qu'on leur
propose commencent toutes au même endroit : le début. TelcoSkills Transformation part de l'autre bout. Le
professionnel indique son métier d'aujourd'hui (architecte infra et virtualisation, ingénieur cœur réseau, architecte
SI, avant-vente technique) et obtient en quelques minutes son bilan de transformation.

Le bilan classe chaque savoir-faire du métier en quatre catégories : ce qui reste valable tel quel, ce qui change de
forme, ce qui est vraiment nouveau, et les réflexes à lâcher. Un architecte infra découvre ainsi que la plupart de
ses savoir-faire lui servent dès demain, que sa matrice de flux devient une NetworkPolicy, ses VLAN des réseaux de
cluster, son actif/passif des réplicas, et qu'il lui reste trois notions vraiment nouvelles à apprendre.

Chaque transformation tient sur une fiche courte, lisible en moins de dix minutes : à gauche ce que la personne
connaît, à droite ce que ça devient, puis ce qui reste vrai, ce qui change, le piège classique et un exemple tiré d'un
vrai cœur 5G. Deux questions permettent de vérifier qu'on a compris. Chaque affirmation technique est sourcée.

« On ne demande pas à un ingénieur cœur réseau de réapprendre ce qu'est une session PDU. On lui montre que ses
interfaces S1AP et GTP existent toujours, sous une autre forme », explique Taoufik Bouazza, auteur du site.
« La transformation, ce n'est pas tout recommencer. C'est savoir précisément ce qui change. » *(citation à réécrire
par l'auteur)*

Le plan obtenu s'imprime sur une page : la personne peut l'apporter à un entretien avec son manager. Rien n'est
stocké ailleurs que dans son navigateur : pas de compte, pas de cookie publicitaire.

« J'ai coché onze cases sur quatorze. Pour la première fois, on me disait ce que je savais déjà au lieu de ce qui me
manquait. J'ai lu les neuf fiches en deux soirées », raconte un architecte infrastructure de 52 ans. *(citation cible,
fictive : c'est la réaction que le test doit obtenir)*

TelcoSkills Transformation est disponible gratuitement à l'adresse [adresse à fixer]. Le contenu est sous licence
CC BY-SA 4.0. C'est un projet participatif : chacun peut signaler une erreur ou proposer une fiche depuis n'importe
quelle page, et chaque correction est visible dans l'historique de la fiche.

---

## 3. FAQ externe (ce que demanderait un visiteur)

**C'est payant ? Il faut un compte ?**
Non et non. Votre bilan reste dans votre navigateur. Un lien vous permet de le retrouver sur un autre appareil.

**Mon métier n'est pas dans la liste.**
Quatre métiers au lancement, ceux pour lesquels le contenu est écrit et relu. Les suivants (exploitation et
supervision en premier) arrivent ensuite. Vous pouvez lire n'importe quelle fiche sans choisir de métier.

**Je fais deux métiers à la fois (infra et un peu de cœur réseau).**
Choisissez le principal. Les fiches de l'autre métier restent lisibles une par une.

**Pourquoi seulement deux questions par fiche ? Ce n'est pas une certification.**
Exact. Les questions vérifient que vous avez saisi la transformation, pas que vous savez la mettre en œuvre. Chaque
fiche renvoie vers les ressources (libres d'abord) pour aller plus loin, et vers les certifications existantes quand
elles s'appliquent.

**Qui a écrit ça ? Pourquoi vous croire ?**
Un auteur identifié, des sources sur chaque affirmation, une page « Sources et méthode » qui dit d'où viennent les
métiers (des archétypes construits à partir de CV et d'offres publics, pas une étude statistique) et ce que le site ne
sait pas. Une fiche qui n'a pas encore été relue porte la mention « en relecture ». Le site ne prétend pas être
infaillible : c'est un projet ouvert. Si vous connaissez le sujet mieux que la fiche, corrigez-la (un clic ouvre la
proposition sur GitHub) ; votre nom apparaît dans l'historique.

**Vous vendez quelque chose ?**
Non. Pas de formation payante, pas d'offre, pas de prospection. C'est un projet personnel et ouvert, qui montre aussi
une façon de travailler.

**Et après mon plan ?**
Vous avez transposé votre métier. La suite (viser un rôle précis, approfondir une techno) passe par les liens « pour
aller plus loin » de chaque fiche. *(Point faible assumé du lancement : voir Q-A ci-dessous.)*

**Je suis manager, je peux l'utiliser pour mon équipe ?**
Chaque personne fait son bilan et peut l'imprimer. Une vue d'équipe est prévue plus tard.

---

## 4. FAQ interne (ce que demanderait un comité)

**Pourquoi faire ce site ?**
Deux raisons, dans cet ordre : rendre service aux professionnels du télécom en transformation, et servir de **vitrine**
à l'auteur (à citer dans un CV ou sur LinkedIn). Rien n'est vendu. La vitrine se juge sur trois choses qu'un recruteur
ou un pair voit en cinq minutes : la clarté du concept, la qualité du design, et le sérieux de la méthode (sources,
historique, corrections acceptées). Un site qui corrige vite et publiquement ses erreurs est une meilleure vitrine qu'un
site qui prétend n'en avoir aucune.

**Comment saura-t-on que ça marche ?** Critères de succès, à mesurer (mesure d'audience avec consentement) :

| Indicateur | Définition | Seuil visé au lancement |
|---|---|---|
| Entrée | visiteurs qui choisissent un métier / visiteurs de l'accueil | ≥ 40 % |
| Bilan | visiteurs qui ouvrent « Voir mon plan » / ceux qui ont choisi un métier | ≥ 60 % |
| Première fiche | bilans avec au moins une fiche vérifiée | ≥ 30 % |
| Transformation | bilans avec toutes les fiches lues | ≥ 10 % |
| Retour | bilans avec une activité à au moins deux jours différents | ≥ 20 % |

Ces seuils sont des hypothèses de départ, pas des références sectorielles : on les révise après quatre semaines de
données. Avant le lancement, **critère qualitatif** : sur 3 à 5 vraies personnes (au moins deux métiers différents),
au moins 4 sur 5 trouvent leur métier, comprennent leur bilan sans aide et disent spontanément quelque chose de proche
de « je ne pars pas de zéro ».

**Qu'est-ce qui doit être vrai le jour du lancement ?**
1. La fiche étalon est relue par l'auteur ; les autres peuvent sortir « en relecture », c'est assumé. Le bouton
   « Corriger cette fiche » et la page « Contribuer » fonctionnent.
2. Le test sur 3 à 5 personnes est passé et ses seuils atteints.
3. La mesure fonctionne (sinon on ne sait pas si les seuils ci-dessus sont atteints).
4. Les 4 écrans passent la barre de qualité design (`BACKLOG.md` §8).

**Quel est le plus gros risque ?**
- **La flatterie.** « 11 sur 14, vous savez déjà tout » peut sonner comme du marketing. Parade : les réflexes à lâcher
  sont affichés au même niveau que l'acquis, et chaque transposition dit franchement ce qui devient faux.
- **Le contenu.** 21 fiches sourcées et relues, c'est le vrai coût du projet. L'interface est petite ; le contenu ne
  l'est pas. Le planning dépend du temps de relecture de l'auteur, pas de Sonnet.
- **Les erreurs techniques** ne sont pas un risque à éviter, ce sont des contributions à recevoir. Le site est gratuit,
  participatif et ne vend rien : une erreur signalée puis corrigée en quelques jours, avec l'historique visible,
  renforce la crédibilité. Le vrai risque, c'est l'inverse : une erreur signalée qui reste sans réponse. Parade : le
  signalement dès le lancement, un délai de réponse que l'auteur se fixe, et l'historique affiché sur chaque fiche.

**Pourquoi pas reprendre l'ancien site ?**
Il additionnait des objets (11 parcours, 11 rôles, 4 passerelles, 6 portes d'entrée) et partait des fondamentaux. Le
retour utilisateur était « trop complexe ». On garde ce qui marche (système visuel, contenu sourcé, questions) et on
retire le reste.

**Qu'est-ce qu'on ne fait volontairement pas ?**
Roadmaps, heures cumulées, comptes, vue d'équipe, IA, anglais, rôles cibles. Liste complète : `BACKLOG.md` §2.

**Combien ça coûte ?**
Hébergement : plan Vercel gratuit, site non commercial. Développement : 9 lots Sonnet. Coût réel : le temps de
l'auteur pour relire 4 métiers et 21 fiches, et organiser le test.

---

## 5. Ce que ce document change dans le backlog

Comparé au `BACKLOG.md` du 2026-11-08, le PR/FAQ fait apparaître six écarts. **Tous intégrés au backlog le
2026-11-08** (D1 → E10-5, D2 → E13, D3 → E10-6, E10-7 et le champ `historique`, D4 → E8-3, D5 → E5-2, D6 → E10-8 ;
lots et conditions de lancement au §9).

| # | Écart | Proposition |
|---|---|---|
| D1 | La mesure (E10-5) est en V1 ; sans elle on ne sait pas si les critères de succès sont atteints. | Passer E10-5 en **MVP**, lot 7, avec les 5 événements du tableau §4. |
| D2 | Le test sur 3 à 5 vraies personnes n'existe pas comme story (il n'a jamais eu lieu sur l'ancien site non plus). | Ajouter **E13 · Test utilisateur** : protocole (5 consignes, notes, seuils du §4), passé par l'auteur sur la préproduction après le lot 5, point d'arrêt bloquant avant le lot 7. |
| D3 | Le site est participatif, mais la contribution est en V1 (E10-6) et rien n'affiche l'historique d'une fiche. | Passer E10-6 en **MVP**, renommé « Corriger cette fiche » (lien vers une issue ou une modification GitHub préremplie) ; ajouter une page **Contribuer** (comment corriger ou proposer une fiche, gabarit JSON, règles de sources) et un champ `historique` par fiche (date, changement, contributeur), affiché en bas de fiche. |
| D6 | La vitrine n'a pas de story : rien ne présente la démarche à un recruteur ou un pair. | Ajouter une page **À propos** soignée (S) : pourquoi ce site, la méthode, l'auteur (LinkedIn), le code ouvert, les contributeurs. |
| D4 | « Et après mon plan ? » n'a pas de réponse à l'écran. | Ajouter **E8-3 · Fin de plan** (S) : écran de fin quand toutes les fiches sont lues (ce que vous avez transformé, les 3 meilleurs liens pour aller plus loin, les certifications liées si `referentiels.json` les couvre). Pas de rôles cibles. |
| D5 | Le risque de flatterie n'est pas traité dans l'écran Bilan. | Dans E5-2 : la tuile « réflexes à lâcher » a le même poids visuel que les autres, et la phrase clé est suivie de « et N réflexes à lâcher ». |

Le reste du backlog est cohérent avec le communiqué : aucune story à retirer.
