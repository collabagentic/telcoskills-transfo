import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TelcoSkills · Transformation",
  description: "Votre métier télécom, version cloud natif : ce qui reste vrai, ce qui change, ce qui est nouveau.",
  robots: { index: false, follow: false }, // noindex tant que l'auteur n'a pas dit « on ouvre »
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
