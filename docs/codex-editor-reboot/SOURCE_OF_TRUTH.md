# Source Of Truth

## Statut du document

Ce document est la source de verite du projet `Canvas_Editor_V3`.

Il a priorite sur:

- toute implementation locale non conforme au cadrage
- les interpretations libres d'un agent
- les exemples du depot GitHub de reference
- les captures d'ecran si leur lecture est ambigue

Si un point n'est pas explicitement decrit ici, il peut etre derive des annexes du pack de cadrage. Si un point reste ambigu, il doit etre tranche dans le sens:

1. coherence produit
2. maintenabilite
3. progression incrementale
4. vitesse de mise en route a partir de CE.SDK React

## Intention generale

Le projet cible est un studio de creation et de generation de documents personnalises, centre sur un editeur de templates/canvas tres avance.

Le produit doit permettre:

- de creer et editer des templates multi-pages
- de manipuler des objets de types texte, image, photo, shape, groupe, variable et element compose
- de binder ces objets a des donnees
- de generer des documents personnalises a partir de sources de donnees
- d'encadrer ensuite la gestion des templates, des utilisateurs, des candidats et de la base de donnees

## Sources de reference autorisees

Les references externes autorisees sont:

- le depot public `imgly/cesdk-web-examples`
- la demo web IMG.LY / CE.SDK `multi-image-generation`
- les captures d'ecran editoriales placees dans `docs/reference-ui/`

Ces references servent a:

- comprendre l'architecture editoriale
- reprendre les patterns d'interface utiles
- accelerer la mise en route
- identifier les briques CE.SDK React a reprendre et a migrer

Le dossier `docs/reference-ui/` fait partie des references officielles du projet.

Les fichiers attendus sont:

- `Ecran_Canvas_01.jpg` a `Ecran_Canvas_16.jpg`
- `UI_REFERENCE_INDEX.md`

Si ces fichiers ne sont pas presents dans le nouveau projet, ils doivent etre recopies avant d'engager une implementation UI significative.

Ces references ne doivent pas servir a:

- imposer une copie litterale du produit source
- copier-coller du code sans revue
- contourner les choix actes dans ce document

Le projet local `canvaeditor` est explicitement exclu comme base technique, base de migration ou reservoir de reprise.

Il doit etre ignore completement.

## Orientation strategique

Le projet doit suivre une strategie en deux temps.

### Temps 1: etre operationnel vite

Il faut reprendre un maximum de code CE.SDK React utile pour obtenir rapidement un editeur exploitable.

Cela implique:

- partir du code du depot GitHub CE.SDK React pertinent pour le cas d'usage
- importer ou adapter des blocs CE.SDK React entiers si cela reduit fortement le temps de mise en route
- privilegier la vitesse de stabilisation sur la perfection initiale

### Temps 2: migrer proprement par fonctionnalite

Une fois l'editeur en marche, chaque brique du socle CE.SDK repris doit etre migree, refactorisee ou remplacee fonctionnalite par fonctionnalite.

Regle obligatoire:

- une fonctionnalite est stabilisee
- elle est verifiee
- elle est validee
- seulement ensuite on passe a la suivante

## Decision structurelle principale

Le futur projet ne doit pas etre une continuation confuse d'un ancien projet local.

Il doit etre lance dans un nouveau workspace / nouveau dossier / nouveau projet Codex, avec ce pack de cadrage comme base.

Le projet `canvaeditor` n'est pas une base d'analyse utile pour la suite et doit etre ignore completement.

## Noyau produit prioritaire

Le noyau produit prioritaire est l'editeur.

Ordre de priorite obligatoire:

1. editeur canvas/layout avance
2. binding / mapping / variables / generation de documents
3. gestionnaire CRUD de canvases/templates
4. authentification et gestion des utilisateurs
5. module candidats complet
6. module complet de gestion de la base de donnees

## Definition du succes pour la phase editoriale

La phase editoriale est consideree comme reussie quand:

