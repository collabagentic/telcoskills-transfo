// Lot 3 : des diagrammes pour le cœur 5G, l'exploitation, la sécurité, la livraison, la gouvernance et les fondations.
// Usage : node scripts/migration/diagrammes-lot3.mjs, puis les tests (règle 15).
import { n, rangee, colonne, centrer, zone, diagramme, flux, etoile, competence } from "./outils-diagramme.mjs";

const ok = { ton: "ok" };
const chaud = { ton: "chaud" };
const froid = { ton: "froid" };
const faible = { ton: "faible" };
const F = (o) => flux({ gap: 72, ...o });
const E = (o) => etoile(o);

// ───────────── Cœur 5G et fonctions réseau ─────────────

// Architecture 5G Core (SBA)
{
  const w = { largeur: 110 };
  const ue = rangee([n("ue", "UE", "terminal", { largeur: 90 })], { x: 20, y: 230 });
  const ran = rangee([n("ran", "RAN (gNB)", "radio", w)], { x: 170, y: 230 });
  const ra = rangee([n("nssf", "NSSF", "slices", w), n("ausf", "AUSF", "authentifie", w), n("udm", "UDM", "abonnés", w)], { x: 340, y: 70, gap: 24 });
  const rb = rangee([n("pcf", "PCF", "politiques", w), n("nrf", "NRF", "annuaire", { ...w, ...froid })], { x: 340, y: 150, gap: 24 });
  const rc = rangee([n("amf", "AMF", "accès, mobilité", { ...w, ...chaud }), n("smf", "SMF", "sessions", { ...w, ...chaud })], { x: 340, y: 230, gap: 24 });
  const upf = rangee([n("upf", "UPF", "plan usager", { ...w, ...chaud })], { x: 474, y: 360 });
  const dn = rangee([n("dn", "Réseau de données", "Internet, entreprise", { largeur: 180 })], { x: 640, y: 360 });
  competence(
    "5g-sba",
    diagramme({
      legende: "L'architecture 5G Core : des fonctions qui se parlent par le bus de services, un plan usager séparé",
      zones: [zone("sba", "Bus de services (SBA, HTTP/2)", [...ra, ...rb, ...rc])],
      noeuds: [...ue, ...ran, ...ra, ...rb, ...rc, ...upf, ...dn],
      liens: [["ue", "ran", "radio"], ["ran", "amf", "N2"], ["smf", "upf", "N4"], ["ran", "upf", "N3", { sortie: "b", entree: "g" }], ["upf", "dn", "N6"]],
    }),
  );
}

competence("cnf-onboarding", F({ legende: "Accueillir une fonction réseau : de l'exigence à la mise en production", noeuds: [n("ex", "Exigences", "réseau, CPU, stockage"), n("liv", "Livraison éditeur", "charts, images, doc"), n("rev", "Revue de réception", "contrôle des artefacts", chaud), n("lab", "Intégration en lab", "tests, non-régression"), n("qual", "Qualification", "critères d'acceptation"), n("prod", "Production", "déploiement par pipeline", ok)], etiquettes: ["cadrent", "arrive", "valide", "passe", "autorise"] }));

competence("cnf-ops", E({ legende: "Exploiter une fonction réseau : monter en charge, mettre à jour, résister aux pannes", centre: n("cnf", "Fonction réseau", "en production", chaud), voisins: [{ cote: "h", noeud: n("scale", "Scaling", "ajoute ou retire des pods"), texte: "charge" }, { cote: "g", noeud: n("upg", "Mise à jour", "sans coupure, retour possible"), texte: "version" }, { cote: "d", noeud: n("panne", "Panne", "sondes, redémarrage, bascule"), texte: "défaut" }, { cote: "b", noeud: n("sauv", "Données", "sauvegarde et restauration"), texte: "état" }] }));

competence("sec-5g", E({ legende: "Sécurité du cœur 5G : quatre protections qui se complètent", centre: n("core", "Cœur 5G", "fonctions et interfaces", chaud), voisins: [{ cote: "h", noeud: n("tls", "TLS entre fonctions", "chiffre les interfaces SBI", froid), texte: "protège", sens: "double" }, { cote: "g", noeud: n("oauth", "OAuth2", "jetons délivrés par le NRF", froid), texte: "autorise" }, { cote: "d", noeud: n("sepp", "SEPP", "protège l'interconnexion", froid), texte: "N32" }, { cote: "b", noeud: n("suci", "SUCI", "identité chiffrée de l'abonné", froid), texte: "cache" }] }));

competence("matrice-exigences", F({ legende: "De la fonction réseau aux ressources de la plateforme", noeuds: [n("nf", "Fonction réseau", "par éditeur", chaud), n("ex", "Exigences", "CPU, mémoire, interfaces"), n("mat", "Matrice d'exigences", "une ligne par fonction", chaud), n("plat", "Plateforme", "capacités disponibles"), n("ecart", "Écarts", "à combler ou à négocier", faible)], etiquettes: ["déclare", "alimentent", "comparée à", "révèle"] }));

competence("identifiants", F({ legende: "Les identités d'un abonné : permanente, chiffrée, temporaire", noeuds: [n("supi", "SUPI", "identité permanente"), n("suci", "SUCI", "SUPI chiffré, envoyé par radio", chaud), n("udm", "UDM", "retrouve le SUPI"), n("guti", "5G-GUTI", "identité temporaire", ok)], etiquettes: ["chiffré en", "déchiffré par", "attribue"], extra: [] }));

