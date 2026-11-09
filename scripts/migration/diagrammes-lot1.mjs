// Lot 1 : un vrai diagramme d'architecture pour chacune des 16 fiches de transformation restantes.
// Usage : node scripts/migration/diagrammes-lot1.mjs, puis les tests (règle 15) disent ce qu'il faut corriger.
import { n, rangee, colonne, centrer, decaler, zone, diagramme, fiche } from "./outils-diagramme.mjs";

// 1. Changement : du formulaire à la fusion
{
  const a = rangee([n("branche", "Branche", "vous poussez"), n("pr", "Pull request", "diff relu par un pair", { ton: "chaud" })], { x: 36, y: 60, gap: 70 });
  const b = rangee([n("pipeline", "Pipeline CI", "tests, lint, sécurité"), n("fusion", "Fusion", "branche protégée")], { x: 470, y: 60, gap: 70 });
  const c = rangee([n("cluster", "Cluster", "état réel", { ton: "ok" }), n("gitops", "Outil GitOps", "Argo CD, Flux")], { y: 210, gap: 70 });
  centrer(c, "gitops", b[1].x + b[1].w / 2);
  fiche(
    "changement-pr",
    diagramme({
      legende: "Du changement à la production : pull request, pipeline, fusion, GitOps",
      zones: [zone("poste", "Votre poste", a), zone("forge", "Forge (GitLab, GitHub)", b), zone("plateforme", "Plateforme", c)],
      noeuds: [...a, ...b, ...c],
      liens: [
        ["branche", "pr", "ouvre"],
        ["pr", "pipeline", "déclenche"],
        ["pipeline", "fusion", "si vert"],
        ["gitops", "fusion", "lit main", { style: "pointille" }],
        ["gitops", "cluster", "applique"],
      ],
    }),
  );
}

// 2. VM et template contre image et déploiement
{
  const a = rangee([n("template", "Template", "VM de référence"), n("vm", "VM", "patchée sur place"), n("ssh", "Correction", "connexion en SSH", { ton: "faible" })], { x: 36, y: 60, gap: 70 });
  const b = rangee(
    [n("image", "Image", "construite, versionnée"), n("registre", "Registre", "stocke l'image"), n("deployment", "Deployment", "N pods voulus", { ton: "chaud" }), n("pods", "Pods", "remplacés, jamais réparés", { ton: "ok" })],
    { x: 36, y: 210, gap: 60 },
  );
  fiche(
    "vm-pod",
    diagramme({
      legende: "De la machine qu'on soigne au pod qu'on remplace",
      zones: [zone("avant", "Avant : machine virtuelle", a), zone("apres", "Après : conteneurs", b, "chaud")],
      noeuds: [...a, ...b],
      liens: [
        ["template", "vm", "clone"],
        ["vm", "ssh", "soigne"],
        ["image", "registre", "push"],
        ["registre", "deployment", "tire"],
        ["deployment", "pods", "crée"],
      ],
    }),
  );
}

// 3. Haute disponibilité : attendre ou répartir
{
  const a = rangee([n("client", "Client"), n("actif", "Nœud actif", "sert le trafic"), n("passif", "Nœud passif", "attend", { ton: "faible" })], { x: 36, y: 60, gap: 80 });
  const pods = colonne([n("pod-a", "Pod", "réplica 1", { ton: "ok" }), n("pod-b", "Pod", "réplica 2", { ton: "ok" }), n("pod-c", "Pod", "réplica 3", { ton: "ok" })], { x: 380, y: 210, gap: 16, w: 130 });
  const service = rangee([n("service", "Service", "répartit le trafic", { ton: "chaud" })], { x: 200, y: 210 + 56 + 16 });
  const client2 = rangee([n("client2", "Client")], { x: 36, y: 210 + 56 + 16 + 8 });
  const droite = colonne([n("sonde", "Sonde readiness", "retire un pod en échec", { ton: "froid" }), n("pdb", "PodDisruptionBudget", "limite les arrêts planifiés", { ton: "froid" })], { x: 600, y: 240, gap: 40, w: 200 });
  fiche(
    "actif-passif-replicas",
    diagramme({
      legende: "Haute disponibilité : un nœud qui attend contre des réplicas qui servent",
      zones: [zone("avant", "Avant : actif/passif", a), zone("apres", "Après : réplicas et sondes", [...pods, ...service, ...client2, ...droite], "chaud")],
      noeuds: [...a, ...pods, ...service, ...client2, ...droite],
      liens: [
        ["client", "actif", "trafic"],
        ["actif", "passif", "heartbeat", { style: "pointille", sens: "double" }],
        ["client2", "service"],
        ["service", "pod-a"],
        ["service", "pod-b"],
        ["service", "pod-c"],
        ["sonde", "pod-b", "teste", { style: "pointille" }],
        ["pdb", "pod-c", "garde ≥ 2", { style: "pointille" }],
      ],
    }),
  );
}