- le shell de l'editeur est stable
- les bibliotheques gauche sont fonctionnelles
- le canvas permet les operations majeures
- l'inspecteur droit est contextuel
- le mode document est distinct du mode objet
- le mode texte est exploitable
- le mode image est exploitable
- le mode shape est exploitable
- le mode groupe/layer est exploitable
- la gestion multi-pages est presente
- le binding de variables texte et image fonctionne
- la generation de documents personnalises fonctionne au moins sur un flux de bout en bout

## Non-negociables

Les points suivants sont obligatoires:

- architecture editor-first
- base technique de depart CE.SDK en React
- top bar compacte et unique
- rail gauche par icones
- bibliotheque gauche par contexte
- canvas central comme zone prioritaire
- barre flottante de selection
- inspecteur droit contextuel
- separation claire document / page / objet
- support multi-pages
- support variables de plusieurs types
- support mapping/binding vers donnees
- support generation de documents personnalises
- validation incrementaliste, une fonction a la fois

## Ce qui est explicitement exclu

Les points suivants sont exclus pour la premiere phase:

- reutilisation de `canvaeditor`
- refonte immediate de tous les modules metier non editoriaux
- rearchitecture totale avant d'etre operationnel
- replacement global from scratch du socle CE.SDK avant validation fonctionnelle
- dependance a une UI de showcase copiable telle quelle
- recherche de perfection visuelle avant stabilisation fonctionnelle

## Regle de reutilisation du code

Le projet doit reutiliser un maximum de code CE.SDK React utile au demarrage.

Definition de "utile":

- code present dans la base CE.SDK React choisie comme socle
- fonctionnel ou proche du fonctionnel
- comprehensible
- portable dans le nouveau projet
- compatible avec l'architecture cible

Definition de "non utile":

- code fortement couple a un showcase CE.SDK non pertinent
- code qui bloque la lisibilite de l'architecture cible
- code qui contredit les decisions UX ou produit figees
- code trop fragile pour etre transporte avec un risque acceptable

## Regle de migration

La migration doit respecter les principes suivants:

- ne migrer qu'un bloc coherent a la fois
- valider par use case utilisateur, pas seulement par compilation
- ne pas ouvrir de refactor transverse avant d'avoir ferme le bloc en cours
- conserver un etat runnable le plus souvent possible
- documenter les decisions a chaque bifurcation importante

## References UI cibles

Les captures d'ecran fournies dans cette conversation etablissent les patterns cibles suivants:

- top bar editoriale compacte
- barres contextuelles flottantes sur selection
- bibliotheques d'elements a gauche
- inspecteurs contextuels a droite
- workflows document, crop, resize, color, adjustments, text, shapes, templates, elements
- bouton d'ajout de page et logique multi-pages
- insertion de variables dans le texte

## References fonctionnelles cibles

Le futur editeur doit couvrir au minimum les familles de fonctionnalites suivantes:

- document settings
- page settings
- crop image
- resize page
- text editing
- color editing
- shape editing
- image adjustments
- layers / arrange / align / group / ungroup
- replace / duplicate / delete / flip / copy / paste
- templates library
- elements library
- images library
- shapes library
- text library
- data variables binding
- document generation

## Decision de gouvernance

Toute nouvelle implementation doit pouvoir etre reliee a l'un de ces motifs:

- parite fonctionnelle avec la cible editoriale
- robustesse du binding et de la generation
- acceleration de la mise en route
- reduction d'un risque structurel

Si une implementation ne sert aucun de ces motifs, elle ne doit pas passer avant les blocs prioritaires.

## Futurs modules prevus

Une fois l'editeur et le binding juges stables, le projet doit evoluer vers:

- un gestionnaire de canvases/templates de type CRUD
- un gestionnaire d'utilisateurs avec authentification
- un module tres complet de gestion de candidats
- un module complet de gestion de la base de donnees

Ces modules sont desires, mais ne doivent pas detourner l'effort principal avant validation du noyau editorial.

## Regle d'arbitrage final

En cas de doute sur un choix:

- reprendre vite du code CE.SDK React si cela debloque l'operationnel
- isoler proprement si cela evite une dette irrecuperable
- migrer par tranche si cela limite le risque

Le projet ne doit ni tomber dans la copie brute, ni dans la reimplementation totale prematuree.
