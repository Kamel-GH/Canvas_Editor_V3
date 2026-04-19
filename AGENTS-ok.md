# AGENTS.md

## 0. PRIORITÉ DES INSTRUCTIONS

Ce fichier définit les règles obligatoires du projet.

En cas de conflit entre :
1. ce fichier
2. les spécifications produit
3. les prompts de tâche

→ l’ordre de priorité est :
**spécifications produit > AGENTS.md > prompt de tâche**

Si une information est absente, ambiguë ou contradictoire :
- ne pas inventer
- ne pas supposer
- demander une validation explicite de l’utilisateur

---

## 1. RÈGLE ABSOLUE

Codex doit agir comme un **exécutant strict des spécifications**.

Codex ne doit jamais :
- inventer une fonctionnalité
- inventer un comportement
- simplifier une règle produit
- remplacer une bibliothèque validée
- modifier l’architecture sans autorisation
- interpréter librement une interaction non spécifiée
- créer une variante UI non demandée

Codex ne peut pas ajouter de bibliothèque, de composant tiers ou d’abstraction structurante sans validation explicite. Il peut en revanche créer les composants métier et techniques explicitement nécessaires à l’implémentation de cette spécification, dans la structure définie
 
## RÈGLE UI — CHOIX DES ICÔNES

Toutes les icônes utilisées dans l’interface doivent être :
- pertinentes
- explicites
- cohérentes avec le sujet, le thème ou la fonctionnalité

Le choix de l’icône ne doit jamais être arbitraire.

L’icône doit permettre de comprendre immédiatement :
- la fonction associée
- ou le type de contenu représenté

Si plusieurs icônes sont possibles, choisir la plus claire et la plus standard dans l’écosystème UI.


---

## 2. NATURE DU PRODUIT

Le produit est un **éditeur de canvas/template pour génération de documents structurés**, notamment de CV.

Ce n’est pas :
- un site web marketing
- un website builder
- un éditeur générique
- un simple canvas graphique

Le système repose sur :
- composition sur canvas
- insertion d’éléments
- variables
- presets
- assets
- structure par calques / objets / pages
- rendu final séparé du canvas

---

## 3. PACKAGE.JSON — SOURCE DE VÉRITÉ DES DÉPENDANCES

### RÈGLE — PACKAGE.JSON

Le fichier `package.json` est la source de vérité unique pour les dépendances du projet.

Codex ne doit jamais :
- modifier `package.json`
- ajouter une dépendance
- supprimer une dépendance
- changer une version
- déplacer une dépendance entre `dependencies` et `devDependencies`

sans autorisation explicite de l’utilisateur.


---
## 4. RÈGLES — NOMMAGE DES COMPOSANTS

## RÈGLE GÉNÉRALE

Tous les composants doivent être :
- nommés explicitement
- compréhensibles sans contexte
- alignés avec leur rôle métier ou UI

Les noms doivent être :
- en PascalCase
- en anglais
- cohérents dans tout le projet

---

## TYPES DE COMPOSANTS

### 1. Composants génériques UI

Utilisés pour des patterns réutilisables.

Exemples :
- Button
- IconButton
- Input
- Select
- Popover
- Modal
- Tooltip

---

### 2. Composants de structure UI

Utilisés pour structurer l’interface.

Exemples :
- LeftPanel
- TopBar
- RightInspector
- FloatingToolbar
- CanvasContainer

---

### 3. Composants fonctionnels (métier)

Utilisés pour représenter une fonctionnalité spécifique du produit.

Exemples :
- VariableList
- PresetList
- AssetLibraryGrid
- LayerList
- ObjectList
- PageList

---

### 4. Composants d’éléments

Représentent une unité dans une liste ou une grille.

Exemples :
- VariableListItem
- PresetListItem
- AssetCard
- LayerRow
- ObjectRow
- PageThumbnail

---

## RÈGLE CRITIQUE

Un nom de composant doit refléter :
- son rôle réel
- et non sa structure technique

❌ Mauvais :
- ListItem
- Box
- Wrapper
- Container2

✅ Bon :
- VariableListItem
- AssetThumbnailCard
- LayerRow

---
# 📁 STRUCTURE DES DOSSIERS

## RÈGLE GÉNÉRALE

La structure doit être :

- claire

- modulaire

- orientée métier

- stable dans le temps

Ne pas créer de structure générique ou abstraite inutile.


## Structure de référence

/app
  /editor

/components
  /ui
  /lists/
    VirtualizedList.tsx
    DataTable.tsx
  /canvas
  /layout
    /panels
    /toolbar
  /forms

/modules
  /variables
  /presets
  /assets
    AssetLibraryGrid.tsx
    ThumbnailCard.tsx
  /layers
    LayerList.tsx
  /objects
    ObjectList.tsx
  /pages
    PageList.tsx

/lib
  /bindings
  /data
  /utils

/store

---

## DESCRIPTION DES DOSSIERS

### /components/ui
Composants UI génériques (shadcn + wrappers)

### /components/lists
Composants de listes et grilles :
- VirtualizedList
- DataTable

Les bibliothèques visuelles sont implémentées via :
- `AssetLibraryGrid` dans `/modules/assets`
- `ThumbnailCard` dans `/modules/assets`
- `VirtuosoGrid` (`react-virtuoso`) comme moteur technique

### /components/layout/panels
Panneaux principaux :
- LeftPanel
- RightInspector

### /components/canvas
Composants liés au canvas :
- CanvasContainer
- CanvasNodes
- SelectionOverlay

### /components/layout/toolbar
Palette flottante :
- FloatingDrawingPalette
- ToolButton

---

### /modules

Chaque module correspond à une logique métier :

#### /variables
- VariableList
- VariableItem
- VariableResolver

#### /presets
- PresetList
- PresetItem

#### /assets
- AssetLibraryGrid
- ThumbnailCard

#### /layers
- LayerList
- LayerRow

#### /objects
- ObjectList
- ObjectRow

#### /pages
- PageList
- PageThumbnail

---

### /store

Gestion de l’état :
- Zustand
- slices par domaine

---

### /lib

Logique transverse :
- binding
- mapping
- helpers
- utils

---

## RÈGLE D’OR

Chaque dossier doit correspondre à :
- un domaine métier
- ou une responsabilité claire

