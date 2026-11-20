# Relecture : appliance-cnf

Résumé :
- Confirmées : 9 affirmations (helm upgrade, release, révisions, rollback, fichiers de valeurs, valeurs par défaut du chart, helm template, sens des flèches vals→pipe et pipe→cl).
- Non sourcées : 9 (rôle du fournisseur, recette, support, « ne conviennent pas à votre cluster », UPF et interfaces secondaires, livraison en conteneurs, registre, « tire », appliance « par lots »), dont 7 étiquetables « avis d'auteur » tels quels.
- Douteuses : 3 (« images signées », « déploie la version par helm upgrade » sans installation initiale, flèche rollback vers « révision n−1 »).

## Pages ouvertes (WebFetch, et curl avec user-agent navigateur pour les codes HTTP)
- helm.sh/docs/helm/helm_upgrade/ : lue. Met à jour une release vers une version de chart et/ou de nouvelles valeurs (`-f`, `--set`) ; `--install` crée la release si absente. Ne mentionne ni `helm rollback` ni `helm template`, et ne dit pas explicitement « nouvelle révision ».
- helm.sh/docs/helm/helm_rollback/ : lue. Retour à une révision antérieure, `helm rollback <RELEASE> [REVISION]` ; sans numéro, retour à la précédente. Ne dit pas qu'une révision est créée.
- helm.sh/docs/intro/using_helm/ : lue. Une installation crée une release ; install, upgrade et rollback incrémentent la révision ; rollback crée une nouvelle révision ; `-f` fichiers de valeurs ; défauts du chart, `helm show values`.
- helm.sh/docs/helm/helm_template/ (absente de la fiche, ouverte par moi) : rend les templates localement, sans déployer.
- Les trois playlists YouTube : seul le titre de page a été lu ; le contenu des vidéos n'a pas été vu.

