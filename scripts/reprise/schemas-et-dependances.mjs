// Ajoute aux fiches leur schéma « Avant → Après » (chaînes d'étapes) et aux métiers leurs dépendances (prérequis conseillés).
// Exécuté une fois, conservé pour traçabilité. Usage : node scripts/reprise/schemas-et-dependances.mjs
import fs from "node:fs";
import path from "node:path";

const R = path.join(import.meta.dirname, "..", "..", "content") + path.sep;
const e = (texte, detail) => (detail ? { texte, detail } : { texte });

const SCHEMAS = {
  "vlan-reseaux-cluster": ["Deux plans de réseau dans un cluster",
    [e("VM", "portgroup tagué VLAN"), e("Commutateur", "trunk 802.1Q"), e("Pare-feu", "règles entre VLAN")],
    [e("Pod", "IP éphémère, réseau plat"), e("Réseau primaire", "OVN-Kubernetes, NetworkPolicy"), e("Interface secondaire", "Multus, SR-IOV, VLAN")]],
  "matrice-networkpolicy": ["De l'adresse IP au label",
    [e("Source", "adresse IP et sous-réseau"), e("Pare-feu", "une ligne : IP, port"), e("Destination", "adresse IP du serveur")],
    [e("Pods source", "sélectionnés par label"), e("NetworkPolicy", "labels, namespace, port"), e("Pods AMF", "label app=amf")]],
  "pra-gitops": ["Reprise : procédure ou dépôt",
    [e("Sinistre"), e("Dossier PRA", "procédure rédigée"), e("Reprise manuelle", "RTO tenu à la main")],
    [e("Sinistre"), e("Dépôt Git", "état voulu du cluster"), e("Outil GitOps", "réapplique les manifestes"), e("Données", "restaurées depuis la réplication")]],
  "changement-pr": ["Du formulaire à la fusion",
    [e("Demande de changement", "MOP, document"), e("Comité", "CAB, validation"), e("Fenêtre", "exécution à la main")],
    [e("Pull request", "diff relu"), e("Pipeline", "vérifications obligatoires"), e("Fusion", "déclenche le déploiement")]],
  "vm-pod": ["De la machine qu'on soigne au pod qu'on remplace",
    [e("Template", "VM de référence"), e("VM", "patchée sur place"), e("Correction", "connexion en SSH")],
    [e("Image", "construite et versionnée"), e("Deployment", "N pods voulus"), e("Pods", "remplacés, jamais réparés")]],
  "actif-passif-replicas": ["Haute disponibilité : attendre ou répartir",
    [e("Nœud actif", "sert le trafic"), e("Cluster HA", "détecte la panne"), e("Nœud passif", "prend le relais")],
    [e("Service", "répartit le trafic"), e("Réplicas", "plusieurs pods actifs"), e("Sondes", "readiness retire, liveness redémarre")]],
  "acces-rbac": ["Qui peut faire quoi, où",
    [e("Compte nominatif"), e("sudo", "droits sur la machine"), e("Root partagé", "pour les urgences")],
    [e("Sujet", "personne ou compte de service"), e("RoleBinding", "lie le sujet au rôle"), e("Role", "verbes sur des ressources")]],
  reconciliation: ["La boucle de réconciliation", null,
    [e("État voulu", "déclaré dans l'API"), e("Contrôleur", "compare en continu"), e("État réel", "ramené vers le voulu")]],
  operateurs: ["Un contrôleur qui exploite l'application", null,
    [e("Ressource personnalisée", "décrit l'application"), e("Opérateur", "contrôleur dédié"), e("Pods", "déployés et mis à jour")]],
  "supervision-prometheus": ["De l'alarme par cause à l'alerte sur symptôme",
    [e("Nœud", "compteurs propriétaires"), e("Seuil fixe", "une alarme par cause"), e("Console", "bruit")],
    [e("Métriques", "exposées par les pods"), e("Prometheus", "règles d'alerte, clause for"), e("Alertmanager", "regroupe par labels")]],
  "observabilite-traces": ["Suivre une requête de bout en bout", null,
    [e("Services", "instrumentés"), e("Collector", "reçoit et filtre"), e("Trace", "temps passé par étape")]],
  "interfaces-sbi": ["Du lien dédié à l'interface de service",
    [e("Nœud", "MME"), e("Interface dédiée", "SCTP, GTP, Diameter"), e("Nœud", "SGW, HSS")],
    [e("Fonction", "AMF"), e("Interface de service", "HTTP/2, JSON, OpenAPI"), e("Fonction", "SMF")]],
  "appliance-cnf": ["Cycle de vie d'une fonction réseau",
    [e("Appliance", "livrée par l'équipementier"), e("Console", "configuration dans l'équipement"), e("Procédure", "mise à jour par lots")],
    [e("Chart Helm", "livré par l'éditeur"), e("Valeurs", "versionnées chez vous"), e("helm upgrade", "rollback possible")]],
  "dimensionnement-ressources": ["De l'allocation à la demande",
    [e("VM", "vCPU et RAM alloués"), e("Hyperviseur", "surdimensionnement toléré")],
    [e("Requests", "servent au placement"), e("Limits", "plafond à l'exécution"), e("CPU exclusifs", "QoS Guaranteed, CPU entiers")]],
  "ao-exigences-cnf": ["Ce que l'appel d'offres exige",
    [e("Cahier des charges", "fonctionnalités"), e("Conformité", "à l'équipement"), e("Notation", "grille pondérée")],
    [e("Exigences", "fonctions et livraison"), e("Plateforme", "Kubernetes certifiée"), e("Preuves", "charts, images, tests")]],
  "dossier-archi-code": ["Du dossier au dépôt",
    [e("Dossier", "rédigé au lancement"), e("Comité", "validation"), e("Archive", "rarement relue")],
    [e("ADR", "contexte, décision, conséquences"), e("Pull request", "relue par les pairs"), e("Dépôt", "historique daté")]],
  "cmdb-git": ["Où vit l'inventaire",
    [e("Saisie ou découverte"), e("CMDB", "inventaire séparé"), e("Écart", "retard sur la réalité")],
    [e("Git", "état voulu"), e("Cluster", "objets avec labels"), e("Requête", "par propriétaire, version")]],
  "patch-images": ["Du correctif sur place à l'image reconstruite",
    [e("Correctif", "serveur par serveur"), e("Fenêtre", "par lots"), e("Dérive", "états différents")],
    [e("Image", "reconstruite"), e("SBOM", "composants listés"), e("Déploiement", "par digest sha256")]],
  "lb-services": ["Répartir le trafic",
    [e("Client"), e("F5", "virtual server et pool"), e("Serveurs", "pool tenu à la main")],
    [e("Client"), e("Service LoadBalancer", "MetalLB, BGP"), e("Pods", "endpoints suivis seuls")]],
  "chiffrage-slo": ["Du chiffrage par équipement au coût par niveau de service",
    [e("Équipements", "et licences"), e("TCO", "sur cinq ans"), e("Marge", "de sécurité")],
    [e("SLO", "objectif mesuré"), e("Architecture", "réplicas, sites"), e("Coût", "par niveau de service")]],
  "plateforme-produit": ["Une plateforme avec ses utilisateurs", null,
    [e("Équipes", "utilisateurs internes"), e("Capacités", "en libre-service"), e("Équipe plateforme", "feuille de route, retours")]],
};

