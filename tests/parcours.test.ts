import { describe, expect, it } from "vitest";
import { chargerContenu } from "@/contenu/charger";
import { competenceFaite, cumulerEffets, etatsEtapes, fermeture, prochaineEtape, recombiner, restantPour, type CompetenceGraphe, type QuestionLite } from "@/lib/parcours";

const g = (id: string, domaine: string, prerequis: string[] = [], niveau: CompetenceGraphe["niveau"] = "intermediaire", fiches: string[] = []): CompetenceGraphe => ({
  id, titre: `Titre ${id}`, domaine, niveau, prerequis, fiches,
});
const graphe = [
  g("a", "x", [], "fondamental"),
  g("b", "x", ["a"]),
  g("c", "x", ["b"], "avance"),
  g("d", "y", ["a"]),
  g("e", "y", ["d"], "avance"),
  g("f", "z", []),
];
const questions: QuestionLite[] = [
  { id: "q1", texte: "?", options: [
    { id: "x", libelle: "X", raison: "métier X", effets: { domaines: { x: 2 } } },
    { id: "y", libelle: "Y", raison: "métier Y", effets: { domaines: { y: 1 }, cible: ["c"] } },
  ] },
  { id: "q2", texte: "?", options: [
    { id: "sait", libelle: "sait", raison: "", effets: { acquis: ["b"] } },
    { id: "ecarte", libelle: "écarte", raison: "", effets: { ecarte: ["f", "d"] } },
  ] },
];
const ids = (l: { id: string }[]) => l.map((e) => e.id);

