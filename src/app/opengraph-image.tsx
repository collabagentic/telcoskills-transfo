import { ImageResponse } from "next/og";

/* Image de partage du site, générée au build. Couleurs reprises des jetons (sombre) : l'image est rendue hors CSS, d'où les valeurs écrites ici. */
export const alt = "TelcoSkills : vous connaissez déjà le télécom. Ce qui reste, ce qui change, ce qu'il faut apprendre pour le cloud natif.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const FOND = "#08090b";
const ENCRE = "#f4f3f0";
const ENCRE_2 = "#a8aab0";
const ACCENT = "#ff6a3d";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: FOND, color: ENCRE }}>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 600 }}>TelcoSkills</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Vous connaissez déjà le télécom.</div>
          <div style={{ display: "flex", fontSize: 36, color: ENCRE_2 }}>Ce qui reste, ce qui change, ce qu'il faut apprendre pour le cloud natif.</div>
        </div>
        <div style={{ display: "flex", width: 160, height: 8, background: ACCENT }} />
      </div>
    ),
    size,
  );
}
