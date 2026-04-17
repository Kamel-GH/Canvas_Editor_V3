# Domain And Data Model

## But du document

Ce document fixe les objets logiques que le futur projet doit manipuler.

Il ne s'agit pas d'un schema SQL final, mais d'une base de modelisation stable.

## Principes

- distinguer template, document, page et node
- distinguer donnees de contenu et donnees de production
- distinguer definition de variable et valeur resolue
- distinguer source de donnees et enregistrement concret

## Agrégats principaux

### Template

Responsabilites:

- porte la structure d'un document editable
- stocke metadata, version et publication
- reference un document editoral serialise

Champs conceptuels minimaux:

- `id`
- `name`
- `slug`
- `description`
- `status`
- `category`
- `tags`
- `thumbnail`
- `document`
- `version`
- `revision`
- `createdAt`
- `updatedAt`

### Document

Responsabilites:

- encapsule les pages et les settings globaux

Champs conceptuels minimaux:

- `id`
- `name`
- `format`
- `unit`
- `width`
- `height`
- `pixelScale`
- `clipContent`
- `bleed`
- `layoutMode`
- `pages`
- `assets`
- `variables`

### Page

Responsabilites:

- represente une page ou une surface de composition

Champs conceptuels minimaux:

- `id`
- `name`
- `index`
- `width`
- `height`
- `background`
- `nodes`

### Node

Responsabilites:

- represente un element place sur le canvas

Champs conceptuels minimaux:

- `id`
- `type`
- `name`
- `locked`
- `visible`
- `opacity`
- `blendMode`
- `transform`
- `style`
- `content`
- `bindings`
- `meta`

## Types de nodes a prevoir

- `text`
- `image`
- `shape`
- `group`
- `component`
- `placeholder`

## Transform commune

Chaque node visuelle doit idealement supporter:

- `x`
- `y`
- `width`
- `height`
- `rotation`
- `scaleX`
- `scaleY`

## Styles specialises

### Text style

- font family
- font size
- font weight
- font style
- line height
- letter spacing
- color
- text align
- text transform si utile

### Image style

- source
- fill mode
- crop
- adjustments
- filter
- mask / shape integration si utile

### Shape style

- shape type
- sides
- radius
- fill
- stroke
- stroke width

## Variables

### Variable definition

Responsabilites:

- decrire une variable disponible dans le template

Champs conceptuels minimaux:

- `id`
- `key`
- `label`
- `type`
- `description`
- `required`
- `defaultValue`
- `fallbackValue`
- `sourceField`

### Types de variables a supporter

- `string`
- `number`
- `date`
- `boolean`
- `enum`
- `color`
- `imageUrl`
- `imageAsset`
- `photo`
- `shapeOption`

## Binding

### Binding rule

Responsabilites:

- relier un champ de donnees a une propriete de node

Champs conceptuels minimaux:

- `id`
- `nodeId`
- `target`
- `variableKey`
- `fallback`
- `transformer`
- `conditions`

### Targets de binding a prevoir

- `text.content`
- `text.color`
- `node.visible`
- `image.source`
- `image.crop`
- `shape.fill`
- `shape.stroke`
- `node.opacity`

## Sources de donnees

### Data source

Responsabilites:

- decrire une collection ou une table exploitable pour la personnalisation

Champs conceptuels minimaux:

- `id`
- `name`
- `kind`
- `schema`
- `connection`

### Data record

Responsabilites:

- fournir les valeurs concretes pour un rendu

Champs conceptuels minimaux:

- `id`
- `sourceId`
- `payload`
- `mediaRefs`
- `updatedAt`

## Generation

### Generation job

Responsabilites:

- encapsuler une execution de personnalisation/export

Champs conceptuels minimaux:

- `id`
- `templateId`
- `sourceId`
- `recordIds`
- `status`
- `outputFormat`
- `outputDestination`
- `fileNamePattern`
- `startedAt`
- `finishedAt`

### Generation result

Champs conceptuels minimaux:

- `id`
- `jobId`
- `recordId`
- `status`
- `fileName`
- `filePath`
- `previewUrl`
- `errors`

## Futurs domaines metier

### User

- compte
- role
- statut
- securite

### Candidate

- identite
- coordonnees
- experiences
- competences
- medias
- statuts
- referentiels

### Reference data

- listes parametrables
- enums metier
- catalogues

## Regles de modelisation

- un template n'est pas une fiche metier
- un document n'est pas une source de donnees
- une variable n'est pas une valeur
- un binding n'est pas une variable
- une generation n'est pas un template

Cette separation doit etre preservee dans l'implementation.