competence("sbi-http2", etoile({ legende: "Une interface de service : un client, un NRF, un fournisseur, en HTTP/2", centre: n("nrf", "NRF", "annuaire des services", froid), voisins: [{ cote: "g", noeud: n("cons", "Fonction cliente", "consomme un service"), texte: "découvre", sens: "double" }, { cote: "d", noeud: n("prod", "Fonction fournisseuse", "expose le service OpenAPI", chaud), texte: "s'enregistre", sens: "depuis" }] }));

competence("traces", F({ legende: "Lire un échange 5G : capturer, décoder, suivre la procédure", noeuds: [n("tap", "Point de capture", "interface N2, N4, SBI"), n("pcap", "Capture", "fichier pcap"), n("wire", "Wireshark", "décode NGAP, PFCP, HTTP/2", chaud), n("proc", "Procédure", "suite de messages"), n("cause", "Cause", "message en échec", faible)], etiquettes: ["enregistre", "ouvert dans", "reconstitue", "désigne"] }));

competence("amf", E({ legende: "L'AMF : terminaison de la signalisation du terminal et de la radio", centre: n("amf", "AMF", "accès et mobilité", chaud), voisins: [{ cote: "g", noeud: n("ran", "RAN (gNB)", "radio"), texte: "N2 · NGAP", sens: "double" }, { cote: "d", noeud: n("smf", "SMF", "sessions"), texte: "N11", sens: "double" }, { cote: "h", noeud: n("udm", "UDM", "abonnés"), texte: "N8" }, { cote: "b", noeud: n("ausf", "AUSF", "authentification"), texte: "N12" }] }));

competence("smf-upf", E({ legende: "La SMF pilote l'UPF : le plan de contrôle décide, le plan usager exécute", centre: n("upf", "UPF", "achemine le trafic", chaud), voisins: [{ cote: "h", noeud: n("smf", "SMF", "décide des règles"), texte: "N4 · PFCP", sens: "depuis" }, { cote: "g", noeud: n("ran", "RAN (gNB)", "radio"), texte: "N3 · GTP-U", sens: "double" }, { cote: "d", noeud: n("dn", "Réseau de données", "Internet, entreprise"), texte: "N6", sens: "double" }, { cote: "b", noeud: n("upf2", "Autre UPF", "chaînage"), texte: "N9", sens: "double" }] }));

competence("nrf-scp", E({ legende: "NRF et SCP : enregistrer, découvrir, router", centre: n("nrf", "NRF", "annuaire", froid), voisins: [{ cote: "g", noeud: n("prod", "Fonction fournisseuse", "s'enregistre"), texte: "enregistre", sens: "depuis" }, { cote: "d", noeud: n("cons", "Fonction cliente", "cherche un service"), texte: "découvre", sens: "double" }, { cote: "b", noeud: n("scp", "SCP", "route et équilibre", chaud), texte: "demande", sens: "depuis" }] }));

competence("enregistrement", F({ legende: "L'enregistrement d'un terminal : radio, AMF, authentification, abonné", noeuds: [n("ue", "Terminal", "envoie son SUCI"), n("ran", "RAN", "relaie"), n("amf", "AMF", "orchestre", chaud), n("ausf", "AUSF", "vérifie l'identité"), n("udm", "UDM", "fournit les clés"), n("ok", "Enregistré", "5G-GUTI attribué", ok)], etiquettes: ["N1", "N2", "N12", "N13", "accepte"] }));

competence("session-pdu", F({ legende: "L'établissement d'une session PDU : de la demande au chemin de données", noeuds: [n("ue", "Terminal", "demande une session"), n("amf", "AMF", "choisit une SMF"), n("smf", "SMF", "crée la session", chaud), n("pcf", "PCF", "fournit la politique"), n("upf", "UPF", "ouvre le chemin", chaud), n("data", "Session active", "trafic usager", ok)], etiquettes: ["N1", "N11", "N7", "N4", "établit"] }));

competence("udm-udr-ausf", F({ legende: "Authentifier un abonné : AUSF, UDM, UDR", noeuds: [n("amf", "AMF", "demande l'authentification"), n("ausf", "AUSF", "valide la preuve", chaud), n("udm", "UDM", "génère le vecteur"), n("udr", "UDR", "stocke les données abonné", froid)], etiquettes: ["N12", "N13", "Nudr"] }));

competence("pcf-chf", E({ legende: "La SMF consulte la PCF pour la politique et la CHF pour la facturation", centre: n("smf", "SMF", "session PDU", chaud), voisins: [{ cote: "g", noeud: n("pcf", "PCF", "QoS, règles de service"), texte: "N7 · politique", sens: "double" }, { cote: "d", noeud: n("chf", "CHF", "facturation convergente"), texte: "N40 · tarifs" }] }));

// Slicing
{
  const amf = rangee([n("amf", "AMF", "reçoit la demande", chaud)], { x: 20, y: 130 });
  const nssf = rangee([n("nssf", "NSSF", "choisit la slice", froid)], { x: 230, y: 130 });
  const s1 = rangee([n("smf1", "SMF eMBB", "haut débit"), n("upf1", "UPF eMBB", "capacité", ok)], { x: 440, y: 62, gap: 50 });
  const s2 = rangee([n("smf2", "SMF URLLC", "faible latence"), n("upf2", "UPF URLLC", "près du client", ok)], { x: 440, y: 212, gap: 50 });
  competence(
    "slicing",
    diagramme({
      legende: "Network slicing : le terminal demande une slice, le NSSF choisit les fonctions dédiées",
      zones: [zone("s1", "Slice 1 : S-NSSAI haut débit", s1), zone("s2", "Slice 2 : S-NSSAI faible latence", s2)],
      noeuds: [...amf, ...nssf, ...s1, ...s2],
      liens: [["amf", "nssf", "N22"], ["nssf", "smf1", "slice 1", { sortie: "d", entree: "g" }], ["nssf", "smf2", "slice 2", { sortie: "d", entree: "g" }], ["smf1", "upf1", "N4"], ["smf2", "upf2", "N4"]],
    }),
  );
}