// 4. Accès : sujets, liaisons, rôles
{
  const sujets = colonne([n("user", "Utilisateur", "identité OIDC"), n("sa", "Compte de service", "identité d'un pod")], { x: 20, y: 70, gap: 60 });
  const ns = rangee([n("rb", "RoleBinding", "lie sujet et rôle"), n("role", "Role", "verbes sur des ressources", { ton: "chaud" }), n("res", "Ressources", "pods, secrets, services", { ton: "ok" })], { x: 240, y: 118, gap: 50 });
  const cl = rangee([n("crb", "ClusterRoleBinding", "portée : tout le cluster", { ton: "faible" }), n("cr", "ClusterRole", "droits sur tout le cluster", { ton: "faible" })], { x: 240, y: 270, gap: 50 });
  fiche(
    "acces-rbac",
    diagramme({
      legende: "Qui peut faire quoi, et où : sujets, liaisons, rôles, ressources",
      zones: [zone("ns", "Namespace 5gc", ns, "chaud")],
      noeuds: [...sujets, ...ns, ...cl],
      liens: [
        ["user", "rb", "sujet"],
        ["sa", "rb", "sujet"],
        ["rb", "role", "référence"],
        ["role", "res", "get, list"],
        ["sa", "crb", "piège : tout le cluster", { style: "pointille" }],
        ["crb", "cr", "référence", { style: "pointille" }],
      ],
    }),
  );
}

// 5. Opérateurs et ressources personnalisées
{
  const olm = rangee([n("catalogue", "Catalogue", "opérateurs disponibles"), n("sub", "Subscription", "canal suivi"), n("plan", "InstallPlan", "changements à approuver")], { x: 36, y: 60, gap: 60 });
  const cluster = rangee([n("cr", "Ressource perso", "UPF : 3 instances", { ton: "chaud" }), n("op", "Opérateur", "contrôleur dédié", { ton: "chaud" }), n("res", "Ressources gérées", "StatefulSet, Service", { ton: "ok" })], { y: 220, gap: 50 });
  centrer(cluster, "op", olm[2].x + olm[2].w / 2);
  fiche(
    "operateurs",
    diagramme({
      legende: "Un opérateur installé par OLM exploite l'application à votre place",
      zones: [zone("olm", "OLM (OpenShift)", olm), zone("cluster", "Cluster", cluster, "chaud")],
      noeuds: [...olm, ...cluster],
      liens: [
        ["catalogue", "sub", "choisit"],
        ["sub", "plan", "génère"],
        ["plan", "op", "installe"],
        ["cr", "op", "décrit"],
        ["op", "res", "crée"],
      ],
    }),
  );
}

// 6. Supervision : métriques, règles, alertes
{
  const cluster = rangee([n("pods", "Pods", "exposent /metrics"), n("prom", "Prometheus", "règles d'alerte, clause for", { ton: "chaud" })], { x: 36, y: 60, gap: 70 });
  const suite = rangee([n("am", "Alertmanager", "regroupe et route"), n("astreinte", "Astreinte", "mail, chat, téléphone", { ton: "ok" })], { x: cluster[1].x + cluster[1].w + 56, y: 60, gap: 56 });
  const graf = rangee([n("graf", "Grafana", "tableaux de bord")], { y: 210 });
  centrer(graf, "graf", cluster[1].x + cluster[1].w / 2);
  fiche(
    "supervision-prometheus",
    diagramme({
      legende: "Supervision : métriques ouvertes, règles sur symptômes, alertes regroupées",
      zones: [zone("cluster", "Cluster", cluster)],
      noeuds: [...cluster, ...suite, ...graf],
      liens: [
        ["prom", "pods", "scrape"],
        ["prom", "am", "alertes"],
        ["am", "astreinte", "notifie"],
        ["graf", "prom", "PromQL"],
      ],
    }),
  );
}

