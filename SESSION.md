# Session

## Etat courant

- workspace initialise dans `Canvas_Editor_V3`
- socle copie depuis le starter officiel CE.SDK `showcase-advanced-ui`
- dependances cibles alignees sur `React 19.2.0` et `Next.js 16.2.0`
- stack UI additionnelle alignee sur `shadcn 4.3.0`, `tailwindcss 4.2.2` et `eslint 10.2.0`
- dossier `docs/` conserve comme source de verite locale

## Audit retenu

- `showcase-advanced-ui` est le meilleur socle initial pour le shell editor-first
- `showcase-batch-image-generation` sert de reference secondaire pour le flux template -> instances -> generation
- `showcase-automated-resizing` sert de reference secondaire pour le flux de resize multi-formats
- le repo officiel actuellement audite publie encore ces starters en `react 19.0.1` et `next 15.1.9`, donc un realignement local etait necessaire

## Prochain bloc recommande

- Phase 1 du cadrage: stabiliser le shell editeur dans l'arborescence locale
- conserver le socle runnable
- ne pas ouvrir encore auth, candidats, CRUD templates ou base de donnees

## Bloc actif

- Phase 1 engagee sur le shell editeur uniquement
- top bar en cours d'alignement vers `Close / Document / Undo / Title / Zoom / Save`
- rail gauche rendu icon-first avec ajout d'une entree `Variables`
- panneau droit force sur l'inspecteur contextuel
- panneau `Variables` pose comme placeholder structurel, sans binding metier a ce stade
- etat initial recentre sur le mode `Document` plutot que sur une selection d'objet
- theme du shell repasse en clair pour mieux coller aux references editoriales
- barre contextuelle texte explicitee pour converger vers les ecrans `01` et `16`
- menu contextuel objet complete vers `replace / flip / copy / paste / duplicate / delete / more`
- enveloppe Next du shell remplacee par une mise en page editoriale dediee
- assets CE.SDK servis localement depuis `public/cesdk-assets/assets`
