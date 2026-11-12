// Lot 4 : les compétences techniques restantes. Les compétences réglementaires (reg-*) n'ont pas de schéma : un schéma juridique
// se rédige et se relit avec l'auteur, on n'invente pas de portée légale.
// Usage : node scripts/migration/diagrammes-lot4.mjs, puis les tests (règle 15).
import { n, rangee, zone, diagramme, flux, etoile, competence } from "./outils-diagramme.mjs";

const ok = { ton: "ok" };
const chaud = { ton: "chaud" };
const froid = { ton: "froid" };
const faible = { ton: "faible" };
const F = (o) => flux({ gap: 72, ...o });

competence("obs-dash", F({ legende: "Des tableaux de bord de plateforme et de fonctions réseau, alimentés par vos sources", noeuds: [n("src", "Sources de données", "Prometheus, Loki"), n("graf", "Grafana", "requêtes et panneaux", chaud), n("plat", "Tableau de plateforme", "nœuds, réseau, stockage"), n("cnf", "Tableau de la fonction", "indicateurs métier", ok)], etiquettes: ["lues par", "affiche", "et"], extra: [["graf", "cnf", undefined, { sortie: "d", entree: "g" }]] }));

// Télémétrie : de l'interrogation au flux continu
{
  const a = rangee([n("coll1", "Collecteur", "interroge à intervalle fixe"), n("snmp", "Équipement", "répond à chaque requête", faible)], { x: 36, y: 60, gap: 90 });
  const b = rangee([n("nf", "Fonction réseau", "pousse ses mesures", chaud), n("coll2", "Collecteur", "reçoit en continu"), n("stock", "Stockage", "série temporelle", ok)], { x: 36, y: 200, gap: 90 });
  competence(
    "obs-telemetry",
    diagramme({
      legende: "Du SNMP à la télémétrie en continu : on ne sonde plus, on reçoit",
      zones: [zone("avant", "Avant : SNMP", a), zone("apres", "Après : gRPC et OpenTelemetry", b, "chaud")],
      noeuds: [...a, ...b],
      liens: [["coll1", "snmp", "interroge"], ["nf", "coll2", "gRPC, OTLP"], ["coll2", "stock", "écrit"]],
    }),
  );
}

competence("linux", etoile({ legende: "Linux, base de tout le reste : quatre mécanismes que Kubernetes réutilise", centre: n("proc", "Processus Linux", "ce que fait tourner un conteneur", chaud), voisins: [{ cote: "h", noeud: n("systemd", "systemd", "démarre et supervise", froid), texte: "lance", sens: "depuis" }, { cote: "g", noeud: n("ns", "Namespaces", "vue isolée du système", froid), texte: "isolent", sens: "depuis" }, { cote: "d", noeud: n("cg", "cgroups", "limitent CPU et mémoire", froid), texte: "limitent", sens: "depuis" }, { cote: "b", noeud: n("sel", "SELinux", "confinement des accès", froid), texte: "confine", sens: "depuis" }] }));

competence("reseau-ip", F({ legende: "Du VLAN au tunnel : ce que le réseau d'une plateforme suppose", noeuds: [n("hote", "Hôte", "VLAN 10, 20"), n("sw", "Commutateur", "trunk 802.1Q", chaud), n("rout", "Routeur", "routage statique, BGP"), n("tun", "VPN ou tunnel", "IPsec, GRE"), n("site", "Site distant", "autre réseau", ok)], etiquettes: ["étiquette", "relie", "chiffre", "atteint"] }));

// Vocabulaire opérateur
{
  const ue = rangee([n("ue", "UE", "le terminal")], { x: 20, y: 90 });
  const plmn = rangee([n("gnb", "gNB", "station radio 5G"), n("nf", "NF", "fonction réseau du cœur", chaud)], { x: 250, y: 90, gap: 80 });
  const dn = rangee([n("dn", "DN", "réseau de données", ok)], { x: 730, y: 90 });
  competence(
    "tel-vocabulaire",
    diagramme({
      legende: "Les sigles dès le premier jour : UE, gNB, NF, PLMN, DN",
      zones: [zone("plmn", "PLMN : le réseau d'un opérateur", plmn)],
      noeuds: [...ue, ...plmn, ...dn],
      liens: [["ue", "gnb", "radio"], ["gnb", "nf", "N2, N3"], ["nf", "dn", "N6"]],
    }),
  );
}