// SEPP
{
  const a = rangee([n("nfa", "Cœur de l'opérateur A", "AMF, SMF, UDM", { largeur: 190 }), n("seppa", "SEPP A", "protège la sortie", { ...chaud, largeur: 130 })], { x: 36, y: 70, gap: 50 });
  const b = rangee([n("seppb", "SEPP B", "protège l'entrée", { ...chaud, largeur: 130 }), n("nfb", "Cœur de l'opérateur B", "AMF, SMF, UDM", { largeur: 190 })], { x: 490, y: 70, gap: 50 });
  competence(
    "sepp",
    diagramme({
      legende: "L'itinérance 5G : deux SEPP protègent l'interface N32 entre opérateurs",
      zones: [zone("a", "Opérateur A", a), zone("b", "Opérateur B", b)],
      noeuds: [...a, ...b],
      liens: [["nfa", "seppa", "SBI"], ["seppa", "seppb", "N32 · TLS", { sens: "double" }], ["seppb", "nfb", "SBI"]],
    }),
  );
}

// Interfonctionnement 4G/5G
{
  const epc = rangee([n("enb", "eNodeB", "radio 4G"), n("mme", "MME", "mobilité 4G"), n("pgw", "SMF + PGW-C", "sessions", chaud)], { x: 36, y: 70, gap: 50 });
  const c5 = rangee([n("gnb", "gNodeB", "radio 5G"), n("amf", "AMF", "mobilité 5G")], { x: 36, y: 230, gap: 80 });
  const upf = rangee([n("upf", "UPF + PGW-U", "plan usager", chaud)], { x: 560, y: 230 });
  competence(
    "interfonctionnement-4g",
    diagramme({
      legende: "4G et 5G ensemble : N26 entre MME et AMF, une SMF et une UPF communes",
      zones: [zone("epc", "Accès et cœur 4G", epc), zone("c5", "Accès et cœur 5G", c5)],
      noeuds: [...epc, ...c5, ...upf],
      liens: [["enb", "mme", "S1-MME"], ["mme", "pgw", "S5-C"], ["gnb", "amf", "N2"], ["mme", "amf", "N26", { sens: "double", sortie: "b", entree: "h" }], ["amf", "pgw", "N11", { sortie: "d", entree: "b" }], ["pgw", "upf", "Sx", { sortie: "d", entree: "h" }]],
    }),
  );
}

competence("ims-voix", F({ legende: "La voix sur 5G : le cœur 5G porte la session, l'IMS établit l'appel", noeuds: [n("ue", "Terminal", "VoNR"), n("pdu", "Session PDU", "DNN « ims »"), n("pcscf", "P-CSCF", "point d'entrée IMS", chaud), n("scscf", "S-CSCF", "enregistre et route"), n("tas", "Serveur d'applications", "services de voix")], etiquettes: ["ouvre", "atteint", "SIP", "SIP"] }));

competence("deploiement-lab", F({ legende: "Un cœur 5G open source en lab : du cluster au test", noeuds: [n("cl", "Cluster de lab", "kind ou Kubernetes"), n("helm", "Charts Helm", "cœur open source", chaud), n("core", "Cœur 5G", "AMF, SMF, UPF"), n("sim", "Simulateur RAN et UE", "génère du trafic"), n("test", "Test de bout en bout", "enregistrement, session", ok)], etiquettes: ["héberge", "déploie", "relié à", "valide"] }));

competence("kpi-5gc", F({ legende: "Des compteurs aux indicateurs : ce que mesure un cœur 5G", noeuds: [n("nf", "Fonctions", "AMF, SMF, UPF"), n("cpt", "Compteurs", "exposés par chaque fonction"), n("prom", "Prometheus", "collecte et stocke", chaud), n("kpi", "Indicateurs", "taux de succès, débit"), n("al", "Alertes", "sur les symptômes", ok)], etiquettes: ["émettent", "sont lus par", "calculent", "déclenchent"] }));

competence("procedures-5g-diagnostic", F({ legende: "Diagnostiquer : situer l'échec dans la suite des procédures", noeuds: [n("rep", "Enregistrement", "radio, AMF, AUSF"), n("auth", "Authentification", "UDM, clés"), n("sess", "Session PDU", "SMF, PCF, UPF"), n("data", "Trafic usager", "N3, N6", ok), n("echec", "Point d'échec", "la dernière étape réussie", faible)], etiquettes: ["puis", "puis", "puis", "sinon"], extra: [] }));

competence("recette", F({ legende: "La recette : du critère d'acceptation au rapport", noeuds: [n("crit", "Critères", "ce qui doit être vrai"), n("plan", "Plan de tests", "fonctionnels, performance"), n("exec", "Exécution", "en lab puis en site", chaud), n("rap", "Rapport", "résultats, écarts"), n("dec", "Décision", "accepté ou réserve", ok)], etiquettes: ["se traduisent en", "pilote", "produit", "conduit à"] }));

