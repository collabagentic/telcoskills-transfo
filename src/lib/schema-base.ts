import { z } from "zod";

/** Date au jour (ISO, AAAA-MM-JJ). Les schémas de contenu complets arrivent au lot 2. */
export const dateJour = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date attendue au format AAAA-MM-JJ");