Ne jamais créer :
- de dossier vague
- de dossier “misc”
- de structure non justifiée

---

## 🚫 INTERDIT

Codex ne doit jamais :

- créer un dossier sans logique métier claire
- dupliquer un composant existant
- créer un composant générique au lieu d’un composant métier
- créer des noms ambigus
- mélanger UI et logique métier dans un même composant
- créer une structure différente de celle définie ici

---

## 🧠 RÈGLE FINALE

Avant de créer un composant ou un dossier, Codex doit :

1. vérifier si l’équivalent existe
2. vérifier la cohérence avec la structure
3. vérifier la logique métier
4. demander validation si doute

---
## 5. INTERDICTION D’AJOUT NON AUTORISÉ

### Interdiction stricte
Codex ne doit pas créer ou introduire sans validation explicite :
- nouvelle bibliothèque npm
- nouveau composant tiers
- nouvelle abstraction d’architecture
- nouveau store
- nouveau provider global
- nouveau pattern de state management
- nouveau design pattern UI
- nouvelle logique de rendu
- nouvelle structure de dossier “frameworkante”

### Réutilisation obligatoire
Avant toute création, Codex doit :
1. rechercher si le composant ou pattern existe déjà
2. réutiliser l’existant si possible
3. demander validation si un nouveau composant est réellement nécessaire

### Règle explicite
**Si un nouveau composant, une nouvelle bibliothèque ou une nouvelle abstraction semble nécessaire, Codex doit s’arrêter et demander mon autorisation avant de l’introduire.**

---

## 6. PRINCIPES D’ARCHITECTURE

L’application doit respecter les séparations suivantes :

- canvas d’édition
- structure document
- binding / variables
- rendu final
- UI d’administration
- état local
- état serveur

### Règle absolue
Le canvas n’est **jamais** la source du rendu final.

Le rendu final doit venir du modèle résolu, puis du pipeline de rendu validé.

---

## 7. VOLET GAUCHE — RÔLE

Le volet gauche est un panneau latéral dédié à :
- la navigation
- l’insertion d’éléments
- la gestion structurelle du template

Il ne doit pas contenir :
- les outils de dessin
- l’inspection de propriétés

---

## 8. VOLET GAUCHE — STRUCTURE

### Caractéristiques
- largeur fixe
- hauteur égale à celle définie dans l’application
- contenu scrollable indépendamment du canvas
- totalement repliable

### État replié
- aucun contenu visible
- aucun onglet visible
- une mini-icône persistante permet de le redéployer

---

## 9. ONGLETS PRINCIPAUX DU VOLET GAUCHE

Le volet gauche contient 5 onglets principaux :
- Variables
- Bibliothèques
- Calques
- Objets
- Pages

### Règles
- affichés en haut
- disposition horizontale
- **icônes uniquement**
- aucun libellé texte dans les onglets
- un seul onglet actif à la fois

## RÈGLE UI — ONGLETS

Seuls les onglets principaux du volet gauche doivent être affichés sous forme d’icônes uniquement, sans libellé texte.

Les autres systèmes d’onglets ou sous-onglets doivent suivre la spécification propre à leur zone.

### Règle `[ICÔNE]`

Quand une spécification contient `[ICÔNE]`, cela signifie :
- **aucun texte visible**
- **une icône seule**
- l’icône doit être pertinente, explicite et cohérente avec l’action ou le thème
- ne jamais ajouter de label texte si `[ICÔNE]` est demandé

Cette règle s’applique à :
- onglets
- boutons
- actions en pied de panneau
- boutons de palette
- contrôles UI spécifiés comme icônes


Seul l’état actif et le contenu associé doivent varier.

---

## 10. RÈGLES GLOBALES D’INTERACTION

Pour toutes les listes et grilles du volet gauche :
- sélection simple
- multi-sélection autorisée uniquement pour :
  - Calques
  - Objets
- glisser-déposer activé selon contexte
- menu contextuel accessible au clic droit
- pas de double-clic

## RÈGLE UI — SOUS-ONGLETS

Sauf précision contraire dans la spécification d’une zone :

- les sous-onglets peuvent comporter du texte
- ils sont affichés horizontalement
- ils conservent le même placement d’un écran à l’autre
- leur état actif par défaut est :
  - soit le premier sous-onglet
  - soit le dernier état sauvegardé si une persistance est définie

### Cohérence de placement des sous-onglets

Les sous-onglets doivent conserver :
- la même position
- le même ordre
- la même hiérarchie visuelle
- les mêmes espacements
d’un écran à l’autre ou d’un état à l’autre.

### Actions bas de panneau
- toujours visibles
- agissent sur l’élément sélectionné
- désactivées si aucun élément n’est sélectionné
- sauf Créer / Ajouter

---

## 11. ÉTATS VISUELS OBLIGATOIRES

Les éléments des listes et grilles doivent gérer :
- normal
- survolé
- sélectionné
- désactivé
- verrouillé
- masqué
- glisser-déposer en cours

---

## 12. RÈGLE UI — LISTES ET GRILLES

Les éléments HTML `ul`, `ol` et `li` ne doivent pas être utilisés pour construire des interfaces applicatives complexes
(listes de données, grilles d’assets, tableaux, calques, objets, pages, etc.).

Pour ces cas, Codex doit obligatoirement utiliser les composants métier dédiés définis dans la structure du projet et appuyés sur les bibliothèques validées de la stack.

### Typologie des composants à utiliser

#### Bibliothèques visuelles (images, icônes, emoji, assets)
- `AssetLibraryGrid` : composant métier principal
- `ThumbnailCard` : composant d’affichage d’un item
- `VirtuosoGrid` (`react-virtuoso`) : moteur de virtualisation et de rendu

`VirtuosoGrid` est utilisé uniquement comme moteur technique.
Toute la logique produit (sélection, drag & drop, menu contextuel, métadonnées, actions) doit être implémentée dans `AssetLibraryGrid`.

#### Listes longues non visuelles
- `VirtualizedList`
- basé sur `Virtuoso` (`react-virtuoso`)

#### Vues tabulaires
- `DataTable`
- basé sur `@tanstack/react-table`

#### Structures métier
- `LayerList`
- `ObjectList`
- `PageList`