describe("recombiner", () => {
  it("sans réponse : la feuille de route complète, dans l'ordre des prérequis", () => {
    const f = recombiner(graphe, questions, {});
    expect(f.complete).toBe(true);
    expect(new Set(ids(f.etapes))).toEqual(new Set(["a", "b", "c", "d", "e", "f"]));
    const pos = Object.fromEntries(ids(f.etapes).map((id, i) => [id, i]));
    expect(pos.a).toBeLessThan(pos.b);
    expect(pos.b).toBeLessThan(pos.c);
    expect(pos.d).toBeLessThan(pos.e);
  });

  it("un domaine de poids 2 garde tout le domaine, un poids 1 écarte l'avancé", () => {
    expect(ids(recombiner(graphe, questions, { q1: "x" }).etapes).sort()).toEqual(["a", "b", "c"]);
    // y : poids 1 → d (intermédiaire) mais pas e (avancé) ; la cible c amène b et a
    expect(ids(recombiner(graphe, questions, { q1: "y" }).etapes).sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("une cible amène ses prérequis, ceux-ci passent avant", () => {
    const f = recombiner(graphe, questions, { q1: "y" });
    expect(ids(f.etapes).indexOf("c")).toBeGreaterThan(ids(f.etapes).indexOf("b"));
    expect(f.etapes.find((e) => e.id === "c")?.cible).toBe(true);
  });

  it("l'acquis retire la compétence et ses prérequis", () => {
    const f = recombiner(graphe, questions, { q1: "x", q2: "sait" });
    expect(ids(f.etapes)).toEqual(["c"]);
    expect(new Set(f.acquises)).toEqual(new Set(["a", "b"]));
  });

  it("une compétence écartée ne figure pas, mais ses dépendants restent", () => {
    const f = recombiner(graphe, questions, { q1: "y", q2: "ecarte" });
    expect(ids(f.etapes)).not.toContain("d");
    expect(f.ecartees).toContain("d");
  });

  it("chaque étape dit pourquoi elle est là", () => {
    const f = recombiner(graphe, questions, { q1: "x" }, { x: "Domaine X" });
    expect(f.etapes.find((e) => e.id === "b")?.pourquoi).toBe("Domaine X : métier X");
    const g2 = recombiner(graphe, questions, { q1: "y" });
    expect(g2.etapes.find((e) => e.id === "a")?.pourquoi).toContain("prérequis de");
    expect(g2.etapes.find((e) => e.id === "c")?.pourquoi).toBe("votre objectif");
  });

  it("les compétences hors parcours sont listées", () => {
    expect(recombiner(graphe, questions, { q1: "x" }).hors.sort()).toEqual(["d", "e", "f"]);
  });

  it("ignore une réponse inconnue", () => {
    expect(cumulerEffets(questions, { q1: "inconnu" }).repondu).toBe(false);
  });

  it("fermeture : prérequis directs et indirects", () => {
    const parId = new Map(graphe.map((c) => [c.id, c]));
    expect([...fermeture(["e"], parId)].sort()).toEqual(["a", "d", "e"]);
  });
});

describe("avancement", () => {
  const avec = (fiches: string[]) => [{ ...g("p", "x", [], "intermediaire", fiches) }];
  it("faite si maîtrisée, ou si toutes ses fiches sont vérifiées", () => {
    const e = { id: "p", fiches: ["f1", "f2"] };
    expect(competenceFaite(e, { maitrisees: [], fiches: {} })).toBe(false);
    expect(competenceFaite(e, { maitrisees: ["p"], fiches: {} })).toBe(true);
    expect(competenceFaite(e, { maitrisees: [], fiches: { f1: { verifie: "j" } } })).toBe(false);
    expect(competenceFaite(e, { maitrisees: [], fiches: { f1: { verifie: "j" }, f2: { verifie: "j" } } })).toBe(true);
    expect(competenceFaite({ id: "p", fiches: [] }, { maitrisees: [], fiches: {} })).toBe(false);
    void avec;
  });

  it("états, prochaine étape et chemin restant", () => {
    const f = recombiner(graphe, questions, { q1: "x" }); // a → b → c
    const vierge = { maitrisees: [], fiches: {} };
    expect(etatsEtapes(f, vierge)).toEqual({ a: "disponible", b: "a-venir", c: "a-venir" });
    expect(prochaineEtape(f, vierge)?.id).toBe("a");
    const apresA = { maitrisees: ["a"], fiches: {} };
    expect(etatsEtapes(f, apresA)).toEqual({ a: "faite", b: "disponible", c: "a-venir" });
    expect(prochaineEtape(f, apresA)?.id).toBe("b");
    expect(ids(restantPour("c", f, apresA))).toEqual(["b", "c"]);
    expect(prochaineEtape(f, { maitrisees: ["a", "b", "c"], fiches: {} })).toBeNull();
  });
});

describe("contenu réel", () => {
  const c = chargerContenu();
  const fichesDe = new Map<string, string[]>();
  for (const f of c.fiches) for (const id of f.competences) fichesDe.set(id, [...(fichesDe.get(id) ?? []), f.id]);
  const graphe2: CompetenceGraphe[] = c.competences.map((x) => ({ id: x.id, titre: x.titre, domaine: x.domaine, niveau: x.niveau, prerequis: x.prerequis, fiches: fichesDe.get(x.id) ?? [] }));

  it("sans réponse, la feuille de route reprend toutes les compétences", () => {
    expect(recombiner(graphe2, c.orientation.questions, {}).etapes.length).toBe(graphe2.length);
  });

  it("chaque combinaison de la première question donne une feuille de route plus courte, valide, ordonnée", () => {
    for (const o of c.orientation.questions[0].options) {
      const f = recombiner(graphe2, c.orientation.questions, { [c.orientation.questions[0].id]: o.id });
      expect(f.etapes.length, o.id).toBeGreaterThan(5);
      expect(f.etapes.length, o.id).toBeLessThan(graphe2.length);
      const pos = new Map(f.etapes.map((e, i) => [e.id, i]));
      for (const e of f.etapes) for (const p of e.prerequis) expect(pos.get(p)!, `${p} avant ${e.id}`).toBeLessThan(pos.get(e.id)!);
    }
  });

  it("toutes les réponses d'un parcours type restent cohérentes", () => {
    const reponses = Object.fromEntries(c.orientation.questions.map((q) => [q.id, q.options[0].id]));
    const f = recombiner(graphe2, c.orientation.questions, reponses);
    expect(f.etapes.length).toBeGreaterThan(0);
    const dans = new Set(f.etapes.map((e) => e.id));
    expect(f.acquises.some((a) => dans.has(a))).toBe(false);
    expect(f.ecartees.some((a) => dans.has(a))).toBe(false);
  });
});
