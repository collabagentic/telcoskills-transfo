# Tâches telcoskills-c2

## Découpage
1. Réaliser le périmètre de spec.md en **une seule PR**, sur une branche dédiée, depuis `main`.
2. Tests automatisés (Vitest) couvrant chaque critère d'acceptation quand c'est possible.

## Règles
- Avant de coder : lire `CLAUDE.md`, `AGENTS.md`, `DESIGN.md`, `BACKLOG.md` §2, §13, §14, `reports/audit-2026-11-21/plan-agents.md` (§2 « Règles communes »), et `node_modules/next/dist/docs/` avant toute API Next (installer les paquets avec `npm ci`).
- Le besoin et le périmètre sont ceux de spec.md, au commit figé. Ne pas les étendre. Les lots tournent l'un après l'autre : respecter la liste « Ne pas toucher ».
- S'arrêter et demander l'accord de l'opérateur avant : modifier le besoin ou le périmètre ; déployer en production ; supprimer de façon irréversible ; dépasser le budget (5 $ indicatif).
- Aucun push sur main, aucune fusion, aucun déploiement, aucun token.
- Rien d'inventé : pas de statistique, de contributeur ni de source imaginés. Ne réécris aucun texte de fiche. Français, vouvoiement, sans jargon.
- Avant de publier : `git status` et `git diff --stat` ; seuls les fichiers attendus sont modifiés (ni `out/`, ni `.next/`, ni `node_modules/`).
- Vérifier : `npm run lint`, `npm run types`, `npm test`, `npm run build` (équivalents : voir CLAUDE.md).
- Écrire le compte rendu (≤ 10 lignes : fait, fichiers, tests, **non testé**, limites) dans `reports/lots/telcoskills-c2.md`.

## Rapport obligatoire
La description de la PR contient « Mission telcoskills-c2 » et « Suivi : #<numéro de l'issue> », puis ce bloc, complété :

```cockpit-rapport
{"mission": "telcoskills-c2", "statut": "termine", "resume": "ce qui a été fait",
 "criteres": [{"id": "C2-C1", "statut": "conforme | non_conforme | non_verifie", "preuve": "test ou fichier"}],
 "questions_ouvertes": ["ce qui manquait et que tu n'as pas inventé"]}
```
(un élément par critère `C2-C*` de spec.md)

Pour une demande d'accord ou un blocage : "statut": "demande_accord" (avec "demande": {"type": "perimetre | production | suppression | budget", "justification": "…"}) ou "bloque".