## Tableau

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| « helm upgrade » applique une nouvelle version ou de nouvelles valeurs | change.1, exemple, epreuve, schema | CONFIRMÉE | upgrade met à jour une release : nouvelle version de chart et/ou valeurs (helm_upgrade, using_helm) | Aucune |
| Chaque installation est une release | change.2 | CONFIRMÉE | Installer un chart crée une release (using_helm) | Aucune |
| Les révisions précédentes permettent de revenir en arrière avec « helm rollback » | change.2, diagramme, schema | CONFIRMÉE | rollback ramène à une révision antérieure (helm_rollback) | Aucune |
| helm upgrade crée une nouvelle révision | epreuve.raisonnement | CONFIRMÉE, mais pas par la source citée | Chaque install, upgrade, rollback incrémente la révision (using_helm seulement) | Ajouter using_helm à epreuve.source |
| Configuration dans des fichiers de valeurs | change.3, diagramme | CONFIRMÉE pour le fichier de valeurs | `-f values.yaml` surcharge les défauts (using_helm, helm_upgrade) | Aucune |
| « versionnés » / « values.yaml dans Git » | change.3, schema, noeud vals | NON SOURCÉE | Les sources ne parlent pas de Git | Étiqueter « avis d'auteur » (bonne pratique) ; change.3 n'est pas dans la liste des champs d'avis : à ajouter (change.3) |
| Les valeurs par défaut du chart existent et se surchargent | piege, epreuve | CONFIRMÉE | Sans surcharge, configuration par défaut du chart ; `helm show values` (using_helm) | Aucune |
| « Les valeurs par défaut ne conviennent pas à votre cluster (réseaux secondaires, ressources, stockage) » | piege, epreuve.raisonnement | NON SOURCÉE | Rien sur l'adéquation des défauts ni sur les réseaux secondaires | piege : avis d'auteur tel quel. epreuve.raisonnement : reformuler en « à adapter à votre cluster, c'est un avis d'auteur », ou le sortir du raisonnement attendu |
| helm template génère seulement les manifestes, sans rien installer | epreuve.raisonnement | CONFIRMÉE, hors sources citées | helm_template : rend les templates en local, sans déployer | Ajouter https://helm.sh/docs/helm/helm_template/ aux sources et à epreuve.source |
| Une release existante se met à jour avec helm upgrade | epreuve.cas/raisonnement | CONFIRMÉE | helm_upgrade ; `--install` pour créer si absente | Aucune |
| « helm upgrade » déploie la version (première livraison incluse) | exemple, diagramme (pipe → cl « déploie ») | DOUTEUSE | upgrade suppose une release existante ; la première fois, `helm install` ou `upgrade --install` | exemple : « installe la première version par helm install, puis la met à jour par helm upgrade » |
| Flèche vals → pipe « paramètre » | diagramme | CONFIRMÉE | Les valeurs sont passées à la commande via `-f` | Aucune |
| Flèche cl → prev « rollback » (pointillé) | diagramme | DOUTEUSE | Rollback revient à une révision antérieure mais crée une nouvelle révision (using_helm) | Garder le pointillé, détail du nœud : « rollback : nouvelle révision à l'état n−1 » |
| Flèche reg → pipe « tire » ; registre « images signées » ; éditeur « livre chart et images » | diagramme | NON SOURCÉE ; « signées » DOUTEUSE | Aucune source lue ne parle de registre, de signature, ni de qui tire les images (dans Kubernetes, ce sont les nœuds) | Retirer « signées » ; étiqueter le schéma « avis d'auteur » ou changer le verbe « tire » en « référencé par le chart » |
| Le fournisseur reste responsable du logiciel et de sa feuille de route | resteVrai.1 | NON SOURCÉE | Hors périmètre des pages Helm | Avis d'auteur tel quel |
| Recette de réception nécessaire avant la production | resteVrai.2 | NON SOURCÉE | idem | Avis d'auteur tel quel |
| Support et correctifs contractualisés | resteVrai.3 | NON SOURCÉE | idem | Avis d'auteur tel quel |
| Appliance livrée et installée par l'équipementier, mise à jour par procédures / par lots | resume.avant, schema.avant | NON SOURCÉE | idem | Avis d'auteur (resume et schema sont déjà admis) |
| CNF livrée en conteneurs et en chart Helm | resume.apres, schema.apres | NON SOURCÉE | Les pages décrivent le chart Helm, pas la pratique des éditeurs de CNF | Avis d'auteur, ou ajouter une source CNF (non ouverte ici) |
| L'éditeur livre l'UPF en chart ; interfaces secondaires et ressources fixées dans les valeurs | exemple, epreuve.cas | NON SOURCÉE | Aucune page lue ne mentionne l'UPF ni les interfaces secondaires | exemple : avis d'auteur tel quel. epreuve.cas : le présenter comme cas d'école, sans en faire un fait |
| reflexe « La configuration vit dans l'équipement » | reflexe | Avis d'auteur admis | n/a | Aucune |

## Liens
- helm_upgrade, helm_rollback, using_helm : HTTP 200, sans redirection.
- Les trois playlists YouTube : HTTP 200 après 2 redirections (paramètres de consentement), titres corrects (LMFK, TUTORIALS ET FORMATION HELM, Cloud Native Telco Day 2026 - Europe). Contenu et auteurs non vérifiés.
- Aucun lien en échec ni vers une page sans rapport.

## Épreuve
- Raisonnement attendu : seulement en partie soutenu par la source citée (helm_upgrade). Manquent : la révision créée (using_helm) et helm template (helm_template). « Les valeurs par défaut ne conviennent pas à votre cluster » est un avis, pas un fait de la source.
- Question sur la commande : correcte, puisque le cas précise « release déjà installée ».
- Réalisme : plausible pour un architecte télécom (chart UPF, valeurs à adapter au cluster). Aucune source ne l'atteste.
- Verdict : acceptable après ajout de using_helm et helm_template comme sources et reclassement de la partie « valeurs par défaut » en avis d'auteur.