// 7. Traces distribuées
{
  const apps = rangee([n("a", "Service A", "instrumenté"), n("b", "Service B", "instrumenté"), n("c", "Service C", "instrumenté")], { x: 36, y: 60, gap: 70 });
  const col = rangee([n("collector", "Collector", "reçoit, filtre, échantillonne", { ton: "chaud" })], { y: 242 });
  centrer(col, "collector", apps[1].x + apps[1].w / 2);
  const outils = colonne([n("bt", "Traces", "stockage et recherche"), n("bm", "Métriques", "stockage"), n("bl", "Journaux", "stockage")], { x: col[0].x + col[0].w + 90, y: 176, gap: 16, w: 190 });
  fiche(
    "observabilite-traces",
    diagramme({
      legende: "Une requête traverse trois services : le Collector rassemble ce qu'ils émettent",
      zones: [zone("apps", "Applications (SDK OpenTelemetry)", apps), zone("analyse", "Outils d'analyse", outils, "froid")],
      noeuds: [...apps, ...col, ...outils],
      liens: [
        ["a", "b", "requête"],
        ["b", "c", "requête"],
        ["a", "collector", "OTLP", { sortie: "b", entree: "h", decalageEntree: -70 }],
        ["b", "collector", undefined, { sortie: "b", entree: "h" }],
        ["c", "collector", undefined, { sortie: "b", entree: "h", decalageEntree: 70 }],
        ["collector", "bt"],
        ["collector", "bm"],
        ["collector", "bl"],
      ],
    }),
  );
}

// 8. Cycle de vie d'une fonction réseau
{
  const ed = rangee([n("ed", "Éditeur", "livre chart et images")], { x: 36, y: 60 });
  const mid = rangee([n("reg", "Registre", "images signées"), n("vals", "Valeurs", "values.yaml dans Git", { ton: "chaud" })], { x: ed[0].x + ed[0].w + 80, y: 60, gap: 60 });
  const bas = rangee([n("pipe", "Pipeline", "helm upgrade", { ton: "chaud" }), n("cl", "Cluster", "release n", { ton: "ok" }), n("prev", "Révision n−1", "retour possible", { ton: "faible" })], { y: 210, gap: 60 });
  centrer(bas, "pipe", (mid[0].x + mid[1].x + mid[1].w) / 2);
  fiche(
    "appliance-cnf",
    diagramme({
      legende: "Cycle de vie d'une CNF : livraison, valeurs versionnées, helm upgrade, rollback",
      zones: [zone("editeur", "Éditeur", ed), zone("vous", "Chez vous", mid), zone("plateforme", "Plateforme", bas, "chaud")],
      noeuds: [...ed, ...mid, ...bas],
      liens: [
        ["ed", "reg", "livre"],
        ["reg", "pipe", "tire", { sortie: "b", entree: "h", decalageEntree: -30 }],
        ["vals", "pipe", "paramètre", { sortie: "b", entree: "h", decalageEntree: 30 }],
        ["pipe", "cl", "déploie"],
        ["cl", "prev", "rollback", { style: "pointille" }],
      ],
    }),
  );
}

// 9. Dimensionnement : requests, limits, CPU exclusifs
{
  const sched = rangee([n("sched", "Scheduler", "selon les requests")], { x: 20, y: 170 });
  const r1 = rangee([n("outils", "Pod d'outils", "Burstable"), n("partage", "Pool partagé", "CPU restants")], { x: 270, y: 70, gap: 56 });
  const r2 = rangee([n("upf", "Pod UPF", "requests = limits", { ton: "chaud" }), n("excl", "CPU exclusifs", "politique static", { ton: "chaud" }), n("nic", "Carte SR-IOV", "même NUMA", { ton: "froid" })], { x: 270, y: 170, gap: 56 });
  const r3 = rangee([n("hp", "Hugepages", "1 Gio réservées", { ton: "ok" })], { x: 270, y: 270 });
  const noeud = [...r1, ...r2, ...r3];
  fiche(
    "dimensionnement-ressources",
    diagramme({
      legende: "Un nœud, deux types de pods : CPU exclusifs pour le plan usager, pool partagé pour le reste",
      zones: [zone("noeud", "Nœud de calcul (64 vCPU)", noeud)],
      noeuds: [...sched, ...noeud],
      liens: [
        ["sched", "outils", "place"],
        ["sched", "upf", "place"],
        ["outils", "partage", "utilise"],
        ["upf", "excl", "obtient"],
        ["excl", "nic", "NUMA", { style: "pointille", sens: "double" }],
        ["upf", "hp", "mémoire"],
      ],
    }),
  );
}