### Nature des composants
Les composants suivants sont des composants métier ou applicatifs à implémenter dans la structure du projet.
Ils ne sont pas fournis directement comme composants prêts à l’emploi par des bibliothèques externes :

- `AssetLibraryGrid`
- `ThumbnailCard`
- `VirtualizedList`
- `DataTable`
- `LayerList`
- `ObjectList`
- `PageList`

### Utilisation des éléments HTML de liste
Les éléments `ul`, `ol` et `li` restent autorisés uniquement pour :
- du contenu éditorial ou textuel simple
- des listes non interactives
- le contenu riche géré par TipTap, si la sémantique le demande

### Interdiction
Codex ne doit jamais :
- implémenter une liste applicative complexe directement avec `ul`, `ol`, `li`
- reconstruire une liste applicative en DOM ad hoc sans passer par les composants définis
- contourner les composants métier en utilisant directement `VirtuosoGrid` ou `@tanstack/react-table` sans encapsulation

### Accessibilité
L’interdiction d’utiliser `ul`, `ol` et `li` pour l’UI applicative ne dispense pas de respecter l’accessibilité.
Les composants de liste, grille et tableau doivent exposer une structure sémantique ou des rôles ARIA appropriés selon leur usage.

---

## 13. ONGLET VARIABLES

### Sous-onglets
- Variables
- Presets

### Variables
- titre : Liste des variables
- filtre par nom
- liste verticale 1 colonne
- drag-and-drop :
  - insertion dans le canvas
  - ou dans le bloc texte en cours d’édition

### Presets
- titre : Liste des presets
- filtre par nom
- affichage 2 colonnes :
  - Nom
  - Type
- drag-and-drop :
  - insertion dans le canvas uniquement

### Actions en pied
- [ICÔNE] Créer
- [ICÔNE] Modifier
- [ICÔNE] Renommer
- [ICÔNE] Supprimer

---

## 14. ONGLET BIBLIOTHÈQUES

### Sous-onglets internes
- Images
- Graphiques
- Icônes
- Émojis

### Règle
Ne pas utiliser de dropdown pour ce choix.

### En-tête
- titre dynamique = bibliothèque active
- filtre par nom
- 3 actions :
  - [ICÔNE] Thumbnail
  - [ICÔNE] Liste
  - [ICÔNE] Paramètres

### Modes
#### Thumbnail
- affichage en grille

#### Liste
- colonnes :
  - Nom
  - Format
  - Taille

### Paramètres
Popover contenant :
- largeur thumbnail
- hauteur thumbnail
- afficher nom
- afficher taille

### Interaction
- drag-and-drop → insertion asset dans le canvas

### Actions en pied
- [ICÔNE] Importer
- [ICÔNE] Supprimer

### Suppression
- agit sur l’asset sélectionné
- confirmation obligatoire

---

## 15. ONGLET CALQUES

### En-tête
- titre : Liste des calques
- filtre par nom
- filtre page via Native Select :
  - Toutes
  - 1 à x

### Colonnes
- ID
- Page
- Ordre
- Nom
- Visibilité
- Verrouillage

### Interactions
- tri colonnes
- multi-sélection
- drag-and-drop → réordonnancement des calques existants uniquement
- pas de création d’objet depuis cette liste

### Icônes interactives
- visibilité :
  - œil ouvert / fermé
- verrouillage :
  - cadenas ouvert / fermé

### Actions en pied
- [ICÔNE] Créer
- [ICÔNE] Renommer
- [ICÔNE] Supprimer
- [ICÔNE] Fusionner

---

## 16. ONGLET OBJETS

### En-tête
- titre : Liste des objets
- filtres :
  - Type
  - Page
  - Calque

### Colonnes
- ID
- Type
- Page
- Calque

### Interactions
- clic simple sur ligne → sélectionne l’objet dans le canvas
- multi-sélection autorisée

### Menu contextuel
- clic droit sur la cellule “Calque” uniquement
- ce menu permet :
  - changer le calque de l’objet

### Règle métier
La page ne doit pas être modifiée directement :
- elle dépend du calque choisi

### Actions en pied
- [ICÔNE] Dupliquer
- [ICÔNE] Supprimer
- [ICÔNE] Changer de calque

### Interdiction
Ne pas créer d’action “Changer de page”.

---

## 17. ONGLET PAGES

### Contenu
- affichage des pages présentes dans le canvas
- format preview
- une page par ligne
- ordre affiché = ordre réel

### Interaction
- sélection simple
- drag-and-drop → réordonnancement des pages uniquement

### Actions en pied
- [ICÔNE] Ajouter
- [ICÔNE] Dupliquer
- [ICÔNE] Supprimer

---

## 18. PERSISTANCE DES ÉTATS UI

À mémoriser :
- dernier onglet actif
- dernier sous-onglet actif
- dernier mode Thumbnail / Liste

À ne pas mémoriser :
- état replié/ouvert du volet gauche

---

## 19. PALETTE FLOTTANTE D’OUTILS DE DESSIN

### Nature
- palette flottante indépendante
- distincte du volet gauche
- déplaçable
- repliable
- orientation verticale ou horizontale

### Barre
La palette doit avoir une petite barre permettant :
- le déplacement
- le repli
- le changement d’orientation

### Mode replié
- la palette se réduit à la taille d’une icône
- un clic sur cette icône la redéploie

### Outils
- pointeur (sélection simple)
- sélection (multi-sélection)
- main / navigation
- gomme
- import média
- lignes / flèches
- courbes
- dessin libre
- polygone
- carré / rectangle
- cercle / ovale
- arc
- zone rich text
- formes (menu dépliant)

### Couleurs
En bas ou à droite selon orientation :
- [ICÔNE] couleur contour
- [ICÔNE] couleur fond

### Actions système
Tout en bas ou toute à droite selon orientation :
- [ICÔNE] replier
- [ICÔNE] changer d’orientation

### Persistance de la palette

L’application doit mémoriser :
- la dernière orientation choisie (verticale ou horizontale)

L’application ne doit pas mémoriser :
- la position de la palette
- son état replié ou déplié

---

## 20. TEXTE / TIPTAP

Utiliser TipTap uniquement pour le contenu riche.

