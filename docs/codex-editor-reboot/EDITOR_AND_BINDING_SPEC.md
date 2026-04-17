# Editor And Binding Spec

## But du document

Ce document decrit l'editeur cible, ses surfaces, ses fonctionnalites, ses objets et le systeme de binding/generation.

Il doit etre lu comme une spec produit et technique de niveau 1 pour la phase prioritaire du nouveau projet.

## Vision editoriale

L'editeur doit etre un studio de composition avancé pour documents personnalisables.

L'experience centrale attendue est:

- ouvrir un template
- inserer ou modifier des elements
- regler precisement document, page et objets
- binder des variables a des objets
- previsualiser le rendu issu de donnees
- generer un document personalise

## Shell global de l'editeur

### Barre haute

La barre haute doit rester compacte et editoriale.

Elle doit contenir au minimum:

- fermeture / retour
- mode document
- undo / redo
- nom ou type du document
- controles de zoom / fit / auto
- sauvegarde

Elle ne doit pas etre surchargee par des controls non editoriaux.

### Rail gauche

Le rail gauche est une navigation outil-first.

Il doit permettre d'acceder rapidement aux familles suivantes:

- templates
- elements
- uploads / medias
- images
- text
- shapes
- variables / binding

Le rail doit rester stable visuellement, avec un etat actif explicite.

### Panneau gauche

Le panneau gauche change selon l'outil actif.

Il doit pouvoir afficher:

- recherche
- categories
- bibliotheques de cartes / vignettes
- galleries scrollables
- actions d'upload
- apercus de templates ou d'elements

Bibliotheques minimales a couvrir:

- templates
- elements agreges
- images
- textes predefinis
- shapes
- stickers ou assets decoratifs si utiles

### Canvas central

Le canvas est le coeur du produit.

Il doit supporter:

- affichage d'une page active
- navigation multi-pages
- selection simple et multiple
- poignets de resize
- rotation
- drag and drop
- guides et repères
- overlays de selection
- zoom
- fit to viewport
- actual size
- center

Le canvas doit toujours garder la priorite ergonomique sur les panneaux annexes.

### Barre flottante contextuelle

Une barre flottante doit apparaitre sur selection selon le type d'objet.

Actions attendues:

- replace
- flip horizontal / vertical
- duplicate
- delete
- copy
- paste
- more menu

Pour le texte, une barre inline dediee doit exister avec:

- style de texte
- gras
- italique
- underline
- alignements
- listes si necessaire
- insertion de variable

### Panneau droit contextuel

Le panneau droit est un inspecteur contextuel.

Il ne doit pas etre un simple fourre-tout.

Il doit pouvoir afficher des vues specialisees au minimum pour:

- document
- page resize
- crop image
- image adjustments
- image appearance
- text character / paragraph
- color
- shape
- group
- generic layer / transform

## Modes de selection et contexte

### Aucun objet selectionne

L'inspecteur doit afficher le mode document:

- dimensions
- unite
- resize all pages
- clip content
- layout
- bleed / marges techniques si utiles

### Page selectionnee

L'inspecteur doit afficher:

- format
- presets social/media si applicables
- pixel scale
- apply

### Texte selectionne

L'inspecteur et la barre inline doivent permettre:

- police
- poids
- style
- taille
- couleur
- opacite
- alignement horizontal
- line-height
- letter spacing
- insertion et edition de variables

### Image selectionnee

L'inspecteur doit couvrir:

- crop area
- fill mode
- straighten
- mirror / flip
- scale
- offsets
- ratios de crop predefinis
- adjustments type brightness / saturation / contrast / gamma / exposure / shadows / highlights / blacks / whites / temperature / sharpness
- replace image

### Shape selectionnee

L'inspecteur doit couvrir:

- type de shape
- sides pour polygons si necessaire
- round corners
- fill
- stroke
- opacity
- blend mode
- transform
- adjustments / effects si supportes

### Groupe selectionne

L'inspecteur doit couvrir:

- ungroup
- arrange
- align
- opacity
- blend mode
- transform
- export visibility

## Types d'objets obligatoires

Le moteur editoral doit au minimum supporter:

- document
- page
- text node
- image node
- shape node
- group node
- variable-aware text node
- variable-aware image node
- component / element compose si necessaire

## Fonctionnalites minimales par famille

### Texte

- edition inline
- support variables
- style local
- couleur
- alignement
- duplication
- suppression

### Image

- upload
- replace
- crop
- fill mode
- adjustments
- flip
- transform

### Shape

- insertion depuis librairie
- parametres de forme
- couleur / stroke
- radius / sides
- integration possible avec image fill

### Layers et arrangement

- avant / arriere
- bring forward / send backward
- align
- distribute
- group
- ungroup
- lock si utile
- export visibility

### Pages

- add page
- remove page
- duplicate page
- reorder pages
- resize page
- page presets

## Binding et variables

### Objectif

Le systeme de binding doit permettre de relier des donnees a des objets du canvas pour generer des documents personnalises.

### Types de variables obligatoires

Le systeme doit accepter au minimum:

- texte
- rich text simple si utile
- nombre
- date
- booleen
- enum
- couleur
- image URL
- image asset
- photo
- shape configuration simple

### Cibles de binding obligatoires

Le binding doit pouvoir viser au minimum:

- contenu texte
- couleur de texte
- visibilite d'un objet
- source image
- remplacement de photo
- couleur de fill
- couleur de stroke
- opacite
- forme simple ou variation de style si faisable

### Niveau de mapping

Le systeme doit etre pense a plusieurs niveaux:

- schema de variables global
- mapping par template
- mapping par objet
- previsualisation du mapping
- resolution des valeurs pour un enregistrement source

### Exigences de robustesse

Le binding doit gerer:

- variables manquantes
- valeurs nulles
- fallbacks
- erreurs de type
- preview state explicite
- rendu partiel sans casser tout le document

## Generation de documents personnalises

### Flux minimal

Le flux de generation minimal attendu est:

1. charger un template
2. choisir une source de donnees ou un enregistrement
3. resoudre les variables
4. previsualiser le rendu
5. exporter un document personnalise

### Flux evolue a viser ensuite

- generation par lots
- plusieurs lignes de donnees
- presets de sortie
- naming pattern
- queue / historique
- statut de generation

## Modele logique recommande

Le futur projet doit idealement distinguer:

- `DocumentModel`
- `PageModel`
- `NodeModel`
- `TemplateModel`
- `VariableDefinition`
- `BindingRule`
- `DataSource`
- `DataRecord`
- `GenerationJob`
- `GenerationResult`

Ces noms peuvent varier, mais la separation conceptuelle doit etre conservee.

## Criteres d'acceptation editoriaux

Un bloc editoral est valide uniquement si:

- il compile
- il est utilisable visuellement
- il ne casse pas le shell global
- il respecte le contexte de selection
- son cas d'usage principal est testable de bout en bout

Exemples:

- texte: inserer, editer, styliser, binder, previsualiser
- image: inserer, cropper, ajuster, remplacer
- shape: inserer, styler, binder si prevu
- group: grouper, degroupper, rearranger
- document: resize, presets, multi-pages

## Future extension metier

Une fois l'editeur et le binding stabilises, ce socle doit pouvoir accueillir sans rearchitecture brutale:

- CRUD templates/canvases
- auth / users / roles
- candidats
- database management
- mapping avance
- automatisations de generation