for (const [id, [legende, avant, apres]] of Object.entries(SCHEMAS)) {
  const fichier = R + `fiches/${id}.json`;
  const f = JSON.parse(fs.readFileSync(fichier, "utf8"));
  f.schema = { legende, avant, apres };
  const ordre = ["id", "genre", "avant", "apres", "resume", "resteVrai", "change", "reflexe", "pourquoiNouveau", "piege", "exemple", "schema"];
  const range = {};
  for (const k of ordre) range[k] = f[k];
  for (const k of Object.keys(f)) if (!(k in range)) range[k] = f[k];
  fs.writeFileSync(fichier, JSON.stringify(range, null, 2) + "\n");
}

// Prérequis conseillés : fiche → fiches à voir avant. Chaque prérequis précède la fiche dans « ordre ».
const DEPENDANCES = {
  "infra-virtualisation": {
    "vlan-reseaux-cluster": ["matrice-networkpolicy"],
    "actif-passif-replicas": ["vm-pod"],
    reconciliation: ["vm-pod"],
    "pra-gitops": ["changement-pr", "reconciliation"],
    "acces-rbac": ["vm-pod"],
    operateurs: ["reconciliation"],
  },
  "coeur-reseau": {
    "vlan-reseaux-cluster": ["interfaces-sbi"],
    "appliance-cnf": ["interfaces-sbi"],
    "actif-passif-replicas": ["appliance-cnf"],
    "dimensionnement-ressources": ["appliance-cnf"],
    reconciliation: ["appliance-cnf"],
    "supervision-prometheus": ["actif-passif-replicas"],
    "observabilite-traces": ["supervision-prometheus"],
    "changement-pr": ["reconciliation"],
    operateurs: ["reconciliation"],
    "ao-exigences-cnf": ["appliance-cnf", "dimensionnement-ressources"],
  },
  "architecte-si": {
    "changement-pr": ["dossier-archi-code"],
    reconciliation: ["vm-pod"],
    "patch-images": ["vm-pod"],
    "lb-services": ["vm-pod"],
    "cmdb-git": ["changement-pr"],
    "acces-rbac": ["vm-pod"],
    operateurs: ["reconciliation"],
    "plateforme-produit": ["operateurs", "cmdb-git"],
  },
  "avant-vente": {
    "ao-exigences-cnf": ["chiffrage-slo"],
    "dimensionnement-ressources": ["appliance-cnf"],
    "dossier-archi-code": ["ao-exigences-cnf"],
    reconciliation: ["appliance-cnf"],
    "plateforme-produit": ["reconciliation"],
  },
};
for (const [id, dependances] of Object.entries(DEPENDANCES)) {
  const fichier = R + `metiers/${id}.json`;
  const m = JSON.parse(fs.readFileSync(fichier, "utf8"));
  const { sources, statut, ...avant } = m;
  fs.writeFileSync(fichier, JSON.stringify({ ...avant, dependances, sources, statut }, null, 2) + "\n");
}
console.log("Schémas :", Object.keys(SCHEMAS).length, "· métiers avec dépendances :", Object.keys(DEPENDANCES).length);