### Règles
- ne pas implémenter de logique de rich text en dehors de TipTap
- tables gérées via TipTap
- variables visibles en édition
- variables résolues en preview/rendu selon le pipeline produit

---

## 21. CANVAS

Le canvas est une surface de composition.

### Règles
- support déplacement
- redimensionnement
- rotation
- insertion depuis bibliothèques / variables / presets
- gestion par structure validée

### Règle absolue
Le canvas n’est pas la source du rendu final.

---

## 22. RENDU FINAL

Le rendu final doit suivre le pipeline validé :
- données
- binding
- résolution
- rendu paginé
- export

Ne jamais générer l’export final à partir d’un simple snapshot du canvas.

---

## 23. DATA / ÉTAT

### État local
- Zustand
- Immer

### État serveur
- TanStack Query

### Validation
- Zod

### Formulaires
- React Hook Form

---

## 24. BASE DE DONNÉES / ACCÈS DATA

Technologies validées :
- PostgreSQL
- Prisma
- Prisma Migrate
- Prisma Studio

### Architecture attendue
- repositories
- services métier
- binding mapper / data mapper
- variable registry
- path helpers
- view models métier

### Règle
Ne pas court-circuiter cette architecture.

---

## 25. OBSERVABILITÉ ET FIABILITÉ

- react-error-boundary → confinement local des crashs
- Sentry → erreurs, traces, diagnostics, replay

Ces outils doivent être respectés comme choix de référence.

---

## 26. CODE RULES

- TypeScript strict
- pas de `any`
- pas de logique métier inline dans les composants UI
- composants petits, réutilisables, clairement nommés
- architecture lisible
- noms explicites
- pas de duplication inutile
- réutiliser l’existant avant toute création

---

## 27. INTERDIT

Codex ne doit jamais :
- inventer des fonctionnalités
- remplacer la stack validée
- utiliser `ul/li` pour l’UI applicative
- utiliser du double-clic dans les listes
- ajouter du texte sur un bouton ou onglet quand `[ICÔNE]` est demandé
- modifier la logique produit
- déplacer des responsabilités d’une zone UI à une autre
- fusionner volet gauche et palette flottante
- créer une action “changer de page” pour les objets


---

## 28. RÈGLE FINALE

Si quelque chose n’est pas explicitement validé :
- ne pas l’implémenter
- ne pas le supposer
- demander validation

---
# 🎨 RÈGLES — CANVAS / KONVA / TRANSFORMATIONS

## 1. RÔLE DU CANVAS

Le canvas est une surface d’édition et de composition.

Il sert à :
- positionner
- sélectionner
- déplacer
- redimensionner
- faire pivoter
- organiser les éléments

Le canvas ne doit jamais être considéré comme :
- la source du rendu final
- la source unique de vérité documentaire
- un export final en soi

## RÈGLE ABSOLUE

Le canvas = surface d’édition  
Le rendu final = pipeline séparé

---

## 2. SÉPARATION DES RESPONSABILITÉS

Codex doit toujours distinguer :

### A. Géométrie externe du bloc
- position X / Y
- largeur
- hauteur
- rotation
- z-index
- page
- calque

### B. Contenu interne du bloc
- image source
- crop
- masque
- alignement interne
- texte
- style du texte
- contenu graphique interne

## RÈGLE ABSOLUE

Les transformations du bloc ne doivent pas détruire ou réécrire le contenu interne.

Le conteneur et le contenu doivent être traités comme deux niveaux différents.

---

## 3. TRANSFORMATIONS NON DESTRUCTIVES

Toutes les transformations doivent être non destructives.

### Cela signifie :

- ne jamais écraser l’original sans conserver les paramètres de transformation
- ne jamais rasteriser définitivement un élément juste pour l’afficher transformé
- ne jamais “aplatir” une rotation, un crop ou un masque dans le contenu source
- toujours conserver :
  - la source
  - les paramètres de transformation
  - les paramètres de rendu

## Exemple

Pour une image :
- source image = inchangée
- crop = paramètre
- scale = paramètre
- rotation = paramètre
- clip/mask = paramètre

La transformation ne doit jamais remplacer l’image source.

---

## 4. KONVA — USAGE ATTENDU

Konva est utilisé comme moteur de composition interactive du canvas.

Il doit être utilisé pour :
- affichage des blocs
- sélection
- déplacement
- redimensionnement
- rotation
- overlays
- guides visuels
- composition interactive

Konva ne doit pas être utilisé comme :
- moteur de rendu final
- système de génération PDF
- source canonique du document exporté

---

## 5. DONNÉES CANVAS — SOURCE DE VÉRITÉ

Les nœuds du canvas doivent être pilotés par un modèle de données clair.

Les informations de transformation doivent être stockées explicitement dans l’état :
- x
- y
- width
- height
- rotation
- scale si utilisé
- paramètres internes éventuels

## INTERDICTION

Ne pas utiliser uniquement l’état interne de Konva comme source de vérité.

Konva doit refléter l’état de l’application, pas le remplacer.

---

## 6. TRANSFORMER / RESIZE / ROTATION

Les opérations de transformation doivent toujours mettre à jour l’état applicatif proprement.

### Règle
Après toute interaction utilisateur :
- lire les nouvelles valeurs
- normaliser les valeurs si nécessaire
- écrire dans le store
- rerendre à partir du store

## INTERDICTION

Ne pas laisser les transformations vivre uniquement dans le runtime Konva sans synchronisation avec l’état de l’application.

---

## 7. SCALE VS WIDTH/HEIGHT

Codex doit manipuler avec prudence :
- `scaleX`
- `scaleY`
- `width`
- `height`

## Règle de base
Quand une transformation est terminée, l’état final doit être normalisé de manière cohérente.

Éviter de laisser indéfiniment :
- width/height d’origine
- + scale accumulée

si cela complique le modèle.

## Objectif
Le modèle de données doit rester lisible, stable et prédictible.

---

## 8. ROTATION

La rotation doit être traitée comme une propriété explicite du bloc.

### Règles
- ne jamais convertir une rotation en faux redimensionnement
- ne jamais recalculer le contenu interne pour “simuler” une rotation
- la rotation du bloc doit rester indépendante du contenu source

## INTERDICTION

Ne pas introduire de logique qui change artificiellement width/height du contenu pour compenser une rotation.

