import next from "eslint-config-next";

// Config Next (inclut les règles react-hooks strictes de la version courante).
const config = [
  ...next,
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },
  // Le français est plein d'apostrophes : les échapper dans le JSX n'apporterait rien.
  { rules: { "react/no-unescaped-entities": "off" } },
];

export default config;
