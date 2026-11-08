import type { NextConfig } from "next";

// Export statique : tout le contenu est lu au build, aucun serveur (BACKLOG.md §2, principe 7).
const config: NextConfig = {
  output: "export",
  reactStrictMode: true,
};

export default config;