---

## 9. CROP / MASQUES / CLIPPING

Le crop, le masque et le clipping sont des propriétés de rendu interne.

### Règles
- le crop doit rester paramétrique
- le masque doit rester paramétrique
- les formes de clipping doivent être décrites comme configuration
- ne jamais écraser définitivement la source

### Exemples de masques attendus
- rectangle
- cercle
- étoile

## INTERDICTION

Ne pas “baker” un masque ou un crop dans l’asset source juste pour simplifier le canvas.

---

## 10. SVG ET EMOJI DANS LE CANVAS

### SVG
- le SVG est la forme canonique si disponible
- la rasterisation n’est qu’un moyen d’affichage dans le canvas
- ne pas perdre la référence au SVG d’origine

### Emoji
- utiliser un rendu homogène
- ne pas dépendre du rendu natif aléatoire de la plateforme pour le rendu final

## Règle
Les assets insérés dans le canvas doivent conserver leur identité et leurs métadonnées d’origine.

---

## 11. SÉLECTION

La sélection doit être gérée par l’état applicatif.

### Types attendus
- sélection simple
- multi-sélection si validée par la fonctionnalité
- sélection synchronisée avec les panneaux/listes concernés

## INTERDICTION

Ne pas implémenter une sélection purement visuelle non synchronisée avec le store.

---

## 12. GROUPES

Si des groupes existent :
- ils doivent être modélisés explicitement
- leurs enfants doivent rester identifiables
- la transformation du groupe ne doit pas détruire les transformations internes des enfants

---

## 13. CALQUES ET PAGES

Chaque objet du canvas doit toujours appartenir à :
- un calque
- une page

La page ne doit pas être gérée comme une simple coordonnée arbitraire.

Le changement de calque doit respecter la logique métier définie par l’application.

---

## 14. OVERLAYS / GUIDES / HANDLES

Les overlays d’édition doivent être clairement séparés du contenu édité.

Cela inclut :
- poignées
- cadres de sélection
- guides
- repères
- zones de drop

## Règle
Les overlays ne doivent jamais être confondus avec les éléments documentaires eux-mêmes.

---

## 15. TEXTE DANS LE CANVAS

Le texte riche appartient au système TipTap.

Le canvas peut contenir :
- un bloc rich text
- une représentation de son cadre
- ses transformations externes

Mais la logique interne du texte ne doit pas être réimplémentée dans Konva.

## INTERDICTION

Ne pas dupliquer dans Konva des comportements qui relèvent de TipTap.

---

## 16. UNDO / REDO

Toutes les transformations canvas importantes doivent être compatibles avec :
- historique
- undo
- redo

Les commandes doivent enregistrer :
- l’état avant
- l’état après
- sans perte d’information

---

## 17. PERFORMANCE

Codex doit éviter :
- rerenders inutiles
- recalculs coûteux à chaque frame
- stockage de données dérivées redondantes
- duplication d’objets Konva non nécessaire

## Règle
Favoriser :
- état minimal mais suffisant
- dérivation contrôlée
- composants canvas découplés

---

## 18. INTERDIT

Codex ne doit jamais :
- utiliser Konva comme rendu final export
- aplatir destructivement une transformation
- confondre bloc et contenu interne
- écraser l’asset source après crop/rotation/mask
- laisser l’état de Konva diverger de l’état global
- utiliser le canvas comme vérité documentaire finale
- résoudre les bugs de rotation par des hacks width/height destructifs
- résoudre les bugs de crop par une réécriture permanente de l’image source

---

## 19. RÈGLE FINALE

Toute transformation canvas doit être :
- explicite
- réversible
- non destructive
- synchronisée avec l’état applicatif
- compatible avec le pipeline de rendu final

---
# 🧱 RÈGLES — DONNÉES / NODES CANVAS / MODÈLE DE TRANSFORMATION

## NOTE DE SCOPE

Cette section définit la structure et les responsabilités du modèle de données des nœuds.

Les règles détaillées de transformation visuelle, de non-destruction, de crop, de rotation, de clipping et de rendu canvas sont définies exclusivement dans la section :
**RÈGLES — CANVAS / KONVA / TRANSFORMATIONS**

## 1. PRINCIPE GÉNÉRAL

Le canvas repose sur un modèle de données explicite.

Chaque élément visible dans le canvas doit être représenté par un nœud de données clair, sérialisable et stable.

Un nœud n’est pas une vue React.
Un nœud n’est pas un objet Konva.
Un nœud est une représentation applicative d’un élément du document.

## RÈGLE ABSOLUE

Le modèle de données précède toujours l’implémentation visuelle.

Le rendu React/Konva doit refléter les données, jamais les remplacer.

---

## 2. NŒUD CANVAS — STRUCTURE ATTENDUE

Tout élément du canvas doit avoir un identifiant stable et une structure explicite.

Un nœud doit au minimum être pensé autour de :

- identité
- type
- géométrie
- rattachement structurel
- propriétés métier
- contenu ou référence de contenu
- style
- état éventuel

## Exemples de dimensions structurelles attendues

### Identité
- id stable
- type explicite

### Géométrie externe
- x
- y
- width
- height
- rotation

### Rattachement structurel
- pageId
- layerId
- parentId si nécessaire

### Contenu
- texte
- image source
- variable
- preset
- forme
- asset
- référence métier

### Style
- couleur
- bordure
- fond
- opacité
- paramètres de rendu

---

## 3. RÈGLE DE MODÉLISATION

Chaque type d’élément doit être modélisé de façon explicite.

Codex ne doit jamais créer :
- un type générique flou
- un bloc fourre-tout
- un schéma polymorphe ambigu
- un objet JSON “libre” sans structure claire

## INTERDICTION

Ne jamais utiliser une structure de type :
- `any`
- `payload` non typé
- `config` indifférencié sans contrat
- objet libre recevant n’importe quelle propriété

---

## 4. TYPES DE NŒUDS

Les types de nœuds doivent refléter les vraies responsabilités métier.

Exemples attendus :
- richText
- image
- shape
- line
- arrow
- freeDraw
- polygon
- arc
- presetText
- variableText
- asset
- group si validé
- page
- layer

## RÈGLE

Le nom d’un type doit être :
- explicite
- stable
- orienté métier ou fonction
- non ambigu

