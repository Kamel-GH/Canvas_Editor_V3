# Codex Startup Prompt

Utiliser ce texte comme base dans une nouvelle session Codex du futur projet.

```md
Le projet est gouverne par les documents du dossier `docs/codex-editor-reboot/`.

Ordre d'autorite:
1. SOURCE_OF_TRUTH.md
2. EDITOR_AND_BINDING_SPEC.md
3. TARGET_ARCHITECTURE.md
4. DOMAIN_AND_DATA_MODEL.md
5. ACCEPTANCE_CRITERIA.md
6. MIGRATION_EXECUTION_PLAN.md
7. DECISION_LOG.md

References visuelles officielles:
- `docs/reference-ui/Ecran_Canvas_01.jpg` a `docs/reference-ui/Ecran_Canvas_16.jpg`
- `docs/reference-ui/UI_REFERENCE_INDEX.md`

References externes autorisees:
- depot public `imgly/cesdk-web-examples`
- demo web IMG.LY / CE.SDK `multi-image-generation`

Base de depart obligatoire:
- CE.SDK en React

Exclusion explicite:
- ne jamais reutiliser le projet local `canvaeditor`

Objectif prioritaire:
- construire un editeur canvas/layout avance
- integrer un systeme de binding/mapping de variables
- permettre la generation de documents personnalises

Strategie obligatoire:
- reprendre un maximum de code CE.SDK React utile pour etre operationnel vite
- migrer ensuite ce socle fonctionnalite par fonctionnalite
- valider chaque bloc avant de passer au suivant

Interdits:
- reutiliser le projet local `canvaeditor`
- ouvrir en priorite auth, candidats ou database management avant validation du noyau editoral
- ignorer les references visuelles officielles
- copier du code externe sans revue
- ouvrir plusieurs chantiers majeurs en parallele
```
