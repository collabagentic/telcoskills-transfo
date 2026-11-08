# Direction de design — décisions validées par l'auteur (2026-11-08)

Ces décisions remplacent, pour le lot 1, la palette D3 et la typographie D4 de `BACKLOG.md` §E1-1 (Lexend, canevas clair).

- **Esprit** : épuré à la Apple, avec de la profondeur à la Linear. Pas de compteur sur l'accueil. Pas de « slop » : ni dégradé violet,
  ni glassmorphism, ni emoji décoratif.
- **Thème** : sombre par défaut (graphite `#08090b`), thème clair équivalent obligatoire (même profondeur par ombres douces superposées).
- **Lumière** : halo orange diffus en haut de page (opacité faible) sur une grille très fine qui s'estompe. Accent `#ff6a3d`, réservé aux
  actions, à « Après » et aux « réflexes à lâcher ».
- **Profondeur** : couches empilées ; filet clair d'1 px sur le bord haut de chaque surface, ombre profonde dessous. « Avant » en retrait
  (plus petit, atténué), « Après » au premier plan, chauffé par la lumière.
- **Typographie** : **Geist** (texte et titres) + **Geist Mono** (chiffres, code, identifiants). Pas de serif. Auto-hébergées (`next/font`).
- **Accueil** : une phrase qui fait la démonstration (« Votre ~~matrice de flux~~, version NetworkPolicy. », amorces qui tournent),
  un sélecteur de métier en pastille, un seul bouton orange.
- **Bilan** : tuiles sobres, chiffres en Geist Mono, sans compteur géant ; « réflexes à lâcher » garde sa bordure chaude (anti-flatterie).
- **Plan et fiche** : logique de cockpit e-learning (rail d'avancement fin, reprise toujours visible, vérification dans la page,
  colonne de lecture étroite), dessinée dans le même langage.
- **Animations** : entrée en couches ≤ 300 ms, coupées par `prefers-reduced-motion`.
