# Target Architecture

## But du document

Ce document fixe l'architecture cible du nouveau projet.

Il decrit les grands sous-systemes et leurs responsabilites.

## Principes d'architecture

- editeur d'abord
- separation forte entre shell, domaine editoral, donnees et modules metier
- modele de document explicite
- UI contextuelle pilotee par l'etat de selection
- binding traite comme une capacite centrale
- generation de documents consideree comme un flux de domaine a part entiere

## Vue d'ensemble

Le projet cible doit idealement etre decoupe en couches:

1. `app shell`
2. `editor shell`
3. `editor domain`
4. `binding and generation`
5. `template management`
6. `auth and users`
7. `candidate management`
8. `database management`

## Sous-systemes cibles

### App shell

Responsabilites:

- routing global
- layout global hors editor
- session utilisateur
- entree vers modules

Ne doit pas contenir:

- logique editoriale lourde
- logique de binding de bas niveau

### Editor shell

Responsabilites:

- top bar editoriale
- rail gauche
- panneau gauche
- canvas central
- inspecteur droit
- footer / pages si necessaire

Doit rester:

- decouple du domaine metier candidats
- pilote par un `editor state`

### Editor domain

Responsabilites:

- modele document/page/node
- selection
- transform
- arrangement
- commandes editoriales
- undo/redo
- serialisation du template

### Binding and generation

Responsabilites:

- schema de variables
- mapping des objets vers donnees
- preview de resolution
- generation de rendu
- exports

### Template management

Responsabilites:

- CRUD templates/canvases
- versions
- duplication
- archivage
- tags et metadata

### Auth and users

Responsabilites:

- authentification
- session
- roles
- permissions

### Candidate management

Responsabilites:

- fiches candidats
- champs structures
- medias lies
- statuts
- recherche et filtres

### Database management

Responsabilites:

- sources de donnees
- collections
- schemas
- champs
- relations
- mapping de reference

## Architecture UI recommandee

### Structure logicielle

Le futur projet peut etre structure autour de modules du type:

- `src/app`
- `src/editor`
- `src/binding`
- `src/templates`
- `src/generation`
- `src/auth`
- `src/users`
- `src/candidates`
- `src/data`
- `src/shared`

Le naming exact peut varier, mais la separation de responsabilites ne doit pas etre perdue.

### Composition UI editoriale

Structure cible:

- `EditorPage`
- `EditorTopbar`
- `EditorToolRail`
- `EditorLibraryPanel`
- `EditorCanvasViewport`
- `SelectionContextToolbar`
- `EditorInspectorPanel`
- `PageStrip` ou `PageFooter`

## Architecture d'etat recommandee

### Etats distincts

L'etat du projet doit idealement distinguer:

- `session state`
- `template repository state`
- `editor UI state`
- `document state`
- `selection state`
- `binding state`
- `preview / generation state`

### Regle importante

Le futur projet ne doit pas tout mettre dans un store unique indistinct.

Il faut distinguer:

- etat de presentation
- etat de document
- etat de donnees
- etat de generation

## Flux principaux

### Flux 1: edition pure

1. ouvrir template
2. inserer / modifier objets
3. regler document et pages
4. sauvegarder template

### Flux 2: binding

1. definir ou charger variables
2. associer variables aux objets
3. previsualiser la resolution
4. corriger les erreurs ou fallbacks

### Flux 3: generation

1. choisir source ou enregistrement
2. resoudre variables
3. generer preview
4. exporter resultat

## Regles de modularite

### Ce que l'editeur peut connaitre

- templates
- variables
- metadonnees d'objet
- commandes de generation minimales

### Ce que l'editeur ne doit pas piloter directement

- logique profonde de candidats
- logique profonde d'administration
- logique profonde de base de donnees

Ces modules doivent alimenter l'editeur, pas le parasiter.

## Architecture de migration

L'architecture cible doit etre atteinte progressivement.

Le nouveau projet peut au debut embarquer:

- des composants repris de l'existant
- des stores provisoires
- des adaptateurs

Mais il faut expliciter ces reprises et converger progressivement vers la separation cible.

## Definition d'un socle sain

Le socle est considere sain lorsque:

- l'editeur tient debout seul
- le binding n'est pas un patch secondaire
- les modules futurs peuvent se brancher sans tordre le coeur editorial