competence("tel-exigences-continuite", etoile({ legende: "Ce que le métier exige d'un service télécom", centre: n("svc", "Service télécom", "disponible en continu", chaud), voisins: [{ cote: "h", noeud: n("dispo", "Disponibilité", "très élevée", froid), texte: "exige" }, { cote: "g", noeud: n("sess", "Continuité de session", "ne pas couper", froid), texte: "exige", sens: "depuis" }, { cote: "d", noeud: n("lat", "Latence", "du plan usager", froid), texte: "exige" }, { cote: "b", noeud: n("maint", "Maintenance", "sans interruption", froid), texte: "exige" }] }));

competence("dialogue-experts", F({ legende: "Dialoguer avec les experts réseau et les éditeurs : de la question au retour utile", noeuds: [n("besoin", "Besoin", "ce que vous cherchez à savoir"), n("q", "Question précise", "contexte, version, symptôme", chaud), n("fiche", "Fiche d'exigences", "lue ligne à ligne"), n("inc", "Incident formulé", "impact, traces, chronologie"), n("rep", "Réponse exploitable", "action ou décision", ok)], etiquettes: ["se formule en", "appelle", "alimente", "obtient"] }));

competence("adr", F({ legende: "Une décision d'architecture : contexte, options, décision, conséquences", noeuds: [n("ctx", "Contexte", "contraintes et besoins"), n("opt", "Options", "alternatives étudiées"), n("dec", "Décision", "choix et raison", chaud), n("cons", "Conséquences", "gains et compromis"), n("stat", "Statut", "accepté, remplacé", ok)], etiquettes: ["pose", "comparées dans", "entraîne", "porte"] }));

competence("simulation-ran-ue", F({ legende: "Exercer le cœur sans radio réelle : des simulateurs de terminal et de station", noeuds: [n("ue", "Simulateur d'UE", "terminaux virtuels"), n("gnb", "Simulateur de gNB", "radio simulée", chaud), n("core", "Cœur 5G sous test", "AMF, SMF, UPF"), n("res", "Résultats", "enregistrement, session, trafic", ok)], etiquettes: ["se connecte à", "N2, N3", "produit"] }));

competence("tests-fonctionnels", F({ legende: "Un plan de tests par procédure, automatisé et tracé", noeuds: [n("proc", "Procédure", "enregistrement, session"), n("cas", "Cas de test", "critère de réussite", chaud), n("auto", "Automatisation", "rejouable à chaque version"), n("res", "Résultat tracé", "preuve conservée"), n("couv", "Couverture", "ce qui reste non testé", ok)], etiquettes: ["se découpe en", "est scripté par", "produit", "mesure"] }));

competence("tests-perf", F({ legende: "Tester la performance : générer, mesurer, interpréter jusqu'à la saturation", noeuds: [n("gen", "Générateur de trafic", "montée en charge"), n("cnf", "Fonction sous test", "ressources fixées", chaud), n("mes", "Mesures", "débit, sessions/s, latence"), n("sat", "Point de saturation", "où ça casse", faible), n("lec", "Interprétation", "marge et dimensionnement", ok)], etiquettes: ["charge", "expose", "révèle", "conduit à"] }));

competence("tests-config", F({ legende: "Valider une configuration avant de la déployer", noeuds: [n("conf", "Configuration", "chart et valeurs"), n("lint", "Lint", "forme et conventions"), n("schema", "Validation de schéma", "types et champs"), n("contrat", "Tests de contrat", "comportement attendu", chaud), n("dep", "Déploiement", "si tout est vert", ok)], etiquettes: ["relue par", "puis", "puis", "autorise"] }));

competence("ansible-python", etoile({ legende: "Automatiser l'exploitation : un playbook, un inventaire, des rôles, des scripts", centre: n("pb", "Playbook Ansible", "décrit les tâches", chaud), voisins: [{ cote: "h", noeud: n("inv", "Inventaire", "quelles machines"), texte: "cible", sens: "depuis" }, { cote: "g", noeud: n("roles", "Rôles", "tâches réutilisables"), texte: "assemble", sens: "depuis" }, { cote: "d", noeud: n("noeuds", "Nœuds et cluster", "résultat appliqué", ok), texte: "applique" }, { cote: "b", noeud: n("py", "Script Python", "appelle les API", froid), texte: "complète", sens: "depuis" }] }));

console.log("Lot 4 : diagrammes dessinés.");
