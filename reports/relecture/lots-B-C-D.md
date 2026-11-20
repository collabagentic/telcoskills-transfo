# Relecture sourcée, lots B, C et D (13 fiches)

Même méthode que les lots A1 et A2 : un agent relit chaque fiche contre ses sources (rapport par fiche dans ce dossier), puis les corrections sont appliquées et les passages d'opinion étiquetés « avis d'auteur ». Date : 2026-11-21.

- Lot B, « changer de pratique » : `changement-pr`, `patch-images`, `cmdb-git`, `dossier-archi-code`, `pra-gitops`.
- Lot C, « intégrer » : `appliance-cnf`, `interfaces-sbi`, `supervision-prometheus`, `observabilite-traces`.
- Lot D, « décider » : `chiffrage-slo`, `dimensionnement-ressources`, `ao-exigences-cnf`, `plateforme-produit`.

## Bilan chiffré (d'après les rapports)

| Fiche | Confirmés | Non sourcés | Douteux |
| --- | --- | --- | --- |
| changement-pr | 9 | 8 | 3 |
| patch-images | 7 | 8 | 5 |
| cmdb-git | 9 | 8 | 3 |
| dossier-archi-code | 6 | 8 | 5 |
| pra-gitops | 6 | 11 | 2 |
| appliance-cnf | 9 | 9 | 3 |
| interfaces-sbi | 14 | 5 | 2 |
| supervision-prometheus | 10 | 7 | 4 |
| observabilite-traces | 5 | 8 | 3 |
| chiffrage-slo | 9 | 8 | 3 |
| dimensionnement-ressources | 11 | 7 | 5 |
| ao-exigences-cnf | 5 | 9 | 4 |
| plateforme-produit | 8 | 8 | 1 |
| **Total** | **108 (42 %)** | **104 (41 %)** | **43 (17 %)** |

Avec les lots A1 et A2 : 21 fiches, environ 430 points examinés. Aucun lien n'est mort ; quelques sources sont redirigées vers une page sans rapport et ont été retirées ou remplacées. Réserves : certaines pages n'ont été lues que par résumé ou sur leurs 100 000 premiers caractères ; le contenu des playlists vidéo n'est vérifié que par code HTTP et titre.

## Ce que montrent ces trois lots

1. **Le fond technique tient, l'habillage non.** Comme dans « comprendre » : les mécanismes (Helm, Prometheus, requests et limits, OLM, 3GPP SBI) sont confirmés ; ce qui n'a pas de source, ce sont les comparaisons avec l'ancien monde, les conseils et les illustrations télécom. Ils restent, étiquetés « avis d'auteur ».
2. **Des faits invérifiables ont été retirés plutôt qu'étiquetés** : la signature d'images et la vérification à l'admission (`patch-images`), « Route » (`lb-services`, lot A2), Flux (`pra-gitops`, `changement-pr`), CKA et CKAD, « images signées » (`ao-exigences-cnf`), le nœud Grafana (`supervision-prometheus`), l'identifiant de trace et l'échantillonnage (`observabilite-traces`), la pile 4G et PFCP (`interfaces-sbi`).
3. **Des formulations trop fortes ont été ramenées à la source** : « une limite mémoire dépassée tue le conteneur » (le noyau peut le tuer, sous pression mémoire), « les manifestes ne reconstruisent pas les secrets » (un secret chiffré est rejoué), « l'interopérabilité en priorité » (2e préoccupation, 42,86 % dans l'enquête CNCF), « chaque niveau de disponibilité a un coût » (la source dit seulement que viser trop haut coûte cher).
4. **Des diagrammes erronés corrigés** : lien « Registre tire Admission » et ordre Admission, Déploiement, Pods (`patch-images`), flèche « SLI mesure SLO » inversée (`chiffrage-slo`), Pull request placée sur le poste au lieu de la forge (`changement-pr`), alignement NUMA présenté comme une demande du pod alors que c'est une politique du kubelet (`dimensionnement-ressources`).
5. **Une source de référence trouvée** pour le RTO et le RPO (page AWS Well-Architected, marquée « historique » par AWS) ; le RPO y est un temps depuis le dernier point de récupération, non une quantité de données, et la fiche est alignée.
6. **Les spécifications 3GPP ont été lues en texte intégral** pour `interfaces-sbi` (TS 29.500, 23.501, 38.412) : l'épreuve cite maintenant les clauses exactes.

## Incident de méthode

Les agents de correction partageaient un dossier de travail commun : l'un d'eux a exécuté par erreur le script d'un autre sur `supervision-prometheus`, ce qui a dupliqué une entrée d'historique et deux sources. Détecté par le rapport de l'agent concerné, vérifié et corrigé ; les 12 autres fiches ont été contrôlées (aucun doublon). À retenir : un dossier de travail par agent la prochaine fois.

## Décisions qui vous reviennent

- **`plateforme-produit`** : l'agent recommande « comprendre » plutôt que « décider » (la fiche définit un concept, ne propose aucun arbitrage ni critère de choix). Non modifié. Pour garder « décider », il faudrait ajouter un vrai choix (plateforme minimale ou portail complet, appuyé sur les niveaux de maturité CNCF).
- **Les liens de diagramme ne sont pas étiquetables** : le champ `avisAuteur` couvre le texte et le schéma, pas chaque flèche de diagramme. Plusieurs flèches illustratives restent donc sans étiquette (par exemple « pèse sur » et « fixe » dans `chiffrage-slo`). À décider : étendre l'étiquetage aux diagrammes, ou accepter la légende « Schéma d'auteur ».

## À sourcer (liste complète par fiche dans `/audit` et `content/audit.json`)

- `interfaces-sbi` : PFCP sur N4 (TS 29.244), pile 4G, descriptions de boîtes (TS 23.501 cl. 6.2).
- `observabilite-traces` : pages OpenTelemetry Traces, Sampling et Context propagation ; parcours AMF, SMF, PCF d'une session PDU (TS 23.502).
- `patch-images` : usage d'un SBOM pour localiser une bibliothèque vulnérable, signature d'images (Sigstore, cosign).
- `pra-gitops` : où vit l'état de session de la SMF et l'état d'abonné de l'AMF.
- `dimensionnement-ressources` : besoins réels d'un UPF ; page Pod QoS Classes non lue.
- `ao-exigences-cnf` : formats de livraison (charts, images) et documentation des réseaux secondaires ; dépôts successeurs de cnf-wg.
- `appliance-cnf` : livraison d'une CNF en chart par les éditeurs, mise à jour « par lots ».
- `supervision-prometheus` : Grafana (retiré du diagramme), métrique d'échec de session PDU.
- `cmdb-git` : page « labels recommandés » de Kubernetes.
- `chiffrage-slo`, `changement-pr`, `dossier-archi-code`, `plateforme-produit` : voir leurs notes d'audit.

## Suite

Votre relecture des 21 fiches (« relu » n'est posé que par vous), la décision sur `plateforme-produit`, puis le test utilisateur.
