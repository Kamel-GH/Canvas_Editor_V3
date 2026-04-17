# New Project Bootstrap

## But du document

Ce document explique comment reprendre ce cadrage dans une autre session Codex sans perdre les decisions prises ici.

## Ce qu'il faut emporter dans le nouveau projet

A minima, le nouveau projet doit embarquer:

- `docs/codex-editor-reboot/README.md`
- `docs/codex-editor-reboot/SOURCE_OF_TRUTH.md`
- `docs/codex-editor-reboot/EDITOR_AND_BINDING_SPEC.md`
- `docs/codex-editor-reboot/MIGRATION_EXECUTION_PLAN.md`
- ce fichier

## Ce qu'il faut garder comme references externes

- le depot `imgly/cesdk-web-examples`
- la demo IMG.LY / CE.SDK `multi-image-generation`
- les captures d'ecran de l'editeur dans `docs/reference-ui/`

Le projet local precedent `canvaeditor` doit etre ignore completement.

## Ce qu'il faut dire explicitement dans une nouvelle session Codex

Utiliser une instruction de demarrage de ce type:

```md
Le projet doit etre gouverne par les fichiers de cadrage du dossier `docs/codex-editor-reboot/`.

Ordre d'autorite:
1. SOURCE_OF_TRUTH.md
2. EDITOR_AND_BINDING_SPEC.md
3. MIGRATION_EXECUTION_PLAN.md

Objectif prioritaire:
- construire d'abord un editeur de templates/canvas avance
- integrer ensuite le binding/mapping de variables et la generation de documents personnalises

Base de depart obligatoire:
- CE.SDK en React

Strategie obligatoire:
- reprendre un maximum de code CE.SDK React utile pour etre operationnel vite
- migrer ensuite ce socle fonctionnalite par fonctionnalite
- ne passer au bloc suivant qu'apres validation du bloc courant

Le nouveau projet doit prendre le depot GitHub IMG.LY, la demo web et les captures d'ecran comme references primaires, puis etre pilote par le cadrage local.
```

## Checklist de demarrage du nouveau projet

### Avant d'ecrire du code

- lire `README.md`
- lire `SOURCE_OF_TRUTH.md`
- lire `EDITOR_AND_BINDING_SPEC.md`
- lire `MIGRATION_EXECUTION_PLAN.md`
- identifier le socle CE.SDK React pertinent
- choisir le premier bloc fonctionnel a livrer

### Premier bloc recommande

Le premier bloc recommande est:

- shell editeur

Sortie attendue:

- top bar
- rail gauche
- panneau gauche
- canvas central
- inspecteur droit contextuel vide ou minimal

## Ce qu'il ne faut pas faire dans le nouveau projet

- reutiliser le projet local `canvaeditor`
- lancer en priorite auth, candidats ou base de donnees
- ouvrir plusieurs gros chantiers editoriaux en parallele
- copier integralement du code externe sans revue
- declarer l'editeur "fini" sans binding ni generation

## Trace de decision a garder

Si le nouveau projet ouvre d'autres documents de cadrage, ils doivent rappeler:

- que le noyau prioritaire est l'editeur
- que le binding fait partie du noyau, pas d'un module "plus tard"
- que la strategie officielle est "reprendre CE.SDK React d'abord, migrer ensuite"
- que la validation se fait bloc par bloc

## Format de suivi recommande dans le nouveau projet

En plus de ce pack de cadrage, il est recommande d'ajouter rapidement:

- `SESSION.md` pour l'etat courant
- `IMPLEMENTATION_PHASES.md` pour le decoupage des blocs
- `DECISION_LOG.md` pour les arbitrages nouveaux

## Definition de succes du redemarrage

Le redemarrage est considere comme robuste si un nouvel agent Codex peut:

- comprendre la vision produit sans relire cette conversation
- savoir quelles references externes utiliser
- savoir quoi reutiliser et quoi ne pas reutiliser
- savoir dans quel ordre livrer les blocs
- commencer le travail sans ambiguite strategique