// 10. Appel d'offres : exigences vérifiables
{
  const ao = rangee([n("ao", "Appel d'offres", "cahier des charges")], { x: 20, y: 170 });
  const col = colonne(
    [n("e1", "Livraison", "images signées, charts"), n("e2", "Plateforme", "Kubernetes certifiée CNCF"), n("e3", "Exploitation", "mises à jour déclaratives"), n("e4", "Interopérabilité", "API standard, portabilité")],
    { x: 250, y: 60, gap: 16, w: 210 },
  );
  const preuves = rangee([n("preuves", "Preuves", "tests, démonstration, recette", { ton: "chaud" })], { x: 540, y: 160 });
  const verdict = rangee([n("verdict", "Éligibilité", "grille pondérée", { ton: "ok" })], { y: 280 });
  centrer(verdict, "verdict", preuves[0].x + preuves[0].w / 2);
  fiche(
    "ao-exigences-cnf",
    diagramme({
      legende: "Un appel d'offres cloud natif : des exigences que l'on peut vérifier",
      zones: [zone("exigences", "Exigences vérifiables", col, "chaud")],
      noeuds: [...ao, ...col, ...preuves, ...verdict],
      liens: [
        ["ao", "e1"],
        ["ao", "e2"],
        ["ao", "e3"],
        ["ao", "e4"],
        ["e1", "preuves"],
        ["e2", "preuves"],
        ["e3", "preuves"],
        ["e4", "preuves"],
        ["preuves", "verdict", "note"],
      ],
    }),
  );
}

// 11. Dossier d'architecture : décisions versionnées
{
  const a = rangee(
    [n("besoin", "À décider", "choix structurant"), n("adr", "ADR", "contexte, décision, effets", { ton: "chaud" }), n("pr", "Pull request", "relue par pairs et comité"), n("accepte", "ADR accepté", "statut et date", { ton: "ok" })],
    { x: 20, y: 60, gap: 46 },
  );
  const b = rangee([n("rempl", "ADR remplacé", "lien vers le nouveau", { ton: "faible" })], { y: 190 });
  centrer(b, "rempl", a[3].x + a[3].w / 2);
  fiche(
    "dossier-archi-code",
    diagramme({
      legende: "Du dossier validé en comité à la décision versionnée dans le dépôt",
      zones: [zone("depot", "Dépôt d'architecture", [...a.slice(1), ...b], "chaud")],
      noeuds: [...a, ...b],
      liens: [
        ["besoin", "adr", "rédige"],
        ["adr", "pr", "propose"],
        ["pr", "accepte", "fusion"],
        ["accepte", "rempl", "remplacé par", { style: "pointille" }],
      ],
    }),
  );
}

// 12. Inventaire : CMDB contre Git et labels
{
  const a = rangee([n("saisie", "Saisie", "à la main, par lots"), n("cmdb", "CMDB", "inventaire séparé"), n("ecart", "Écart", "retard sur la réalité", { ton: "faible" })], { x: 36, y: 60, gap: 70 });
  const b = rangee([n("git", "Git", "état voulu", { ton: "chaud" }), n("gitops", "Outil GitOps", "réapplique"), n("cluster", "Cluster", "objets avec labels", { ton: "ok" }), n("req", "Requête", "par owner, app, version")], { x: 36, y: 210, gap: 60 });
  fiche(
    "cmdb-git",
    diagramme({
      legende: "L'inventaire se lit dans le cluster, il n'est plus ressaisi",
      zones: [zone("avant", "Avant : CMDB", a), zone("apres", "Après : Git et labels", b, "chaud")],
      noeuds: [...a, ...b],
      liens: [
        ["saisie", "cmdb", "alimente"],
        ["cmdb", "ecart", "dérive"],
        ["git", "gitops", "lit"],
        ["gitops", "cluster", "applique"],
        ["cluster", "req", "labels"],
      ],
    }),
  );
}

// 13. Patch : reconstruire plutôt que corriger sur place
{
  const a = rangee([n("faille", "Faille publiée", "CVE sur une lib", { ton: "faible" }), n("sbom", "SBOM", "quelles images ?"), n("build", "Build CI", "image reconstruite", { ton: "chaud" }), n("reg", "Registre", "signature, digest")], { x: 36, y: 60, gap: 70 });
  const b = rangee([n("pods", "Pods", "ancien état récupérable", { ton: "ok" }), n("dep", "Déploiement", "par digest sha256"), n("adm", "Admission", "vérifie la signature", { ton: "froid" })], { y: 210, gap: 60 });
  centrer(b, "adm", a[3].x + a[3].w / 2);
  fiche(
    "patch-images",
    diagramme({
      legende: "Corriger une faille : interroger le SBOM, reconstruire, signer, déployer par digest",
      zones: [zone("chaine", "Chaîne d'approvisionnement", a.slice(1)), zone("cluster", "Cluster", b, "chaud")],
      noeuds: [...a, ...b],
      liens: [
        ["faille", "sbom", "interroge"],
        ["sbom", "build", "cible"],
        ["build", "reg", "publie"],
        ["reg", "adm", "tire"],
        ["adm", "dep", "autorise"],
        ["dep", "pods", "crée"],
      ],
    }),
  );
}

