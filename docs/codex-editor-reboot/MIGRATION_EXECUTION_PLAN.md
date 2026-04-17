# Migration Execution Plan

## But du document

Ce document fixe la strategie de livraison du nouveau projet.

Il ne decrit pas seulement "quoi faire", mais "dans quel ordre", "avec quelles regles" et "avec quels garde-fous".

## Strategie generale

La strategie retenue est:

- partir d'un nouveau projet Codex distinct
- reprendre un maximum de code CE.SDK React pour etre operationnel vite
- migrer ensuite le socle CE.SDK React fonctionnalite par fonctionnalite
- valider chaque bloc avant de passer au suivant

Cette strategie interdit deux extremes:

- le copier-coller anarchique d'un ancien projet local
- la reimplementation totale immediate

## Regles d'execution obligatoires

### Regle 1: un seul bloc actif a la fois

A un instant donne, une seule fonctionnalite majeure doit etre en chantier.

Exemples de blocs:

- shell editeur
- bibliotheque images
- crop image
- texte et variables
- inspecteur document
- multi-pages
- binding image

### Regle 2: definition de fini stricte

Un bloc n'est pas "fini" quand le code est ecrit.

Il est fini quand:

- le flux principal fonctionne
- le comportement est coherent visuellement
- la regression principale a ete verifiee
- la dette immediate bloquante est fermee

### Regle 3: pas de refactor transverse premature

Si une piece issue du socle CE.SDK fonctionne et permet d'avancer vite, elle peut etre gardee provisoirement.

Elle sera nettoyee ensuite lors d'un bloc dedie.

### Regle 4: le produit reste runnable

Le nouveau projet doit rester runnable le plus souvent possible.

### Regle 5: validation utilisateur avant bloc suivant

Chaque bloc important doit recevoir une validation fonctionnelle avant ouverture du suivant.

## Phasage recommande

### Phase 0: bootstrap du nouveau projet

Objectif:

- creer le nouveau projet
- y embarquer ce pack de cadrage
- identifier le bon socle CE.SDK React a reprendre
- obtenir un shell minimal runnable

Sortie attendue:

- nouveau workspace propre
- base de build et demarrage
- documentation de reprise en place

### Phase 1: shell editeur

Objectif:

- top bar compacte
- rail gauche
- panneau gauche dynamique
- canvas central
- panneau droit contextuel

Le but n'est pas encore d'avoir toutes les fonctions, mais d'avoir la structure cible.

Validation:

- navigation editoriale lisible
- changement de contexte gauche/droite
- canvas central stable

### Phase 2: selection / transform / actions contextuelles

Objectif:

- selection simple et multiple
- resize
- rotation
- duplication
- suppression
- barre flottante contextuelle

Validation:

- objets manipulables sans rupture visuelle
- actions contextuelles stables

### Phase 3: bibliotheques d'insertion

Objectif:

- images
- text
- shapes
- elements
- templates

Validation:

- inserer rapidement depuis le panneau gauche
- rechercher
- scroller
- choisir une categorie

### Phase 4: inspecteurs specialises

Objectif:

- document
- page resize
- crop
- color
- text settings
- image adjustments
- shape settings
- group settings

Validation:

- le panneau droit change correctement selon la selection
- chaque type majeur d'objet a un panneau utile

### Phase 5: multi-pages

Objectif:

- add page
- duplicate
- reorder
- remove
- resize page

Validation:

- workflow multi-pages exploitable de bout en bout

### Phase 6: variables et binding

Objectif:

- definitions de variables
- insertion de variables dans le texte
- mapping texte
- mapping image/photo
- preview de resolution

Validation:

- un template personalise simple fonctionne de bout en bout

### Phase 7: generation

Objectif:

- choisir une source
- charger un enregistrement
- previsualiser
- exporter

Validation:

- document personnalise genere avec succes

### Phase 8: nettoyage structurel

Objectif:

- refactorer les zones les plus fragiles
- extraire les abstractions utiles
- supprimer les morceaux provisoires devenus obsoletes

Cette phase vient apres les validations de fond, pas avant.

## Reprise du code CE.SDK: regles pratiques

### Base de depart autorisee

La seule base de depart autorisee est le code CE.SDK React choisi comme socle dans `imgly/cesdk-web-examples`.

Le projet local precedent est exclu.

### Critere de go/no-go pour reutiliser un bloc

Reprendre un bloc si:

- il reduit fortement le temps de mise en route
- il ne force pas une architecture contraire a la cible
- il reste lisible apres transport

Reecrire un bloc si:

- il impose trop de dette structurelle
- il est trop colle a un showcase CE.SDK etroit ou non pertinent
- il contredit les captures cibles ou les choix geles

## Matrice de validation par bloc

Chaque bloc doit etre valide selon 4 axes:

- fonctionnalite
- UX
- stabilite
- compatibilite avec la suite

Exemple pour `crop image`:

- fonctionnalite: crop, scale, offsets, flip, ratios
- UX: panneau droit clair, poignets visibles, workflow comprehensible
- stabilite: pas de glitch de selection ni de sortie d'etat
- compatibilite: reutilisable dans le futur flux de binding image

## Regles anti-deraillement

Les derives suivantes sont interdites:

- repartir dans les modules candidats/auth/db avant validation du noyau editoral
- ouvrir un chantier de design system global avant d'avoir stabilise le shell editeur
- remplacer une brique stable juste parce qu'elle n'est pas parfaite
- annoncer une fonctionnalite "done" sans flux testable

## Risques majeurs identifies

### Risque 1: reprise excessive de dette

Mitigation:

- isoler les blocs repris depuis CE.SDK React
- documenter les concessions provisoires
- planifier leur cleanup apres stabilisation

### Risque 2: refonte infinie de l'UI

Mitigation:

- prioriser l'usage reell
- caler la parite fonctionnelle avant le polish pousse

### Risque 3: binding trop tardif

Mitigation:

- prevoir les points d'accroche des variables des le design de l'editeur
- ne pas considerer l'editeur "termine" sans premier flux de binding + generation

### Risque 4: confusion entre document settings et object settings

Mitigation:

- separer explicitement les contexts
- definir une logique de selection claire

## Criteres de sortie de la phase prioritaire

La phase prioritaire peut etre consideree comme cloturee uniquement si:

- le shell editeur est stable
- les bibliotheques majeures marchent
- texte, image et shape sont exploitables
- le contexte document est gere
- le multi-pages est disponible
- le binding texte + image minimal est present
- au moins un document personnalise peut etre genere

## Ce qui vient seulement apres

Une fois la phase prioritaire validee, le projet peut ouvrir:

- gestionnaire CRUD des canvases/templates
- auth/users/roles
- module candidats
- module de gestion de la base de donnees

Ces chantiers doivent se brancher sur le socle editoral valide, pas l'inverse.