competence("multi-editeurs", E({ legende: "Plusieurs éditeurs, un même cœur : les interfaces 3GPP font le lien", centre: n("int", "Interfaces 3GPP", "N2, N4, SBI", chaud), voisins: [{ cote: "h", noeud: n("ea", "Éditeur A", "AMF"), texte: "conforme", sens: "double" }, { cote: "g", noeud: n("eb", "Éditeur B", "SMF"), texte: "conforme", sens: "double" }, { cote: "d", noeud: n("ec", "Éditeur C", "UPF"), texte: "conforme", sens: "double" }, { cote: "b", noeud: n("ed", "Intégrateur", "valide l'ensemble", ok), texte: "teste", sens: "depuis" }] }));

// ───────────── Exploitation et fiabilité ─────────────

// Haute disponibilité et géo-redondance
{
  const a = rangee([n("ea1", "etcd 1", "site A"), n("ea2", "etcd 2", "site A")], { x: 36, y: 70, gap: 40, w: 130 });
  const b = rangee([n("eb1", "etcd 3", "site B"), n("eb2", "etcd 4", "site B")], { x: 420, y: 70, gap: 40, w: 130 });
  const c = rangee([n("ec", "etcd 5", "site arbitre", froid)], { x: 280, y: 230, w: 140 });
  competence(
    "ha-geo",
    diagramme({
      legende: "Un quorum sur trois sites : la perte d'un site entier laisse la majorité",
      zones: [zone("sa", "Site A", a), zone("sb", "Site B", b), zone("sc", "Site arbitre", c, "froid")],
      noeuds: [...a, ...b, ...c],
      liens: [["ea2", "eb1", "réplication", { sens: "double" }], ["ec", "ea2", "vote", { style: "pointille", sortie: "h", entree: "b" }], ["ec", "eb1", "vote", { style: "pointille", sortie: "h", entree: "b" }]],
    }),
  );
}

competence("obs-metrics", F({ legende: "Métriques à grande échelle : Prometheus, Thanos, stockage objet", noeuds: [n("pods", "Pods", "exposent /metrics"), n("prom", "Prometheus", "scrape et règles", chaud), n("side", "Thanos Sidecar", "envoie les blocs"), n("obj", "Stockage objet", "historique long", froid), n("query", "Thanos Query", "interroge tout"), n("graf", "Grafana", "tableaux de bord", ok)], etiquettes: ["scrape", "bloc de 2 h", "écrit", "lit", "PromQL"] }));

competence("obs-logs", F({ legende: "Journaux centralisés : de la sortie du conteneur au tableau de bord", noeuds: [n("pods", "Pods", "écrivent sur stdout"), n("agent", "Agent par nœud", "DaemonSet", chaud), n("loki", "Loki", "indexe les labels seulement"), n("graf", "Grafana", "recherche, alertes", ok)], etiquettes: ["lus par", "envoie", "interroge"] }));

competence("pra-rpo-rto", F({ legende: "RPO et RTO : ce qu'on perd, combien de temps on attend", noeuds: [n("sauv", "Dernier point de reprise", "sauvegarde ou réplique"), n("inc", "Incident", "le service s'arrête", faible), n("reprise", "Reprise lancée", "décision, bascule"), n("ok", "Service rétabli", "données au dernier point", ok)], etiquettes: [["RPO : données perdues", { }], ["détection", { }], ["RTO : durée d'arrêt", { }]], gap: 100 }));

competence("observabilite-design", E({ legende: "Exploitable dès la conception : ce qu'une fonction doit exposer", centre: n("nf", "Fonction réseau", "conçue pour l'exploitation", chaud), voisins: [{ cote: "h", noeud: n("sondes", "Sondes", "vivante, prête", ok), texte: "santé" }, { cote: "g", noeud: n("metr", "Métriques", "compteurs ouverts", ok), texte: "mesure" }, { cote: "d", noeud: n("logs", "Journaux", "structurés, corrélés", ok), texte: "raconte" }, { cote: "b", noeud: n("tr", "Traces", "identifiant de trace", ok), texte: "suit" }] }));

competence("analyse-incident", F({ legende: "Analyser un incident : corréler, formuler, vérifier, corriger", noeuds: [n("al", "Alerte", "symptôme observé", faible), n("cor", "Corrélation", "métriques, journaux, traces", chaud), n("hyp", "Hypothèse", "cause probable"), n("rc", "Cause racine", "vérifiée par un test"), n("fix", "Correction", "et prévention", ok)], etiquettes: ["ouvre", "mène à", "est testée", "justifie"] }));

// Résilience d'une fonction réseau
{
  const pods = colonne([n("p1", "Pod 1", "sans état local"), n("p2", "Pod 2", "sans état local"), n("p3", "Pod 3", "sans état local")], { x: 280, y: 70, gap: 20, w: 170 });
  const lb = rangee([n("svc", "Service", "répartit les requêtes", chaud)], { x: 20, y: 130 });
  const etat = rangee([n("db", "État externe", "base répliquée", { ton: "froid", forme: "base" })], { x: 590, y: 130 });
  competence(
    "resilience-nf",
    diagramme({
      legende: "Résilience : des pods interchangeables, l'état dans un stockage répliqué",
      zones: [zone("nf", "Fonction réseau", pods)],
      noeuds: [...lb, ...pods, ...etat],
      liens: [["svc", "p1"], ["svc", "p2"], ["svc", "p3"], ["p1", "db", "lit et écrit", { sortie: "d", entree: "g" }], ["p2", "db", undefined, { sortie: "d", entree: "g" }], ["p3", "db", undefined, { sortie: "d", entree: "g" }]],
    }),
  );
}