---

## 5. SÉPARATION DES NIVEAUX

Codex doit toujours séparer :

### A. Le nœud applicatif
La donnée métier persistable

### B. Le composant React
La représentation UI

### C. Le nœud Konva
La représentation graphique interactive

## RÈGLE ABSOLUE

Ne jamais fusionner ces trois niveaux dans un même objet ou une même logique.

---

## 6. DONNÉES MÉTIER VS DONNÉES D’ÉDITION

Un nœud peut contenir :
- des données documentaires
- des données d’édition

Mais ces deux dimensions doivent rester lisibles.

### Données documentaires
Ce qui a du sens pour le document :
- contenu
- variable liée
- preset lié
- style
- type de bloc

### Données d’édition
Ce qui a du sens pour l’éditeur :
- sélection
- guides
- handles
- état temporaire d’interaction

## RÈGLE

Les données d’édition temporaires ne doivent pas polluer les données documentaires persistées.

---

## 7. PERSISTENCE

Les nœuds doivent être sérialisables.

Ils doivent pouvoir être :
- sauvegardés
- relus
- reconstruits
- transformés pour le rendu final

## RÈGLE ABSOLUE

Le modèle de nœud doit rester compatible avec :
- la persistence
- l’historique
- l’undo/redo
- le binding
- le rendu final

---

## 8. MODÈLE DE TRANSFORMATION

Les nœuds doivent stocker explicitement les paramètres nécessaires à leur transformation et à leur rendu.

Le modèle de données doit permettre :
- une lecture claire de la géométrie du bloc
- une séparation entre transformation externe et contenu interne
- la compatibilité avec l’historique, la persistance et le rendu final

Les règles détaillées de transformation non destructive, de crop, de masque, de clipping, de rotation et de resize sont définies dans la section :
**RÈGLES — CANVAS / KONVA / TRANSFORMATIONS**

---

## 9. IMAGE NODES

Un nœud image doit distinguer clairement :
- la source originale
- la géométrie externe du bloc
- les paramètres internes de rendu

Le modèle doit permettre de conserver la source et les paramètres associés sans ambiguïté.

Les règles détaillées de transformation non destructive, de crop, de masque, de clipping et de rotation sont définies dans la section :
**RÈGLES — CANVAS / KONVA / TRANSFORMATIONS**

---

## 10. RICH TEXT NODES

Les blocs de texte riche doivent être reliés au système TipTap.

Le nœud canvas ne doit pas tenter de réimplémenter l’éditeur.

### Le nœud doit contenir
- référence au contenu riche
- géométrie du bloc
- propriétés de présentation externes

## INTERDICTION

Ne pas stocker dans Konva ou dans des objets canvas une logique concurrente à TipTap.

---

## 11. VARIABLES ET PRESETS

### Variables
Une variable est une référence de données résolue par le système de binding.

Elle ne doit pas être convertie arbitrairement en texte brut dans le modèle source.

### Presets
Un preset est un bloc texte stylisé réutilisable.
Ce n’est pas un conteneur.
Ce n’est pas une mise en page.
Ce n’est pas un groupe de blocs.

## RÈGLE

Variables et presets doivent rester des concepts distincts dans le modèle.

---

## 12. CALQUES ET PAGES

Tout nœud doit appartenir à :
- un calque
- une page

## RÈGLE

Cette relation ne doit jamais être implicite ou dérivée uniquement du visuel.

Le rattachement structurel doit être stocké explicitement.

---

## 13. GROUPES

Si des groupes existent :
- ils doivent être des entités explicites
- la relation parent/enfant doit être claire
- les enfants doivent rester identifiables individuellement

## INTERDICTION

Ne pas “aplatir” un groupe sans règle explicite.
Ne pas perdre la structure enfant lors d’une transformation de groupe.

---

## 14. IDENTIFIANTS

Chaque nœud doit avoir un identifiant stable.

### Règle
- l’id ne doit pas changer à chaque rendu
- l’id ne doit pas être dérivé d’un index de tableau
- l’id doit survivre aux opérations d’édition ordinaires

## INTERDICTION

Ne jamais utiliser la position dans une liste comme identifiant logique.

---

## 15. ORDER / Z-INDEX / ORDRE VISUEL

L’ordre visuel ne doit pas être implicite ou dépendre seulement du rendu Konva.

Il doit exister une logique d’ordre explicite liée :
- au calque
- à l’ordre dans le calque
- ou à la structure validée

## RÈGLE

Le rendu doit refléter l’ordre des données, pas l’inverse.

---

## 16. SÉLECTION ET ÉTAT TEMPORAIRE

La sélection n’est pas une propriété documentaire du nœud.

Elle appartient à l’état de l’éditeur.

## INTERDICTION

Ne pas persister dans les données documentaires :
- isSelected
- isHovered
- handles visibles
- état de drag en cours
- état de resize en cours

---

## 17. HISTORY / UNDO / REDO

Le modèle de nœud doit permettre des snapshots ou commandes clairs.

Toute mutation importante doit être :
- compréhensible
- reversible
- stable

## RÈGLE

Le modèle ne doit pas rendre l’historique impossible à maintenir.

---

## 18. VALIDATION

Les nœuds doivent être validables par schéma.

### Règle
Utiliser une validation explicite du modèle :
- type
- structure
- contraintes minimales

## INTERDICTION

Ne pas faire confiance à des objets partiels non validés dans le store ou le rendu.

---

## 19. NORMALISATION

Le système doit pouvoir normaliser un nœud si nécessaire.

Exemples :
- dimensions manquantes
- valeurs invalides
- valeurs hors bornes
- structure incomplète

## RÈGLE

La normalisation doit être explicite et centralisée, pas dispersée dans les composants UI.

---

## 20. RÈGLE DE CRÉATION DES NŒUDS

La création d’un nœud doit passer par une fabrique claire ou une logique centralisée.

## INTERDICTION

Ne jamais créer des nœuds “à la main” un peu partout avec des formes différentes.

## OBJECTIF

Garantir :
- homogénéité
- validation
- compatibilité historique
- compatibilité rendu

---

## 21. RÈGLE FINALE

Avant de modifier la structure interne d’un nœud, Codex doit vérifier :

