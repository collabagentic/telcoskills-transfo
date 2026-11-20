# Relecture : patch-images

Résumé : 7 affirmations confirmées, 8 non sourcées, 5 douteuses (sur 20 contrôlées).
Aucun champ `avisAuteur` n'existe dans la fiche : tout passage d'opinion est aujourd'hui non étiqueté.
Points majeurs : (1) signature et vérification à l'admission sont dans le diagramme mais absentes de toutes les sources ouvertes ; (2) « le SBOM indique où se trouve la bibliothèque » n'est pas dit par la page CISA ; (3) « l'ancien état reste récupérable » et « ne corrige plus un conteneur » ne sont pas sourcés tels quels.

## Ce que j'ai pu lire

- kubernetes.io/docs/concepts/containers/images/ : lue (125 000 caractères ; 100 000 lus par WebFetch, reste vérifié par curl + recherche de mots : pas de « signature », pas de « SBOM »). Passages utiles lus.
- cisa.gov/sbom : redirige (301) vers cisa.gov/topics/information-communications-technology-supply-chain-security/sbom ; page de présentation lue en entier, résumés de ressources parfois coupés.
- slsa.dev : page d'accueil lue en entier (page d'orientation, sans exigences détaillées).
- Spécification OCI Distribution (github.com/opencontainers/distribution-spec/blob/main/spec.md) : ouverte et lue ; les extraits sur tags/digests ont été lus, le reste de la spécification n'a pas été lu en détail.