competence("upgrade-nf", F({ legende: "Mettre à jour sans coupure : une version, puis l'autre, avec retour possible", noeuds: [n("v1", "Version 1", "3 pods en service"), n("canary", "Pod de la version 2", "reçoit un peu de trafic", chaud), n("sondes", "Sondes", "prêt ou en échec"), n("mont", "Montée progressive", "un pod à la fois"), n("v2", "Version 2", "3 pods en service", ok)], etiquettes: ["ajoute", "contrôlent", "valident", "remplace"], extra: [["sondes", "v1", "échec : retour", { style: "pointille", sortie: "h", entree: "h" }]] }));

competence("incident-astreinte", F({ legende: "L'astreinte : de l'alerte à l'escalade", noeuds: [n("al", "Alerte", "regroupée, utile", faible), n("n1", "Niveau 1", "runbook, premier avis"), n("n2", "Niveau 2", "analyse approfondie", chaud), n("n3", "Niveau 3", "ingénierie, éditeur"), n("clot", "Clôture", "retour d'expérience", ok)], etiquettes: ["notifie", "escalade", "escalade", "résout"] }));

competence("alerting-utile", F({ legende: "Alerter sur ce que vit l'utilisateur, pas sur chaque cause", noeuds: [n("cause", "Causes possibles", "dizaines de règles", faible), n("sympt", "Symptôme", "taux d'erreurs vu de l'utilisateur", chaud), n("alerte", "Une alerte", "regroupée, avec contexte"), n("act", "Action", "runbook ou escalade", ok)], etiquettes: ["se résument en", "déclenche", "mène à"] }));

competence("sondes", F({ legende: "Des sondes de bout en bout : vérifier le service comme le client le vit", noeuds: [n("sonde", "Sonde synthétique", "joue un scénario client", chaud), n("svc", "Service sous test", "N2, N3, DNS"), n("mes", "Mesure", "disponibilité, latence"), n("alerte", "Alerte", "si le scénario échoue", faible)], etiquettes: ["appelle", "répond à", "dépasse le seuil"] }));

competence("niveaux-support", F({ legende: "Les niveaux de support : chacun traite ce qu'il maîtrise, puis escalade", noeuds: [n("n1", "N1", "supervision, runbooks"), n("n2", "N2", "analyse, configuration", chaud), n("n3", "N3", "ingénierie, correctifs"), n("edit", "Éditeur", "défaut logiciel", froid)], etiquettes: ["escalade", "escalade", "ouvre un ticket"] }));

competence("runbooks", F({ legende: "Du runbook à l'automatisation : documenter, scripter, déclencher seul", noeuds: [n("al", "Alerte", "porte le lien du runbook", faible), n("run", "Runbook", "étapes de remédiation"), n("auto", "Automatisation", "Ansible, opérateur", chaud), n("verif", "Vérification", "le symptôme a disparu", ok)], etiquettes: ["pointe vers", "devient", "confirme"] }));

competence("postmortem", F({ legende: "L'analyse sans blâme : de l'incident aux actions qui s'ensuivent", noeuds: [n("inc", "Incident", "résolu", faible), n("chrono", "Chronologie", "faits, sans jugement"), n("causes", "Causes", "techniques et organisationnelles", chaud), n("act", "Actions", "responsable et date"), n("part", "Partage", "toute l'équipe apprend", ok)], etiquettes: ["reconstitue", "explique", "décident", "publie"] }));

competence("chaos", F({ legende: "Tester la résilience : une hypothèse, une panne provoquée, une observation", noeuds: [n("hyp", "Hypothèse", "le service tient sans ce pod"), n("inj", "Panne provoquée", "pod tué, réseau coupé", faible), n("obs", "Observation", "métriques, sondes", chaud), n("app", "Apprentissage", "corriger ou confirmer", ok)], etiquettes: ["testée par", "mesurée par", "mène à"] }));

competence("capacite", F({ legende: "Planifier la capacité : mesurer, prévoir, commander avant la saturation", noeuds: [n("mes", "Mesure", "usage réel, tendances"), n("prev", "Prévision", "croissance attendue", chaud), n("seuil", "Seuil", "marge à ne pas franchir"), n("cmd", "Ajout de nœuds", "commandé à temps", ok)], etiquettes: ["nourrit", "comparée au", "déclenche"] }));

// ───────────── Sécurité ─────────────

// Durcissement
{
  const noeud = rangee([n("selinux", "SELinux", "confine les processus"), n("noyau", "Noyau et système", "réduit, à jour"), n("acces", "Accès au nœud", "SSH limité", faible)], { x: 36, y: 60, gap: 40 });
  const cluster = rangee([n("rbac", "RBAC", "moindre privilège"), n("psa", "Pod Security Admission", "baseline, restricted"), n("audit", "Audit de l'API", "qui a fait quoi")], { x: 36, y: 200, gap: 40 });
  const pod = rangee([n("nonroot", "Utilisateur non root", "pas d'élévation"), n("caps", "Capacités", "retirées par défaut"), n("fs", "Système en lecture seule", "écritures limitées")], { x: 36, y: 340, gap: 40 });
  competence(
    "sec-durcissement",
    diagramme({
      legende: "Durcir en trois couches : le nœud, le cluster, le pod",
      zones: [zone("noeud", "Nœud", noeud), zone("cluster", "Cluster", cluster, "froid"), zone("pod", "Pod", pod, "chaud")],
      noeuds: [...noeud, ...cluster, ...pod],
      liens: [["noyau", "psa", "porte", { sortie: "b", entree: "h" }], ["psa", "caps", "impose", { sortie: "b", entree: "h" }]],
    }),
  );
}

