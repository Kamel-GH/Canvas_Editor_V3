# UI Reference Index

## Statut du document

Ce document indexe les references visuelles officielles de l'editeur.

Le dossier `docs/reference-ui/` fait partie du cadrage du projet.

Les captures ne sont pas decoratives.

Elles servent a figer:

- la structure du shell editoral
- la relation entre panneau gauche, canvas et panneau droit
- les contexts de selection
- la forme attendue des inspecteurs et bibliotheques

## Convention de nommage

Fichiers attendus:

- `Ecran_Canvas_01.jpg`
- `Ecran_Canvas_02.jpg`
- `Ecran_Canvas_03.jpg`
- `Ecran_Canvas_04.jpg`
- `Ecran_Canvas_05.jpg`
- `Ecran_Canvas_06.jpg`
- `Ecran_Canvas_07.jpg`
- `Ecran_Canvas_08.jpg`
- `Ecran_Canvas_09.jpg`
- `Ecran_Canvas_10.jpg`
- `Ecran_Canvas_11.jpg`
- `Ecran_Canvas_12.jpg`
- `Ecran_Canvas_13.jpg`
- `Ecran_Canvas_14.jpg`
- `Ecran_Canvas_15.jpg`
- `Ecran_Canvas_16.jpg`

## Cartographie des ecrans

### Ecran_Canvas_01.jpg

Valide:

- mode document
- top bar editoriale
- panneau droit `Document`
- barre texte inline avec `Insert Variable`
- bouton `Add Page`

### Ecran_Canvas_02.jpg

Valide:

- bibliotheque gauche `Images`
- recherche et uploads
- resize page
- presets de formats de reseaux sociaux

### Ecran_Canvas_03.jpg

Valide:

- crop image
- fill mode
- straighten
- turn and mirror
- scale et offsets
- ratios de crop

### Ecran_Canvas_04.jpg

Valide:

- variante ou transition mineure du shell

### Ecran_Canvas_05.jpg

Valide:

- selection de shape imagee
- toolbar flottante objet
- inspector shape / polygon
- opacity / blend / transform / fill / stroke / adjustments

### Ecran_Canvas_06.jpg

Valide:

- bibliotheque gauche `Shapes`
- mode groupe
- ungroup
- export visibility

### Ecran_Canvas_07.jpg

Valide:

- bibliotheque gauche `Text`
- mode groupe ou selection globale
- panneaux textes predefinis

### Ecran_Canvas_08.jpg

Valide:

- panneau `Adjustments`
- reglages d'image detailles

### Ecran_Canvas_09.jpg

Valide:

- inspector pour un element nomme
- shape + image fill
- sections `Appearance`, `Filter`, `Effect`

### Ecran_Canvas_10.jpg

Valide:

- panneau `Color`
- picker couleur
- couleurs de document
- couleurs par defaut
- insertion de variable dans le texte

### Ecran_Canvas_11.jpg

Valide:

- crop sur la page ou fond large
- grid / area visuelle de crop

### Ecran_Canvas_12.jpg

Valide:

- bibliotheque `Elements`
- categories agregees: images, text, shapes, stickers
- inspector shape simple

### Ecran_Canvas_13.jpg

Valide:

- bibliotheque `Templates`
- templates categories
- coexistence bibliotheque gauche + canvas + inspector droit

### Ecran_Canvas_14.jpg

Valide:

- menu flottant `More`
- flip horizontal / vertical
- copy / paste element

### Ecran_Canvas_15.jpg

Valide:

- vue d'ensemble de l'editeur dans son contexte navigateur
- confirmation du parti pris general

### Ecran_Canvas_16.jpg

Valide:

- panneau texte `Character`
- toolbar inline
- insertion de variable avec menu
- lien entre style de texte et variable dynamique

## Regle d'usage

Quand un agent implemente une fonctionnalite de l'editeur:

- il doit verifier ce dossier
- identifier l'ecran ou les ecrans pertinents
- s'aligner sur l'intention fonctionnelle et ergonomique

En cas de conflit entre deux captures:

- priorite au `SOURCE_OF_TRUTH.md`
- puis a `EDITOR_AND_BINDING_SPEC.md`
- puis a l'intention la plus coherentement editoriale