## Tableau

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Une image se référence par son digest, pas par un tag comme :latest qui peut changer | change.1 | CONFIRMÉE | K8s : les tags peuvent être déplacés vers d'autres images, les digests sont fixes ; on peut remplacer tag par `@digest`. | Aucune. |
| Le même tag peut désigner deux contenus différents ; le digest désigne un contenu précis | piege, epreuve.raisonnement | CONFIRMÉE | K8s + OCI : le digest est un hachage du contenu ; le tag est un pointeur lisible vers un manifeste. | Aucune. |
| « :latest » déconseillé en production | piege | CONFIRMÉE (nuance) | K8s déconseille `:latest` : suivi de la version et retour arrière plus difficiles ; recommande un tag explicite et/ou un digest. | Ajouter la raison de K8s (suivi et retour arrière) ; « deux comportements » est une conséquence raisonnable. |
| Déployer par digest garantit qu'on déploie exactement ce qui a été validé | epreuve.raisonnement | CONFIRMÉE | K8s : le Pod utilise toujours la même version, sans mélange ancien/nouveau si le registre change. | Dire « la même image » plutôt que « validé » (la validation est une pratique, pas une propriété du digest). |
| Un SBOM liste les composants d'une image | change.2 | CONFIRMÉE | CISA : inventaire imbriqué, liste des « ingrédients » d'un logiciel. | Remplacer « d'une image » par « d'un logiciel » (la page CISA ne parle pas d'images de conteneurs). |
| Un SBOM permet de savoir où se trouve une bibliothèque vulnérable / quelles images la contiennent | change.2, exemple, epreuve.raisonnement, noeud sbom | NON SOURCÉE | La page CISA n'énonce pas cet usage (seul VEX parle de vulnérabilités). | Source à trouver et ouvrir (page CISA sur l'usage des SBOM ou VEX) ; à défaut, étiqueter « avis d'auteur » : c'est l'usage logique d'un inventaire, pas un fait de la page. |
| Le correctif est un nouveau déploiement, pas une modification de l'existant | change.3 | NON SOURCÉE | Rien dans K8s/CISA/SLSA. | Étiqueter « avis d'auteur » (principe d'immuabilité), ou sourcer avec la doc K8s sur les Deployments (non ouverte). |
| On ne corrige plus un conteneur existant : on reconstruit, vérifie, redéploie | resume.apres | NON SOURCÉE | Idem. | « avis d'auteur ». |
| Étape « vérifie » / signature du registre | resume.apres, noeud reg, légende | DOUTEUSE | Ni K8s (rien sur la signature) ni SLSA (signature non mentionnée) ne la mentionnent. | Retirer « signer », « signature » du diagramme, ou sourcer avec une page ouverte sur la signature (aucune ouverte à ce jour). |
| Admission « vérifie la signature » | noeud adm | DOUTEUSE | K8s ne cite les contrôleurs d'admission que pour remplacer tags par digests, pas pour vérifier des signatures. | Reformuler « Admission : contrôle l'image (digest imposé) » ou retirer. Fait invérifiable en l'état. |
| Faille publiée -> interroge le SBOM (sens de la flèche) | liens | NON SOURCÉE | Sens logique correct (faille -> SBOM), mais usage non sourcé (voir ci-dessus). | Idem SBOM ; « avis d'auteur » acceptable. |
| SBOM -> cible -> Build CI -> publie -> Registre | liens | NON SOURCÉE | Enchaînement plausible, aucune source. | Étiqueter « avis d'auteur » (schéma). |
| Registre -> tire -> Admission | liens | DOUTEUSE | Flèche inversée : c'est le kubelet/le runtime qui tire depuis le registre, pas l'admission ; l'admission agit à la création du Pod, avant le tirage. | Corriger : Déploiement -> Admission (autorise) -> Pods, et Pods/kubelet -> Registre (tire). |
| Admission -> autorise -> Déploiement ; Déploiement -> crée -> Pods | liens | DOUTEUSE | Ordre ambigu : l'admission contrôle la requête de création, après le Déploiement. | Réordonner comme ci-dessus ou étiqueter « avis d'auteur » avec une légende « schéma simplifié ». |
| « L'ancien état reste récupérable » | exemple, raisonnement, noeud pods | NON SOURCÉE | K8s dit seulement que `:latest` rend le retour arrière plus difficile ; il ne dit pas que l'ancienne version reste récupérable. | Reformuler : « avec un digest ou un tag précis, un retour arrière est plus facile » (fidèle à K8s), ou « avis d'auteur ». |
| Le patch serveur par serveur, par lots, avec dérive d'état | resume.avant, schema.avant | NON SOURCÉE | Comparaison avec l'ancien monde. | « avis d'auteur » tel quel. |
| Corriger vite les failles critiques reste une obligation | resteVrai.1 | NON SOURCÉE | « Obligation » est un fait réglementaire ou contractuel non cité. | Remplacer « obligation » par « nécessité » et étiqueter « avis d'auteur », ou sourcer (CISA KEV, mais URL non lue sur le fond : seul le code HTTP 200 est vérifié). |
| Une recette avant production reste nécessaire ; savoir ce qui tourne reste le point de départ | resteVrai.2, resteVrai.3 | NON SOURCÉE | Conseils de pratique. | « avis d'auteur » (resteVrai.N). |
| « Le serveur patché reste le même serveur » | reflexe | NON SOURCÉE | Opinion. | « avis d'auteur » (reflexe). |
| Une faille touche « une bibliothèque de l'AMF » | exemple, epreuve.cas | NON SOURCÉE | « AMF » n'est défini nulle part ; lecture probable : Access and Mobility Management Function (5G Core). | Écrire le sigle développé une fois ; cas fictif à étiqueter comme tel. |
| SLSA : cadre pour la sécurité de la chaîne logicielle | plusLoin, sources | CONFIRMÉE | slsa.dev : cadre de normes et de contrôles contre la falsification, quatre niveaux. | Titre `plusLoin` : dire « niveaux de sécurité » ne pose pas de souci ; ne pas lui faire dire « signature ». |
| CISA KEV | plusLoin | CONFIRMÉE (existence) | URL répond 200 ; contenu non lu en détail. | Aucune. |

## Liens

| URL | Code | Remarque |
|---|---|---|
| kubernetes.io/docs/concepts/containers/images/ | 200 | OK |
| cisa.gov/sbom (sources) | 200 après 301 | Redirige vers la page SBOM de CISA (pertinente). Mettre l'URL finale. |
| slsa.dev | 200 | OK |
| youtube.com playlist Red Hat | 200 | Contenu non vérifié (pas lu) ; la page répond. |
| github.com/madhuakula/kubernetes-goat | 200 | OK |
| cisa.gov/known-exploited-vulnerabilities-catalog | 200 | OK |
| github.com/opencontainers/distribution-spec/.../spec.md | 200 | OK (non citée dans `sources`, seulement évoquée par la consigne) |

Aucun lien en échec. À noter : l'épreuve cite « Kubernetes : images de conteneurs ; CISA : SBOM » (pas la spécification OCI) ; la spécification OCI n'est donc pas dans les sources.

## Verdict sur l'épreuve

Partiellement soutenue.
- Le raisonnement sur tag/digest est soutenu par K8s (et par OCI).
- Le raisonnement sur « le SBOM indique quelles images contiennent la bibliothèque » et « l'ancien état reste récupérable » n'est pas soutenu par les sources citées (CISA ne dit pas cet usage ; K8s ne dit pas que l'ancien état reste récupérable).
- Le cas est réaliste pour un architecte télécom (une faille dans une bibliothèque d'une fonction 5G déployée par image `:latest`), à condition de développer « AMF » et de dire que le cas est illustratif.
- Corrections : ajouter `avisAuteur` pour les deux points ci-dessus ou retirer ces deux phrases du raisonnement attendu ; ajouter la spécification OCI à `epreuve.source` si on veut s'appuyer sur « tag = pointeur, digest = contenu ».