// Segmentation réseau
{
  const sources = colonne([n("ok", "Pods autorisés", "bon label", ok), n("ko", "Autres pods", "sans label", faible)], { x: 20, y: 70, gap: 40, w: 150 });
  const regles = colonne([n("allow", "Règle explicite", "par labels et port", chaud), n("deny", "Default deny", "tout refusé en entrée", froid)], { x: 300, y: 70, gap: 40, w: 190 });
  const cible = rangee([n("cible", "Pods protégés", "namespace dédié", ok)], { x: 600, y: 118 });
  competence(
    "sec-reseau",
    diagramme({
      legende: "Segmenter : tout refuser d'abord, autoriser ensuite flux par flux",
      zones: [zone("ns", "Namespace protégé", [...regles, ...cible], "chaud")],
      noeuds: [...sources, ...regles, ...cible],
      liens: [["ok", "allow", "autorisé"], ["ko", "deny", "refusé", { style: "pointille" }], ["allow", "cible", "ouvre"], ["deny", "cible", "protège", { style: "pointille" }]],
    }),
  );
}

competence("sec-supply", F({ legende: "La chaîne d'approvisionnement : du code au pod, chaque étape se vérifie", noeuds: [n("src", "Code source", "revue, branche protégée"), n("build", "Build reproductible", "dépendances épinglées", chaud), n("sbom", "SBOM et signature", "contenu et origine"), n("reg", "Registre", "images signées"), n("adm", "Admission", "refuse l'image non signée", froid), n("pod", "Pod", "image par digest", ok)], etiquettes: ["construit", "produit", "publie", "vérifie", "autorise"] }));

// Secrets et PKI
{
  const secrets = rangee([n("coffre", "Coffre", "Vault, OpenBao", chaud), n("eso", "External Secrets", "synchronise", { largeur: 150 }), n("secret", "Secret Kubernetes", "chiffré au repos")], { x: 20, y: 40, gap: 60 });
  const pki = rangee([n("ca", "Autorité", "interne ou ACME", chaud), n("cm", "cert-manager", "émet et renouvelle", { largeur: 150 }), n("cert", "Certificat TLS", "durée courte", froid)], { x: 20, y: 210, gap: 60 });
  const pod = rangee([n("pod", "Pod", "monte les deux", ok)], { x: secretsFin(), y: 125 });
  function secretsFin() {
    return 20 + 140 + 60 + 150 + 60 + 190 + 90;
  }
  competence(
    "sec-secrets",
    diagramme({
      legende: "Secrets et certificats : les secrets vivent dans un coffre, les certificats se renouvellent seuls",
      noeuds: [...secrets, ...pki, ...pod],
      liens: [["coffre", "eso", "lit"], ["eso", "secret", "crée"], ["ca", "cm", "signe"], ["cm", "cert", "émet"], ["secret", "pod", "monté", { sortie: "d", entree: "g" }], ["cert", "pod", "monté", { sortie: "d", entree: "g" }]],
    }),
  );
}

competence("sec-sba", F({ legende: "Sécuriser le bus de services : TLS mutuel et jeton OAuth2", noeuds: [n("cons", "Fonction cliente", "veut un service"), n("nrf", "NRF", "délivre un jeton", chaud), n("jeton", "Jeton OAuth2", "portée et durée limitées"), n("prod", "Fonction fournisseuse", "vérifie le jeton", ok)], etiquettes: ["demande", "émet", "présenté à"], extra: [["cons", "prod", "TLS mutuel", { style: "pointille", sortie: "b", entree: "b" }]] }));

competence("sec-plateforme", E({ legende: "Isoler une fonction réseau sur la plateforme", centre: n("pod", "Pod de la fonction", "privilèges minimaux", chaud), voisins: [{ cote: "h", noeud: n("ns", "Namespace dédié", "une équipe, un périmètre", froid), texte: "contient", sens: "depuis" }, { cote: "g", noeud: n("scc", "Contrainte de sécurité", "SCC restreinte", froid), texte: "limite", sens: "depuis" }, { cote: "d", noeud: n("np", "NetworkPolicy", "flux déclarés", froid), texte: "filtre", sens: "depuis" }, { cote: "b", noeud: n("sel", "SELinux", "confinement", froid), texte: "confine", sens: "depuis" }] }));

competence("sec-detection", F({ legende: "Détecter : journaliser, collecter, corréler, alerter", noeuds: [n("src", "Sources", "audit de l'API, hôtes, réseau"), n("coll", "Collecte", "agents, transfert sûr"), n("siem", "SIEM", "centralise et corrèle", chaud), n("regle", "Règles de détection", "comportements anormaux"), n("al", "Alerte", "vers l'équipe sécurité", faible)], etiquettes: ["émettent", "envoie", "appliquent", "déclenchent"] }));

competence("gestion-vulns", F({ legende: "Gérer les vulnérabilités : scanner, trier, corriger, redéployer", noeuds: [n("scan", "Analyse", "images et nœuds"), n("rap", "Rapport", "failles connues"), n("prio", "Priorisation", "exposition et gravité", chaud), n("fix", "Correctif", "image reconstruite"), n("dep", "Redéploiement", "par pipeline", ok)], etiquettes: ["produit", "classée par", "décide", "livré par"] }));

