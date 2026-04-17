# Implementation Phases

## But du document

Ce document decoupe le projet en blocs executables pour un futur projet Codex.

Les phases sont volontaires et orientent l'ordre d'execution.

## Phase 0: bootstrap du nouveau projet

Objectif:

- creer le nouveau repo ou workspace
- embarquer ce pack de cadrage
- mettre en place un shell minimal runnable

Sortie:

- projet demarrable
- cadrage present
- premiere page editoriale vide ou minimale

## Phase 1: shell editoral

Objectif:

- top bar editoriale
- rail gauche
- panneau gauche
- canvas viewport
- inspecteur droit

Sortie:

- squelette d'editeur stable

## Phase 2: moteur de selection et transformations

Objectif:

- selection simple
- selection multiple
- resize
- rotation
- duplication
- suppression
- actions flottantes

Sortie:

- manipulation directe fiable

## Phase 3: bibliotheques d'insertion

Objectif:

- images
- text
- shapes
- elements
- templates

Sortie:

- insertion depuis le panneau gauche

## Phase 4: inspecteurs contextuels

Objectif:

- document
- page resize
- text
- image
- crop
- color
- shape
- group

Sortie:

- panneau droit specialise selon la selection

## Phase 5: multi-pages

Objectif:

- add page
- duplicate page
- reorder pages
- remove page
- presets de format

Sortie:

- edition multi-pages exploitable

## Phase 6: variables et binding

Objectif:

- definitions de variables
- insertion de variables texte
- binding texte
- binding image/photo
- preview de resolution

Sortie:

- premier flux de personnalisation fonctionnel

## Phase 7: generation et export

Objectif:

- choisir une source
- charger un record
- previsualiser
- exporter

Sortie:

- premier flux end-to-end de generation

## Phase 8: crud templates/canvases

Objectif:

- creation
- lecture
- duplication
- versioning simple
- archivage

## Phase 9: auth et users

Objectif:

- login
- session
- roles
- administration utilisateurs

## Phase 10: candidats

Objectif:

- module candidats complet
- fiches
- recherche
- sections metier
- donnees liees aux templates

## Phase 11: database management

Objectif:

- gestion des sources
- schemas
- collections
- mappings de reference

## Regle d'enchainement

Chaque phase doit etre validee avant ouverture large de la suivante.

La prochaine phase ne doit pas cannibaliser la precedente si celle-ci n'est pas encore fiable.
