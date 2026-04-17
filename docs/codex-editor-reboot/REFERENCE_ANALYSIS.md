# Reference Analysis

## But du document

Ce document synthétise les references qui ont servi a cadrer le futur projet.

Il ne remplace pas la spec.

Il explique:

- ce qui a ete observe
- ce qui en a ete retenu
- ce qui a ete exclu

## Reference 1: depot GitHub IMG.LY

Reference:

- `imgly/cesdk-web-examples`

Nature de la reference:

- monorepo d'exemples CE.SDK
- demonstrations fonctionnelles et showcases
- reservoir de patterns d'architecture et d'UI

Ce qu'il faut en retenir:

- separation nette entre shell, editeur et cas d'usage
- logique editor-first
- existence de showcases de generation image / batch / automation
- existence d'exemples React utilisables comme socle de demarrage
- structure de produit plus mature que celle d'une simple page demo

Ce qu'il ne faut pas en faire:

- base de code a copier sans discernement
- contrainte rigide de nomenclature ou de stack
- preuve qu'il faut reproduire exactement leur produit

## Reference 2: demo web IMG.LY / CE.SDK

Reference:

- `https://img.ly/showcases/cesdk/multi-image-generation/web`

Nature de la reference:

- vitrine de demonstration
- expose surtout un cas d'usage, pas l'integralite d'un produit

Ce qu'il faut en retenir:

- orientation "creative automation"
- workflow lie a la generation multi-image
- couplage entre edition visuelle et donnees
- hierarchie de produit centree sur un editeur

Ce qu'il ne faut pas en faire:

- prendre la demo comme un produit complet
- calquer la navigation du site marketing
- sous-estimer l'ecart entre showcase et produit metier

## Reference 3: captures de l'editeur

Reference officielle du futur projet:

- `docs/reference-ui/Ecran_Canvas_01.jpg`
- `docs/reference-ui/Ecran_Canvas_02.jpg`
- `docs/reference-ui/Ecran_Canvas_03.jpg`
- `docs/reference-ui/Ecran_Canvas_04.jpg`
- `docs/reference-ui/Ecran_Canvas_05.jpg`
- `docs/reference-ui/Ecran_Canvas_06.jpg`
- `docs/reference-ui/Ecran_Canvas_07.jpg`
- `docs/reference-ui/Ecran_Canvas_08.jpg`
- `docs/reference-ui/Ecran_Canvas_09.jpg`
- `docs/reference-ui/Ecran_Canvas_10.jpg`
- `docs/reference-ui/Ecran_Canvas_11.jpg`
- `docs/reference-ui/Ecran_Canvas_12.jpg`
- `docs/reference-ui/Ecran_Canvas_13.jpg`
- `docs/reference-ui/Ecran_Canvas_14.jpg`
- `docs/reference-ui/Ecran_Canvas_15.jpg`
- `docs/reference-ui/Ecran_Canvas_16.jpg`

Nature de la reference:

- reference visuelle editoriale
- documente les modes de contexte, le shell et les panneaux

Ce qui a ete observe:

- top bar compacte, strictement editoriale
- rail gauche d'outils
- panneau gauche de bibliotheques
- canvas central dominant
- toolbar flottante sur selection
- inspecteur droit contextuel selon l'objet
- modes document, crop, color, adjustments, text, shapes, templates, elements
- workflow multi-pages via bouton `Add Page`
- variables inserees dans le texte

Ce qu'il faut en retenir:

- le produit cible est un vrai studio d'edition
- l'inspecteur droit n'est pas generique; il est specialise par contexte
- le panneau gauche est d'abord une bibliotheque d'insertion
- le binding et les variables font partie du coeur du produit

## Reference 4: projet local precedent

Statut:

- explicitement exclu

Decision:

- le projet local precedent ne doit pas etre utilise comme base technique
- il ne doit pas orienter l'UI
- il ne doit pas servir de reservoir de code

Raison:

- code juge non satisfaisant
- interface jugee non conforme aux attentes
- risque de contaminer le nouveau projet avec de mauvaises bases

## Synthese des references

La combinaison des references mene a une direction nette:

- reprendre la logique editoriale du produit de reference
- reprendre vite le socle CE.SDK React pertinent
- figer les choix dans un nouveau projet gouverne par le cadrage

Cette synthese interdit:

- la copie brute
- la reimplementation totale immediate
- la reprise du projet local precedent

## Regle de lecture pour les futurs agents

Un futur agent doit comprendre:

- que GitHub fournit des patterns et un socle React a reprendre
- que la demo fournit l'intention
- que les captures fixent le shell cible
- que `canvaeditor` est hors jeu
- que le cadrage local decide en dernier ressort
