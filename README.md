# Canvas Editor V3

Projet initialise a partir du starter officiel CE.SDK `showcase-advanced-ui`, puis realigne sur la cible validee `React 19.2 + Next.js 16.2`.

Stack UI additionnelle active :

- `shadcn 4.3.0`
- `tailwindcss 4.2.2`
- `eslint 10.2.0`

## Autorite de cadrage

Ordre d'autorite local :

1. `docs/codex-editor-reboot/SOURCE_OF_TRUTH.md`
2. `docs/codex-editor-reboot/EDITOR_AND_BINDING_SPEC.md`
3. `docs/codex-editor-reboot/TARGET_ARCHITECTURE.md`
4. `docs/codex-editor-reboot/MIGRATION_EXECUTION_PLAN.md`

Le projet `canvaeditor` est explicitement exclu.

## Point de depart retenu

- socle principal : repo officiel `imgly/cesdk-web-examples`
- starter retenu : `showcase-advanced-ui`
- references secondaires : `showcase-batch-image-generation`, `showcase-automated-resizing`
- reference produit officielle : `https://img.ly/showcases/cesdk/multi-image-generation/web`

## Demarrage

1. renseigner `NEXT_PUBLIC_LICENSE` dans `.env`
2. installer les dependances
3. lancer `npm run dev`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
