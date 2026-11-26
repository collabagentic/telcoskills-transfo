import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/**
 * robots.txt, généré au build. Il autorise l'exploration et donne le plan du site ; tant que l'auteur n'a pas dit « on ouvre »,
 * chaque page porte encore la balise « noindex » (layout.tsx) : les moteurs la lisent et n'indexent rien.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE}/sitemap.xml` };
}
