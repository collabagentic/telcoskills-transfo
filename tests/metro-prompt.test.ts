import { describe, expect, it } from "vitest";
import { ligneDe, ordreDomaine } from "@/lib/metro";
import { amorces, construirePrompt } from "@/lib/prompt";
import type { CompetenceGraphe } from "@/lib/parcours";

const c = (id: string, domaine: string, prerequis: string[] = [], fiches: string[] = []): CompetenceGraphe => ({ id, titre: `T ${id}`, domaine, niveau: "fondamental", prerequis, fiches });
const graphe = [c("r1", "reseau"), c("k1", "kube"), c("k2", "kube", ["k1", "r1"]), c("k3", "kube", ["k2"]), c("k4", "kube", ["k3"]), c("k5", "kube", ["k4"]), c("k6", "kube", ["k5"]), c("k7", "kube", ["k6"])];

describe("ligne de métro", () => {
  it("ordonne un domaine : un prérequis avant ce qui en dépend", () => {
    expect(ordreDomaine(graphe, "kube").map((x) => x.id)).toEqual(["k1", "k2", "k3", "k4", "k5", "k6", "k7"]);
  });

  it("resserre sur la station courante : 5 stations, reste compté de chaque côté", () => {
    const l = ligneDe(graphe, "k4", { maitrisees: [], fiches: {} })!;
    expect(l.stations.map((s) => s.id)).toEqual(["k2", "k3", "k4", "k5", "k6"]);
    expect([l.position, l.total, l.avant, l.apres]).toEqual([4, 7, 1, 1]);
    expect(l.stations.find((s) => s.id === "k4")!.etat).toBe("courante");
  });

  it("colle la fenêtre au bord de la ligne", () => {
    const l = ligneDe(graphe, "k1", { maitrisees: [], fiches: {} })!;
    expect(l.stations.map((s) => s.id)).toEqual(["k1", "k2", "k3", "k4", "k5"]);
    expect(l.avant).toBe(0);
  });

  it("marque les stations faites, et une correspondance vers un autre domaine", () => {
    const l = ligneDe(graphe, "k3", { maitrisees: ["k1"], fiches: {} })!;
    expect(l.stations.find((s) => s.id === "k1")!.etat).toBe("acquise");
    expect(l.stations.find((s) => s.id === "k2")!.correspondance?.id).toBe("r1");
    expect(l.stations.find((s) => s.id === "k3")!.correspondance).toBeNull();
  });

  it("la station courante se remplit quand sa fiche est acquise", () => {
    const g = [c("a", "d", [], ["f"]), c("b", "d", ["a"])];
    expect(ligneDe(g, "a", { maitrisees: [], fiches: { f: { acquis: "j" } } })!.stations[0].faite).toBe(true);
    expect(ligneDe(g, "a", { maitrisees: [], fiches: {} })!.stations[0].faite).toBe(false);
  });

  it("une compétence inconnue n'a pas de ligne", () => {
    expect(ligneDe(graphe, "x", { maitrisees: [], fiches: {} })).toBeNull();
  });
});

describe("prompt à copier", () => {
  const e = { categorie: "comprendre" as const, genre: "transposition" as const, avant: "load balancer (F5)", apres: "Service", resume: "Un Service répartit le trafic.", reflexe: "Le répartiteur est un équipement.", competences: ["Services", "Ingress"] };

  it("garde les blancs à compléter et le contenu de la fiche", () => {
    const p = construirePrompt(e);
    expect(p).toContain("[à compléter : votre métier]");
    expect(p).toContain("ex. load balancer (F5)");
    expect(p).toContain("Sujet : Service.");
    expect(p).toContain("Points à couvrir : Services ; Ingress.");
    expect(p).toContain("N'invente aucune commande");
  });

  it("change le format de réponse selon la catégorie", () => {
    expect(construirePrompt(e)).toContain("une analogie avec mon métier");
    expect(construirePrompt({ ...e, categorie: "decider" })).toContain("les critères de décision");
    expect(construirePrompt({ ...e, categorie: "diagnostiquer" })).toContain("les hypothèses");
  });

  it("une nouveauté n'a pas d'« avant » dans le gabarit", () => {
    expect(construirePrompt({ ...e, genre: "nouveaute", avant: null, reflexe: null })).not.toContain("ex. load balancer");
  });

  it("propose trois amorces courtes", () => {
    const a = amorces({ apres: "Service", change: ["Un Service suit les pods qui répondent."], piege: "Passer le SCTP par un Ingress. Il ne le transporte pas." });
    expect(a).toHaveLength(3);
    expect(a[1]).toContain("Passer le SCTP par un Ingress");
    expect(a[1]).not.toContain("Il ne le transporte pas");
  });
});

describe("correspondances", () => {
  it("n'en dessine que deux, les plus proches de la station courante", () => {
    const g = [c("r1", "reseau"), c("k1", "kube", ["r1"]), c("k2", "kube", ["r1"]), c("k3", "kube", ["r1"]), c("k4", "kube", ["r1"]), c("k5", "kube", ["r1"])];
    const l = ligneDe(g, "k3", { maitrisees: [], fiches: {} })!;
    expect(l.stations.filter((s) => s.correspondance).map((s) => s.id).sort()).toHaveLength(2);
    expect(l.stations.find((s) => s.id === "k3")!.correspondance).not.toBeNull();
  });
});