// ───────────── Livraison et automatisation ─────────────

competence("helm-cnf", F({ legende: "Packager une fonction réseau : un chart, des sous-charts, des valeurs par environnement", noeuds: [n("chart", "Chart de la fonction", "templates, valeurs par défaut", chaud), n("sub", "Sous-charts", "base de données, configuration"), n("env", "Valeurs d'environnement", "lab, préproduction, production"), n("rel", "Release", "installée et suivie", ok)], etiquettes: ["dépend de", "surchargées par", "produit"] }));

competence("etsi-sol", F({ legende: "Le cycle de vie selon ETSI : du paquet à l'instance", noeuds: [n("pkg", "Paquet de la fonction", "descripteur, artefacts"), n("nfvo", "NFVO", "intègre au catalogue", chaud), n("vnfm", "VNFM", "pilote l'instance"), n("inst", "Instance", "instanciée, mise à l'échelle", ok)], etiquettes: ["onboarding", "délègue", "instancie"] }));

competence("onboarding-editeur", F({ legende: "Accueillir un éditeur : de l'exigence à la qualification", noeuds: [n("ex", "Exigences", "formats de livraison"), n("liv", "Livraison", "charts, images, doc"), n("ctrl", "Contrôle de réception", "conformité aux exigences", chaud), n("int", "Intégration", "tests dans votre lab"), n("qual", "Qualification", "accord de mise en service", ok)], etiquettes: ["cadrent", "est contrôlée", "si conforme", "valide"] }));

competence("dossier-integration", F({ legende: "Le dossier d'intégration : de l'architecture à la procédure", noeuds: [n("sch", "Schémas", "architecture, réseaux"), n("flux", "Matrice de flux", "qui parle à qui"), n("ip", "Plan d'adressage", "VLAN, sous-réseaux"), n("proc", "Procédures", "installation, mise à jour"), n("liv", "Dossier livré", "relu et versionné", ok)], etiquettes: ["détaillent", "s'appuient sur", "décrivent", "assemblés en"] }));

competence("ci-cd-integration", F({ legende: "CI/CD d'intégration : chaque version passe par les mêmes tests", noeuds: [n("git", "Dépôt", "charts et configuration"), n("ci", "Pipeline CI", "contrôles, build", chaud), n("lab", "Déploiement en lab", "environnement jetable"), n("test", "Non-régression", "tests de bout en bout"), n("promo", "Promotion", "vers l'environnement suivant", ok)], etiquettes: ["déclenche", "déploie", "lance", "si vert"] }));

competence("lab-as-code", F({ legende: "Un laboratoire reproductible : tout se recrée depuis le dépôt", noeuds: [n("git", "Dépôt", "charts, scripts, jeux de tests"), n("kind", "Cluster éphémère", "kind", chaud), n("deploy", "Déploiement", "charts de la plateforme"), n("tests", "Tests", "scénarios automatisés"), n("detr", "Destruction", "rien ne traîne", faible)], etiquettes: ["crée", "installe", "exécute", "nettoie"] }));

// Développer un opérateur
{
  const crd = rangee([n("crd", "CRD", "définit un type d'objet", froid), n("cr", "Ressource personnalisée", "ce que l'utilisateur déclare", chaud)], { x: 36, y: 60, gap: 70 });
  const ctrl = rangee([n("rec", "Boucle reconcile", "écrite en Go", chaud), n("res", "Ressources créées", "Deployment, Service", ok)], { x: 36, y: 210, gap: 120 });
  centrer(ctrl, "rec", crd[1].x + crd[1].w / 2);
  competence(
    "operators-dev",
    diagramme({
      legende: "Développer un opérateur : un type d'objet, une boucle de réconciliation",
      zones: [zone("api", "API Kubernetes", crd), zone("operateur", "Opérateur", ctrl, "chaud")],
      noeuds: [...crd, ...ctrl],
      liens: [["crd", "cr", "décrit"], ["cr", "rec", "observe", { sortie: "b", entree: "h" }], ["rec", "res", "crée, met à jour"]],
    }),
  );
}

competence("gestion-changement", F({ legende: "Gérer le changement : demande, revue, fenêtre, retour d'expérience", noeuds: [n("dem", "Demande", "pull request"), n("rev", "Revue", "pairs, vérifications", chaud), n("fen", "Fenêtre", "quand l'appliquer"), n("exe", "Exécution", "par le pipeline"), n("ret", "Retour", "ce qui a marché", ok)], etiquettes: ["relue", "planifiée", "appliquée", "analysée"] }));

competence("config-nf", F({ legende: "Configurer une fonction par API : un modèle, un protocole, des datastores", noeuds: [n("outil", "Outil d'automatisation", "Ansible, pipeline"), n("mod", "Modèle YANG", "décrit la configuration", chaud), n("proto", "NETCONF ou RESTCONF", "protocole d'accès"), n("nf", "Fonction réseau", "candidate puis running", ok)], etiquettes: ["s'appuie sur", "transporte", "applique"] }));

competence("toil", F({ legende: "Réduire le toil : repérer, automatiser, mesurer le gain", noeuds: [n("toil", "Travail répétitif", "manuel, sans valeur durable", faible), n("mes", "Mesure", "temps passé par semaine"), n("auto", "Automatisation", "script, opérateur", chaud), n("gain", "Temps libéré", "pour l'ingénierie", ok)], etiquettes: ["se compte", "justifie", "libère"] }));

