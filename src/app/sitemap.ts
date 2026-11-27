import type { MetadataRoute } from "next";
import { chargerContenu } from "@/contenu/charger";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/** Plan du site, généré au build depuis le contenu : pages fixes, fiches (avec leur date de mise à jour) et compétences. */
export default function sitemap(): MetadataRoute.Sitemap {
  const c = chargerContenu();
  const fixes = ["", "/roadmap", "/competences", "/projet", "/outils", "/a-propos", "/sources-et-methode", "/contribuer", "/confidentialite", "/mentions-legales"];
  return [
    ...fixes.map((p) => ({ url: `${SITE}${p}` })),
    ...c.fiches.map((f) => ({ url: `${SITE}/fiche/${f.id}`, lastModified: f.misAJour })),
    ...c.competences.map((x) => ({ url: `${SITE}/competence/${x.id}` })),
  ];
}