1. la cohérence métier du type
2. la séparation document / édition
3. la compatibilité avec le canvas
4. la compatibilité avec l’historique
5. la compatibilité avec le rendu final

Si un doute existe :
- ne pas improviser
- demander validation


---

# 🧠 RÈGLES — STORE / ZUSTAND / COMMANDS / UNDO-REDO

## 1. PRINCIPE GÉNÉRAL

L’état de l’éditeur est centralisé dans Zustand.

Cet état est la source de vérité pour :
- le canvas
- la sélection
- les transformations
- la structure (pages, calques, objets)
- les interactions utilisateur

## RÈGLE ABSOLUE

Aucune logique critique ne doit dépendre uniquement de :
- l’état local React
- l’état interne de Konva

Tout doit passer par le store.

---

## 2. STRUCTURE DU STORE

Le store doit être organisé par domaines.

### Domaines attendus

- document
- pages
- layers
- objects
- selection
- viewport
- history

## RÈGLE

Ne pas créer un store monolithique.

Utiliser des slices logiques cohérents.

---

## 3. MUTATIONS — INTERDITES DIRECTEMENT

Codex ne doit jamais modifier l’état directement.

## INTERDIT

- setState brut avec logique inline
- mutation directe d’objet
- écriture partielle sans cohérence globale

---

## 4. COMMANDS (OBLIGATOIRE)

Toutes les actions utilisateur doivent passer par des **commands**.

### Exemple de commands

- addNode
- updateNode
- deleteNode
- moveNode
- resizeNode
- rotateNode
- changeLayer
- reorderLayer
- reorderPage
- duplicateNode

## RÈGLE ABSOLUE

Toute modification du store doit passer par une command.

---

## 5. STRUCTURE D’UNE COMMAND

Une command doit contenir :

- intention claire
- données nécessaires
- logique de mutation
- possibilité d’inversion (undo)

---

## 6. UNDO / REDO

Le système doit être basé sur :
- snapshots
ou
- commands inversables

## RÈGLE

Chaque command doit être compatible avec :
- undo
- redo

---

## 7. HISTORY STORE

Le store doit contenir :

- past
- present
- future

## INTERDIT

Ne pas implémenter undo/redo uniquement avec :
- des flags
- des hacks
- des mutations partielles

---

## 8. IMMUTABILITÉ

Utiliser Immer pour toutes les mutations.

## RÈGLE

- mutations contrôlées
- état prévisible
- historique fiable

---

## 9. SÉLECTION

La sélection est un état global.

### Doit contenir :
- sélection simple
- multi-sélection

## INTERDIT

- gérer la sélection uniquement dans Konva
- dupliquer la sélection dans plusieurs états

---

## 10. SYNCHRONISATION

Après chaque interaction utilisateur :

1. récupérer les nouvelles valeurs
2. passer par une command
3. mettre à jour le store
4. rerendre

## INTERDIT

Ne pas laisser des états divergents :
- canvas vs store
- UI vs données

---

## 11. DÉCOUPLAGE UI / STORE

Les composants UI :
- lisent l’état
- déclenchent des commands

Ils ne doivent pas :
- contenir de logique métier complexe
- manipuler directement les données

---

## 12. NORMALISATION

Le store doit contenir des données normalisées.

### Exemple

- nodes indexés par id
- relations explicites (pageId, layerId)

## INTERDIT

Ne pas stocker :
- des structures imbriquées incontrôlées
- des duplications de données

---

## 13. IDENTIFIANTS

Tous les éléments doivent utiliser des IDs stables.

Utiliser :
- nanoid

## INTERDIT

- index de tableau comme identifiant
- id instable

---

## 14. PERFORMANCE

Codex doit éviter :

- rerenders globaux
- recalculs inutiles
- dépendances larges

## RÈGLE

Utiliser :
- selectors Zustand
- granularité des slices

---

## 15. COMMANDS COMPOSÉES

Certaines actions nécessitent plusieurs mutations.

Exemple :
- déplacer un objet → change position + potentiellement calque

## RÈGLE

Une command doit gérer toute la logique métier associée.

---

## 16. INTERDICTIONS CRITIQUES

Codex ne doit jamais :

- modifier directement le store sans command
- contourner le système d’historique
- dupliquer l’état dans plusieurs endroits
- créer des états incohérents
- stocker des données dérivées inutiles
- gérer l’état critique uniquement dans Konva
- implémenter undo/redo sans structure claire

---

## 17. RÈGLE FINALE

Avant toute modification d’état, Codex doit vérifier :

1. est-ce une command ?
2. est-ce cohérent avec l’historique ?
3. est-ce centralisé dans le store ?
4. est-ce non destructif ?
5. est-ce aligné avec le modèle de données ?

Si une réponse est non :
→ ne pas implémenter
→ demander validation

# ⚙️ RÈGLES — COMMAND PATTERN AVANCÉ / EVENTS / SIDE EFFECTS

## 1. SÉPARATION STRICTE

Codex doit toujours séparer :

| Niveau | Responsabilité |
|------|----------------|
| UI | déclencher actions |
| Command | mutation pure |
| Store | état |
| Events | notification |
| Effects | actions externes |

---

## 2. INTERDICTIONS CRITIQUES

Codex ne doit jamais :

- appeler une API dans une command
- déclencher un toast dans une command
- modifier le DOM directement dans une command
- coupler mutation et effet secondaire
- exécuter une logique métier dans un composant React

---

## 3. EFFETS DÉCLENCHÉS PAR ÉVÉNEMENTS

Les effets doivent être déclenchés par des événements.

### Exemple

Après :
- addNode

Event :
- node:created

Effets possibles :
- sauvegarde
- analytics
- refresh preview

---

## 4. SYNCHRONISATION BACKEND

Les interactions backend doivent être traitées comme des side effects.

## RÈGLE

- jamais dans les commands
- toujours après mutation

---

## 5. ERREURS

Les erreurs doivent être gérées dans la couche side effects.

## INTERDIT

- throw brut dans command sans gestion
- casser le store sur erreur externe

---

## 6. COMMANDS COMPOSÉES AVANCÉES

Certaines actions nécessitent :

- plusieurs steps
- plusieurs events
- plusieurs effets

## RÈGLE

Tout doit rester :
- déterministe
- cohérent
- undoable