// ───────────── Gouvernance ─────────────

competence("hld-lld", F({ legende: "Du HLD au LLD : de la vision aux détails d'installation", noeuds: [n("hld", "HLD", "composants, choix, flux", chaud), n("lld", "LLD", "paramètres, ports, adresses"), n("ip", "Plan d'adressage", "VLAN, sous-réseaux"), n("proc", "Procédure d'installation", "exécutable par un autre", ok)], etiquettes: ["se détaille en", "fixe", "pilote"] }));

competence("evaluation-fournisseurs", F({ legende: "Comparer des fournisseurs : critères pondérés, preuve de concept, décision", noeuds: [n("crit", "Critères", "pondérés d'avance"), n("rep", "Réponses", "offres reçues"), n("poc", "Preuve de concept", "tests sur vos cas", chaud), n("note", "Notation", "grille et écarts"), n("dec", "Décision", "tracée et justifiée", ok)], etiquettes: ["servent à lire", "présélectionnées pour", "alimente", "conduit à"] }));

competence("cycle-vie-plateforme", F({ legende: "Le cycle de vie : suivre les versions avant la fin du support", noeuds: [n("nouv", "Nouvelle version", "annoncée"), n("qual", "Qualification", "en lab, sur vos fonctions", chaud), n("maj", "Mise à jour", "cluster par cluster"), n("fin", "Fin de support", "date à anticiper", faible)], etiquettes: ["testée", "si validée", "avant"] }));

competence("cout-energie", F({ legende: "Coût et énergie : mesurer ce que consomme un service", noeuds: [n("res", "Ressources", "CPU, mémoire, stockage"), n("conso", "Consommation", "puissance, charge"), n("cout", "Coût", "par service et par équipe", chaud), n("opt", "Optimisation", "dimensionnement, extinction", ok)], etiquettes: ["entraînent", "se traduit en", "oriente"] }));

// ───────────── Fondations ─────────────

competence("telco-101", F({ legende: "Le réseau mobile en une ligne : du terminal au service", noeuds: [n("ue", "Terminal", "téléphone, objet"), n("ran", "Accès radio", "antennes, gNB"), n("transport", "Transport", "fibre, routeurs"), n("core", "Cœur de réseau", "sessions, abonnés", chaud), n("svc", "Services", "Internet, voix", ok)], etiquettes: ["radio", "backhaul", "N2, N3", "N6"] }));

competence("tel-reseau-mobile", F({ legende: "Le réseau mobile en un schéma : abonné, radio, transport, cœur, services", cadre: { id: "operateur", titre: "Réseau de l'opérateur" }, noeuds: [n("ab", "Abonné", "terminal"), n("rad", "Radio", "accès"), n("tr", "Transport", "IP, MPLS"), n("co", "Cœur", "contrôle et données", chaud), n("sv", "Services", "voix, données", ok)], etiquettes: ["se connecte", "backhaul", "signalisation", "livre"] }));

competence("archi-5g", F({ legende: "L'architecture 5G : NG-RAN, 5GC, SBA", noeuds: [n("ue", "UE", "terminal"), n("ng", "NG-RAN", "gNB, radio"), n("cp", "5GC plan de contrôle", "fonctions en SBA", chaud), n("up", "5GC plan usager", "UPF"), n("dn", "Réseau de données", "Internet, entreprise", ok)], etiquettes: ["radio", "N2", "N4", "N6"], extra: [["ng", "up", "N3", { style: "pointille", sortie: "b", entree: "b" }]] }));

competence("tel-nf", F({ legende: "De la boîte au conteneur : trois générations de fonctions réseau", noeuds: [n("pnf", "PNF", "boîtier physique", faible), n("vnf", "VNF", "fonction en machine virtuelle"), n("cnf", "CNF", "fonction en conteneurs", chaud)], etiquettes: ["virtualisation", "conteneurisation"] }));

competence("git-ci", F({ legende: "Git et CI/CD : du commit à la livraison", noeuds: [n("git", "Dépôt Git", "historique et revue"), n("ci", "Intégration continue", "build et tests", chaud), n("art", "Artefacts", "images, charts"), n("cd", "Livraison continue", "déploiement piloté", ok)], etiquettes: ["déclenche", "produit", "alimente"] }));

competence("sre-slo", F({ legende: "Le SLI, le SLO et le budget d'erreur", noeuds: [n("sli", "SLI", "ce qu'on mesure"), n("slo", "SLO", "l'objectif visé", chaud), n("bud", "Budget d'erreur", "marge d'indisponibilité"), n("dec", "Décisions", "livrer ou stabiliser", ok)], etiquettes: ["alimente", "fixe", "guide"] }));

competence("conteneurs", E({ legende: "Un conteneur : un processus isolé par le noyau", centre: n("c", "Conteneur", "un processus, pas une VM", chaud), voisins: [{ cote: "h", noeud: n("ns", "Namespaces", "vue isolée du système", froid), texte: "isolent", sens: "depuis" }, { cote: "g", noeud: n("cg", "cgroups", "limitent CPU et mémoire", froid), texte: "limitent", sens: "depuis" }, { cote: "d", noeud: n("img", "Image en couches", "fichiers en lecture seule", ok), texte: "démarre depuis", sens: "depuis" }, { cote: "b", noeud: n("rt", "Runtime", "CRI-O, containerd"), texte: "lance" }] }));

console.log("Lot 3 : diagrammes dessinés.");
void colonne;
