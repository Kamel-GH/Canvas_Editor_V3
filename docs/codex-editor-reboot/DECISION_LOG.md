# Decision Log

## But du document

Ce document trace les decisions deja prises pour eviter les reinterpretations ulterieures.

## Decisions figees

### D-001: priorite absolue a l'editeur

Decision:

- le noyau du projet est l'editeur canvas/layout avance

Raison:

- c'est le coeur du produit et la base de tous les futurs modules

### D-002: le binding fait partie du noyau

Decision:

- le binding / mapping / variables fait partie de la phase prioritaire

Raison:

- sans binding, l'editeur ne remplit pas l'objectif de generation personnalisee

### D-003: reprise CE.SDK React d'abord

Decision:

- il faut reprendre un maximum de code CE.SDK React utile au depart

Raison:

- objectif d'etre operationnel vite

### D-004: migration ensuite

Decision:

- la migration propre se fera bloc par bloc apres mise en route

Raison:

- limiter le risque et conserver un etat runnable

### D-005: nouveau projet distinct

Decision:

- le futur produit doit etre construit dans un nouveau projet / workspace

Raison:

- ne pas melanger l'ancien code et le nouveau chantier

### D-006: exclusion du projet local precedent

Decision:

- le projet local precedent `canvaeditor` doit etre ignore completement

Raison:

- code juge non satisfaisant
- interface jugee non conforme aux attentes

### D-007: references visuelles officielles

Decision:

- `docs/reference-ui/` et les `Ecran_Canvas_01.jpg` a `Ecran_Canvas_16.jpg` font partie des references officielles

Raison:

- eviter la perte d'interpretation d'un editeur fortement visuel

### D-008: references externes admises

Decision:

- le depot GitHub IMG.LY, la demo web et les captures d'ecran sont les references autorisees

Raison:

- combiner vitesse, inspiration et pragmatisme

### D-009: pas de copie brute

Decision:

- les references peuvent inspirer et accelerer, mais ne remplacent pas le cadrage local

Raison:

- garder une architecture coherente et un produit gouverne localement

### D-010: base technique de depart

Decision:

- la base de depart doit etre CE.SDK en React

Raison:

- c'est la strategie validee pour etre operationnel vite

### D-011: validation bloc par bloc

Decision:

- on ne passe pas au bloc suivant tant que le bloc courant n'est pas valide

Raison:

- limiter les regressions et l'empilement de dette

## Comment ajouter une nouvelle decision

Format:

- identifiant
- decision
- raison
- impact

Toute decision qui change:

- le scope
- l'ordre des phases
- l'architecture
- la strategie de migration

doit etre journalisee ici.