---

## 7. COMPATIBILITÉ UNDO / REDO

Chaque command doit :

- être enregistrable
- être inversable
- produire un état cohérent

---

## 8. PERFORMANCE

Le système doit éviter :

- déclenchements inutiles d’events
- effets en cascade non contrôlés
- recalculs multiples

---

## 9. LOGGING

Les événements peuvent être utilisés pour :
- logs
- debug
- audit

---

## 10. RÈGLE FINALE

Avant d’implémenter une action, Codex doit vérifier :

1. est-ce une command ?
2. est-elle pure ?
3. les side effects sont-ils séparés ?
4. les events sont-ils définis ?
5. la logique est-elle undoable ?
6. la séparation des responsabilités est-elle respectée ?

Si une réponse est non :
→ ne pas implémenter
→ demander validation

--

# 🖨️ RÈGLES — EXPORT / RENDER / PIPELINE

## 1. PRINCIPE GÉNÉRAL

Le rendu final du document ne doit jamais dépendre du canvas.
Le rendu final repose sur un pipeline structuré et déterministe.
Respecter strictement la séparation édition / rendu définie dans la section Pipeline.

## RÈGLE ABSOLUE

Canvas ≠ rendu final  
Canvas = édition  
Pipeline = rendu

---

## 2. PIPELINE DE RENDU (OBLIGATOIRE)

Le rendu doit suivre strictement les étapes suivantes :

1. chargement des données
2. mapping des données vers variables
3. résolution des variables
4. application des presets
5. construction du document HTML structuré
6. pagination (Vivliostyle)
7. rendu headless (Playwright / Chromium)
8. post-processing (Sharp si nécessaire)
9. export final (PDF / image)

## INTERDICTION

Ne jamais court-circuiter ce pipeline.

---

## 3. SOURCE DE VÉRITÉ DU RENDU

Le rendu final doit être basé sur :

- le modèle de document
- les données résolues
- les variables
- les presets

## INTERDIT

Ne jamais :
- capturer le canvas pour générer un PDF
- exporter une image du canvas comme rendu final
- utiliser Konva comme moteur de rendu final

---

## 4. MODÈLE HTML DE RENDU

Le rendu doit produire un HTML structuré.

### Ce HTML doit être :

- propre
- déterministe
- sans dépendance à React
- sans dépendance à Konva

## RÈGLE

Le HTML doit représenter le document final, pas l’état du canvas.

---

## 5. VIVLIOSTYLE — PAGINATION

Vivliostyle est responsable de :

- pagination
- gestion des pages
- headers / footers
- flow du document
- gestion des sauts de page

## RÈGLE ABSOLUE

Toute logique de pagination doit être gérée par Vivliostyle.

## INTERDIT

Ne pas implémenter une pagination custom dans React ou Konva.

---

## 6. PLAYWRIGHT — RENDU FINAL

Playwright est utilisé pour :

- charger le HTML final
- appliquer le CSS
- générer le rendu réel
- produire PDF ou image

## RÈGLE

Playwright doit être utilisé comme moteur de rendu headless unique.

---

## 7. SHARP — POST-PROCESSING

Sharp peut être utilisé pour :

- optimisation d’image
- conversion
- redimensionnement
- compression

## RÈGLE

Sharp est un outil de post-processing uniquement.

---

## 8. WYSIWYG — CONSISTANCE

Le rendu doit être fidèle entre :

- éditeur
- preview
- export

## RÈGLE ABSOLUE

Le rendu final doit correspondre visuellement à ce que l’utilisateur voit.

---

## 9. UNITÉS ET DIMENSIONS

Les dimensions doivent être cohérentes entre :

- canvas
- HTML
- CSS
- PDF

## RÈGLE

Utiliser un système cohérent :

- px pour le canvas
- conversion claire vers mm / pt pour PDF

---

## 10. POLICES

Les polices doivent être :

- chargées correctement
- disponibles dans le rendu headless
- cohérentes entre éditeur et export

## INTERDIT

Ne pas dépendre de polices non embarquées.

---

## 11. IMAGES

Les images doivent :

- conserver leur qualité
- être chargées correctement dans le pipeline
- respecter les transformations définies

## RÈGLE

Ne pas rasteriser inutilement en amont.

---

## 12. SVG

Le SVG est un format prioritaire.

## RÈGLE

- conserver le SVG autant que possible
- ne rasteriser que si nécessaire

---

## 13. EMOJI

Les emoji doivent être rendus de manière cohérente.

## RÈGLE

Ne pas dépendre du rendu natif aléatoire des systèmes.

---

## 14. TABLES

Les tables doivent être compatibles avec :

- HTML
- CSS
- pagination Vivliostyle

## RÈGLE

Utiliser une structure standard.

---

## 15. VARIABLES ET PRESETS

Le rendu doit se faire après résolution complète :

- des variables
- des presets

## INTERDIT

Ne pas laisser de placeholder non résolu dans le rendu final.

---

## 16. PERFORMANCE

Le pipeline doit :

- être déterministe
- éviter les recalculs inutiles
- produire un rendu stable

---

## 17. ERREURS

Les erreurs de rendu doivent être :

- capturées
- loggées
- traçables

## RÈGLE

Ne pas échouer silencieusement.

---

## 18. TESTABILITÉ

Le rendu doit être testable.

### Possibilités :

- snapshot HTML
- comparaison visuelle
- tests PDF

---

## 19. INTERDICTIONS CRITIQUES

Codex ne doit jamais :

- utiliser le canvas comme source d’export
- utiliser Konva pour générer un PDF
- implémenter un moteur de pagination custom
- mélanger logique React et rendu final
- produire un HTML dépendant de l’état UI
- court-circuiter Vivliostyle
- contourner Playwright

---

## 20. RÈGLE FINALE

Avant d’implémenter un export, Codex doit vérifier :

1. le pipeline est-il respecté ?
2. le rendu est-il indépendant du canvas ?
3. les variables sont-elles résolues ?
4. le HTML est-il propre et déterministe ?
5. la pagination est-elle déléguée à Vivliostyle ?
6. le rendu passe-t-il par Playwright ?
7. les transformations sont-elles respectées ?

Si une réponse est non :
→ ne pas implémenter
→ demander validation

