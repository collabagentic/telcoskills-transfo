"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParcours } from "@/lib/stockage";

export type Entree = { t: string; h: string; k: string };

const sansAccent = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Barre de navigation permanente, avec une recherche (⌘K) sur les fiches, les compétences et les outils. */
export function BarreNavigation({ entrees }: { entrees: Entree[] }) {
  const parcours = useParcours();
  const commence = parcours !== null && Object.keys(parcours.reponses).length > 0;
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const champ = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const touche = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        champ.current?.focus();
      }
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, []);

  const resultats = useMemo(() => {
    const mots = sansAccent(q).split(/\s+/).filter(Boolean);
    if (mots.length === 0) return [];
    return entrees.filter((e) => mots.every((m) => sansAccent(e.t).includes(m))).slice(0, 8);
  }, [q, entrees]);

  const liens = [
    { label: "Ma feuille de route", href: commence ? "/cockpit" : "/roadmap" },
    { label: "Compétences", href: "/competences" },
    { label: "Le projet", href: "/projet" },
    { label: "Les outils", href: "/outils" },
  ];

  return (
    <header className="barre">
      <Link href="/" className="barre-logo">
        <span className="barre-marque" aria-hidden="true">
          T
        </span>
        TelcoSkills
      </Link>
      <nav className="barre-liens" aria-label="Sections">
        {liens.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="barre-recherche">
        <input
          ref={champ}
          type="search"
          placeholder="Rechercher…"
          aria-label="Rechercher une fiche, une compétence, un outil"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOuvert(true);
          }}
          onFocus={() => setOuvert(true)}
          onBlur={() => setTimeout(() => setOuvert(false), 150)}
        />
        <kbd>⌘K</kbd>
        {ouvert && q ? (
          <ul className="barre-resultats">
            {resultats.length === 0 ? <li className="barre-vide">Aucun résultat</li> : null}
            {resultats.map((r) => (
              <li key={r.h}>
                <Link href={r.h}>
                  <span className="barre-genre">{r.k}</span>
                  {r.t}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </header>
  );
}
