# Acceptance Criteria

## But du document

Ce document fixe les criteres minimaux de validation.

Il sert a empecher les declarations de fin de bloc trop optimistes.

## Regle generale

Une fonctionnalite n'est pas validee si elle:

- compile mais n'est pas utilisable
- marche sur un cas nominal mais casse les contexts proches
- ne correspond pas a la reference UI attendue
- ne peut pas etre rejouee de bout en bout

## Criteres du shell editoral

- top bar compacte et stable
- rail gauche visible et exploitable
- panneau gauche commutable sans glitch
- canvas central prioritaire
- panneau droit reservé a l'inspection contextuelle

## Criteres du texte

- insertion
- edition inline
- style de base
- couleur
- alignement
- variable inseree
- preview visuelle correcte

## Criteres de l'image

- insertion
- replace
- crop
- resize
- flip
- adjustments
- panneau contextuel coherent

## Criteres des shapes

- insertion
- edition type/forme
- fill
- stroke
- radius ou sides selon la shape
- transform

## Criteres des groupes et layers

- grouper
- degrouper
- arranger
- aligner
- opacite
- blend mode si prevu

## Criteres multi-pages

- ajouter une page
- supprimer une page
- dupliquer une page
- reordonner
- conserver l'integrite du document

## Criteres binding

- definir variable
- binder variable texte
- binder variable image
- fallback minimal
- preview de resolution

## Criteres generation

- choisir template
- choisir enregistrement
- resoudre variables
- afficher preview
- exporter resultat

## Criteres de migration

- le bloc repris de l'ancien code est isole
- le flux cible fonctionne
- les concessions temporaires sont documentees
- la dette bloquante n'est pas repoussee indefiniment