// 14. Répartition de charge : L4 avec MetalLB, HTTP avec Ingress
{
  const c1 = (id, t, d, ton) => n(id, t, d, { largeur: 130, ...(ton ? { ton } : {}) });
  const l4 = rangee([c1("ran", "RAN", "N2 · SCTP"), n("routeur", "Routeur", "reçoit l'IP en BGP", { largeur: 170 }), n("svclb", "Service LoadBalancer", "IP annoncée par MetalLB", { largeur: 210, ton: "chaud" }), n("amf", "Pods AMF", "SCTP 38412", { largeur: 140, ton: "ok" })], { x: 20, y: 70, gap: 60 });
  const http = rangee([c1("web", "Client", "HTTPS"), n("ing", "Ingress ou Route", "HTTP, HTTPS, TLS", { largeur: 170 }), n("svc", "Service ClusterIP", "répartit", { largeur: 210 }), n("pw", "Pods web", "répliqués", { largeur: 140, ton: "ok" })], { x: 20, y: 210, gap: 60 });
  const dansCluster = [l4[2], l4[3], http[2], http[3]];
  fiche(
    "lb-services",
    diagramme({
      legende: "Deux chemins vers les pods : L4 (SCTP) avec MetalLB, HTTP avec Ingress",
      zones: [zone("cluster", "Cluster", dansCluster, "chaud")],
      noeuds: [...l4, ...http],
      liens: [
        ["ran", "routeur", "SCTP"],
        ["routeur", "svclb", "BGP"],
        ["svclb", "amf", "répartit"],
        ["web", "ing", "HTTPS"],
        ["ing", "svc", "route"],
        ["svc", "pw", "répartit"],
      ],
    }),
  );
}

// 15. Du chiffrage par équipement au coût par SLO
{
  const a = rangee([n("sli", "SLI", "taux de requêtes réussies"), n("slo", "SLO", "99,9 % sur 30 jours", { ton: "chaud" }), n("budget", "Budget d'erreur", "43 min par mois", { ton: "ok" })], { x: 20, y: 60, gap: 70 });
  const b = rangee([n("archi", "Architecture", "réplicas, sites"), n("cout", "Coût", "par niveau de service", { ton: "chaud" })], { y: 200, gap: 56 });
  centrer(b, "archi", a[1].x + a[1].w / 2);
  fiche(
    "chiffrage-slo",
    diagramme({
      legende: "Chiffrer un niveau de service : de l'indicateur au coût de l'architecture",
      noeuds: [...a, ...b],
      liens: [
        ["sli", "slo", "mesure"],
        ["slo", "budget", "tolère"],
        ["slo", "archi", "impose"],
        ["archi", "cout", "FinOps"],
      ],
    }),
  );
}

// 16. Plateforme comme produit interne
{
  const users = colonne([n("exp", "Exploitation", "libre-service"), n("dev", "Développement", "libre-service")], { x: 36, y: 90, gap: 60 });
  const portail = rangee([n("portail", "Portail", "catalogue de capacités", { ton: "chaud" })], { x: 240, y: 120 });
  const eq = colonne([n("gab", "Gabarits", "chemins balisés"), n("ops", "Opérateurs", "exploitation automatisée"), n("feuille", "Feuille de route", "adoption, retours", { ton: "froid" })], { x: 480, y: 70, gap: 20, w: 200 });
  const cl = rangee([n("cluster", "Plateformes", "Kubernetes", { ton: "ok", largeur: 130 })], { x: 480 + 200 + 56, y: 120 });
  fiche(
    "plateforme-produit",
    diagramme({
      legende: "La plateforme comme produit : un portail, des gabarits, une équipe qui écoute ses utilisateurs",
      zones: [zone("users", "Équipes utilisatrices", users), zone("plateforme", "Équipe plateforme", eq, "chaud")],
      noeuds: [...users, ...portail, ...eq, ...cl],
      liens: [
        ["exp", "portail", "demande"],
        ["dev", "portail", "demande"],
        ["portail", "gab", "applique"],
        ["gab", "cluster", "déploie"],
        ["ops", "cluster", "exploite"],
      ],
    }),
  );
}

console.log("Lot 1 : 16 diagrammes dessinés.");
void decaler;
