# Codex Editor Reboot

Ce dossier contient le pack de cadrage du projet `Canvas_Editor_V3`.

Le projet doit repartir du code de reference CE.SDK en React et des references UI officielles, sans reutiliser le projet local `canvaeditor`.

Ordre de lecture recommande:

1. `SOURCE_OF_TRUTH.md`
2. `EDITOR_PRODUCT_SPEC.md`
3. `EDITOR_AND_BINDING_SPEC.md`
4. `REFERENCE_ANALYSIS.md`
5. `TARGET_ARCHITECTURE.md`
6. `DOMAIN_AND_DATA_MODEL.md`
7. `IMPLEMENTATION_PHASES.md`
8. `ACCEPTANCE_CRITERIA.md`
9. `MIGRATION_EXECUTION_PLAN.md`
10. `DECISION_LOG.md`
11. `CODEX_STARTUP_PROMPT.md`
12. `NEW_PROJECT_BOOTSTRAP.md`

Objectif du pack:

- fixer les decisions produit et techniques prises dans cette conversation
- encadrer la reprise du code CE.SDK React sans copie aveugle
- decrire precisement l'editeur cible, les modules de binding et les futures extensions
- donner un mode operatoire fiable pour repartir dans un autre projet Codex

Ce pack fait foi sur:

- le produit a construire
- l'ordre des priorites
- les references externes autorisees
- les references visuelles officielles
- les choix geles
- la strategie de migration

En cas de conflit entre une idee ulterieure, une implementation existante, un exemple GitHub ou une reference UI externe, la priorite est:

1. `SOURCE_OF_TRUTH.md`
2. `EDITOR_AND_BINDING_SPEC.md`
3. `TARGET_ARCHITECTURE.md`
4. `DOMAIN_AND_DATA_MODEL.md`
5. `ACCEPTANCE_CRITERIA.md`
6. `MIGRATION_EXECUTION_PLAN.md`
7. les references externes autorisees

Liste du pack:

- `SOURCE_OF_TRUTH.md`: doctrine, perimetre, priorites, regles d'arbitrage
- `EDITOR_PRODUCT_SPEC.md`: cahier des charges editoriel et technique de reference
- `EDITOR_AND_BINDING_SPEC.md`: specification editoriale et binding
- `REFERENCE_ANALYSIS.md`: synthese des references GitHub, demo et captures
- `TARGET_ARCHITECTURE.md`: architecture cible du futur projet
- `DOMAIN_AND_DATA_MODEL.md`: modeles logiques metier et techniques
- `IMPLEMENTATION_PHASES.md`: ordre de livraison par blocs
- `ACCEPTANCE_CRITERIA.md`: criteres de validation pour chaque bloc
- `MIGRATION_EXECUTION_PLAN.md`: strategie reprise CE.SDK React puis migration
- `DECISION_LOG.md`: journal des decisions deja figees
- `CODEX_STARTUP_PROMPT.md`: texte de demarrage pour un nouvel agent Codex
- `NEW_PROJECT_BOOTSTRAP.md`: mode operatoire de relance du projet

Reference visuelle officielle a embarquer dans le nouveau projet:

- `docs/reference-ui/Ecran_Canvas_01.jpg` a `docs/reference-ui/Ecran_Canvas_16.jpg`
- `docs/reference-ui/UI_REFERENCE_INDEX.md`
