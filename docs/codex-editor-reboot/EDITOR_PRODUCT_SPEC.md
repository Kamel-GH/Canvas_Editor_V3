# Editor Product Spec

## Purpose

This document is the working contract for the editor/template/canvas product.

It defines what the product must do, how it must be organized, which components
serve each part of the system, and the frozen implementation stack to follow.


If an implementation, a screenshot interpretation, or an informal discussion
conflicts with this document, this document wins for editor scope decisions.

## Product Definition

The product is a studio for creating and generating personalized documents and
marketing assets from data.

Primary outputs:

- CV and resume templates
- reports
- posters
- flyers
- presentations

The editor must allow a user to:

- compose a document visually
- create reusable text presets
- manage images, icons, shapes, and pages
- browse and insert emoji
- import SVG assets with faithful preview support
- bind document content to database-driven variables
- preview the final result before export
- export a faithful final document in multiple formats

## Non-Negotiable Product Goals

- WYSIWYG consistency between editor, preview, and export
- data-driven generation from database values
- reusable preset-based content creation
- contextual editing for each selected object type
- strong separation between document data, editor UI, and export pipeline
- support for multi-page documents
- support for text, images, shapes, groups, pages, and tables

## Scope

### In scope

- template and canvas editor
- variable library
- preset library
- image library with real thumbnails
- icon library
- emoji library
- shapes and graphic components library
- page list and page management
- contextual inspector
- preview
- export
- support
- settings

### Out of scope for the editor core

- authentication flows
- user administration
- candidate management
- database administration

These modules can consume the editor, but they must not define its core
architecture.

## Product Model

### Variable

A variable is a named data binding target.

It can resolve to:

- text
- number
- date
- boolean
- enum
- color
- image
- photo

Variables are defined by the binding module and then consumed by presets and
document objects.

### Preset

A preset is a single stylized text block.

It is not a container of repeating sub-blocks.

A preset can include:

- styled text
- inline variables
- icons
- spacing and dimensions
- table content when needed
- placeholder content for preview

Presets must be rendered as miniature thumbnails in the preset library.

Presets are created inside the text editor and become reusable building blocks
available to the rest of the editor.

#### Preset examples

The following examples illustrate the expected preset behavior.

**Example 1: `Expériences`**

This preset is a single stylized text block for a CV section. It contains:

- a section title with a specific text style
- a separation line
- a content line such as:
  - `[date_Debut] • [Date_Fin]`
  - a tabulation
  - `[Entreprise]`
- an icon associated with the section or the block

In edit mode, the variables remain visible as variables.
In preview mode, they are replaced by placeholder or resolved data.
In the preset library, the block appears as a rendered thumbnail.

**Example 2: compact experience line**

This preset is a shorter text block for a CV section. It contains:

- an icon
- `[date_Debut] • [Date_Fin]`
- a tabulation
- `[Entreprise]`

This version is useful when the layout requires a denser presentation while
remaining data-driven and reusable.

In both cases:

- the preset is authored in the rich text editor
- the preset uses the available text styles
- the preset uses variables created by the binding module
- the preset does not contain repeating sub-blocks
- the preset is inserted as one reusable text component

### Page

A page is a document surface with its own size, background, and content nodes.

### Node

A node is a placed object inside a page or composition.

Supported node families:

- text
- image
- shape
- group
- component
- page-level object
- placeholder
- emoji
- svg

## Interface Organization

### Top bar

The top bar is fixed across the entire application.

It must expose at least:

- back or close
- document name
- document mode
- undo and redo
- preview
- export
- save
- user account access

### Left rail tools

The left rail is a vertical interaction rail next to the canvas.

It must expose at least:

- selection
- multi-selection
- pan or hand tool
- zoom
- crayon
- polygon
- circle
- rectangle
- line or arrow
- text creation

These tools are interaction modes, not resources.

### Left panel

The left panel is a resource and structure panel.

It must provide access to:

- variable library
- preset library
- image library
- icon library
- shapes and graphic components library
- page list with thumbnails
- object list
- layer management

This panel is a source of content and structure, not the inspector.

### Center canvas

The center is the composition surface.

It must support:

- drag and drop from libraries
- selection
- multi-selection
- move
- resize
- rotation
- align
- arrange
- group and ungroup
- lock and unlock
- zoom
- rulers and guides
- page navigation

The center is the primary interaction zone.

### Right inspector

The right side is a contextual inspector.

It must display properties for:

- text
- image
- shape
- group
- preset block
- page
- document

It also handles object-specific manipulation controls.

The inspector changes according to the selected object type.

### Floating palette

The floating palette is global, not contextual.

It may expose:

- page navigation
- zoom in and out
- fit to screen
- pan
- other global editor tools decided later

It is not the same thing as the contextual inspector or the right panel.

### Context menu

The context menu is triggered by right click on an object or a multi-selection.

It must expose object-specific actions such as:

- duplicate
- delete
- group or ungroup
- lock or unlock
- bring forward or send backward
- align or distribute
- type-specific operations

It is strictly contextual and must not replace global navigation.

### Interface layout summary

| Zone | Role | Notes |
|---|---|---|
| Top bar | Global application control | fixed across all screens |
| Left rail tools | Interaction and drawing modes | separate from resources |
| Left panel | Resources and structure | libraries, pages, objects, layers |
| Center canvas | Composition and editing | the main editor surface |
| Right inspector | Contextual inspection and manipulation | object-specific controls |
| Floating palette | Global quick tools | non-contextual |
| Context menu | Object-specific actions | right-click only |

## Functional Requirements

### Variable library

The editor must support:

- create variable
- edit variable
- delete variable
- search variable
- validate variable definition
- assign source field mapping
- expose variable usage in the document

### Binding and mapping

The editor must support:

- mapping database fields to variables
- binding variables to text content
- binding variables to image/photo content
- binding variables to shape or display options when relevant
- previewing resolved values
- falling back gracefully when data is missing

### Preset library

The editor must support:

- create preset from a rich text block
- edit preset
- duplicate preset
- delete preset
- preview preset thumbnail
- insert preset into a template
- resolve variables inside the preset

### Image library

The editor must support:

- thumbnails backed by real image assets
- search
- categories
- insertion into the document
- replacement of an existing image

### Icon library

The editor must support:

- vector icon browsing
- insertion into presets and compositions
- styling and sizing inside the inspector

### Emoji library

The editor must support:

- browsing emoji from a dedicated picker
- inserting emoji into text blocks, presets, and compositions
- storing emoji as native Unicode content in the document model
- rendering emoji consistently in the editor, preview, and export pipeline

Twemoji is the preferred rendering helper for normalized emoji output.

### SVG assets

The editor must support:

- importing SVG assets
- preserving the SVG source as the canonical stored asset
- rendering a preview of SVG assets inside the canvas and inspector surfaces
- exporting SVG faithfully when the target format supports it

SVG is not edited as a bitmap-only artifact. Rasterization is only an
implementation detail for canvas preview or bitmap-based outputs.

### Shapes and graphic components library

The editor must support:

- basic shapes
- lines and separators
- reusable graphic components
- insertion into the canvas
- property editing in the inspector

### Page management

The editor must support:

- page list
- create page
- duplicate page
- delete page
- reorder page
- page sizing
- page orientation
- page background

### Rich text editor

The editor must support:

- TipTap as the text engine
- inline text styles
- paragraph styles
- tables
- table borders and padding
- merge and split cells
- variable insertion
- preview mode
- edit mode with visible variables

### Table editing

The text editor must manage tables with Word-like capabilities:

- add row
- delete row
- add column
- delete column
- merge cells
- split cells
- cell fill
- borders
- padding
- horizontal rules when relevant

### Image block editing

The image block must support:

- drag
- resize
- rotate
- crop
- masks
- filters
- border
- shadow
- replace

### Canvas composition

The canvas must support:

- select
- move
- resize
- rotate
- flip
- duplicate
- delete
- group
- ungroup
- align
- arrange
- layer management

## Rendering and Generation

### Canonical rule

The final output must be produced from the resolved document model, not from an
ad hoc canvas snapshot.

### Resolution order

Generation must happen in this order:

1. load source data
2. map data fields to variables
3. resolve presets
4. materialize text, images, photos, icons, and table content
5. build the canonical document view
6. paginate and render
7. export to target format

### Paged output

Vivliostyle intervenes after the document content is resolved and before the
final paginated output is emitted.

It is used to:

- paginate resolved HTML/CSS content
- finalize page-by-page layout
- support print-like document flow
- preserve WYSIWYG fidelity between preview and final export

Playwright is the headless Chromium execution layer used to render the resolved
document and generate automated outputs from the HTML/CSS result.

Sharp is the image post-processing layer used after rendering for:

- resizing
- cropping
- conversion
- optimization
- thumbnail generation

### Output formats

The first required output formats are:

- PDF
- HTML
- JPEG

PPTX is optional but should remain architecturally possible.

## Frozen Stack Contract

This stack is fixed. Use stable releases only. No beta, rc, canary, alpha, or
experimental tags are allowed. If the stack changes, update this section and
`package.json` together.

| Area | Frozen packages | Role |
|---|---|---|
| App shell | `next@16.2.4`, `react@19.2.5`, `react-dom@19.2.5`, `typescript@6.0.3` | application shell, routing, client/server composition |
| Authentication | `better-auth@1.6.5` | sessions, auth flows, identity layer |
| Database / ORM | `prisma@7.7.0`, `@prisma/client@7.7.0` | schema, migrations, typed database access |
| UI primitives | `shadcn@4.3.0`, `@radix-ui/react-slot@1.2.3`, `@floating-ui/react@0.27.16`, `tailwindcss@4.2.2`, `@tailwindcss/postcss@4.2.2`, `class-variance-authority@0.7.1`, `clsx@2.1.1`, `tailwind-merge@3.5.0`, `lucide-react@1.8.0`, `motion@12.38.0`, `sonner@2.0.7` | interface composition, overlays, micro-interactions, icons, feedback |
| State / server state / forms / validation | `@tanstack/react-query@5.99.2`, `zustand@5.0.12`, `immer@11.1.4`, `react-hook-form@7.72.1`, `zod@4.3.6`, `i18next@26.0.6` | server state, editor state, command state, forms, schemas, localization |
| Canvas / composition | `konva@10.2.5`, `react-konva@19.2.3`, `react-konva-utils@2.0.0`, `@dnd-kit/core@6.3.1`, `@dnd-kit/sortable@10.0.0`, `@dnd-kit/utilities@3.2.2`, `tinykeys@3.0.0` | central scene, drag/drop, selection, transform, image loading, HTML overlays, shortcuts |
| Rich text and tables | `@tiptap/react@3.22.4`, `@tiptap/starter-kit@3.22.4`, `@tiptap/pm@3.22.4`, `@tiptap/extension-image@3.22.4`, `@tiptap/extension-placeholder@3.22.4`, `@tiptap/extension-text-style@3.22.4`, `@tiptap/extension-color@3.22.4`, `@tiptap/extension-text-align@3.22.4`, `@tiptap/extension-underline@3.22.4`, `@tiptap/extension-character-count@3.22.4`, `@tiptap/extension-typography@3.22.4`, `@tiptap/extension-unique-id@3.22.4`, `@tiptap/extension-table@3.22.4` | text blocks, tables, variable-aware rich content, preset editor |
| Lists / admin / libraries | `react-virtuoso@4.18.5`, `@tanstack/react-table@8.21.3`, `@tanstack/react-virtual@3.13.24` | virtualized asset libraries, CRUD views, logs, admin tables |
| Export / rendering | `vivliostyle@2019.8.101`, `playwright@1.59.1`, `sharp@0.34.5` | canonical paginated rendering, headless export in Chromium, image post-processing |
| Emoji / SVG rendering | `emoji-picker-react@4.18.0`, `twemoji@14.0.2`, `canvg@4.0.3` | emoji picker UI, normalized emoji output, SVG rasterization for preview and bitmap-based outputs |
| Utilities | `date-fns@4.1.0`, `nanoid@5.1.9`, `react-colorful@5.6.1`, `react-error-boundary@6.1.1`, `react-slider@2.0.6` | date formatting, temporary identifiers, color UI, crash isolation, sliders |

Packages not listed here are not part of the approved stack. Legacy code may
remain in the repository, but it must stay isolated from the frozen runtime
dependencies.

## Roles By Component

### TipTap

TipTap is the text system.

It handles:

- text blocks
- paragraph formatting
- inline styles
- variables inside text
- tables
- preview and edit modes

### Konva

Konva is the composition and interaction system.

It handles:

- object placement
- drag and drop
- resize
- rotation
- selection
- layering
- image block manipulation
- mask and filter interactions for photo blocks

react-konva is the React binding for Konva.

react-konva-utils provides supporting hooks and helpers such as image loading and
HTML overlays inside the canvas.

### Vivliostyle

Vivliostyle is the pagination and print flow layer.

It runs after the document has been resolved into actual content.

It receives the resolved HTML/CSS document and produces the paginated canonical
layout used for final output.

### Playwright

Playwright is the headless execution and capture layer.

It is used to:

- render the resolved HTML/CSS document in Chromium
- generate PDF outputs
- generate PNG and JPEG outputs
- generate automated previews

### Sharp

Sharp is the image post-processing layer.

It is used to:

- resize images
- crop images
- convert formats
- optimize outputs
- generate thumbnails

### Document model

The document model is the source of truth.

It stores:

- pages
- nodes
- styles
- variables
- bindings
- presets
- asset references
- generation metadata

## Refactoring Plan

### Phase 1: freeze the contract

- keep this document as the editorial contract
- keep the document model explicit
- avoid UI-first decisions that bypass the model

### Phase 2: separate the data layer

- isolate variables
- isolate bindings
- isolate source records
- isolate preset definitions

### Phase 3: separate the editor surface

- keep left panel as resource library
- keep center as composition surface
- keep right as contextual inspector

### Phase 4: isolate specialized engines

- TipTap for text and tables
- Konva for composition and photo blocks
- Vivliostyle for paginated output
- Playwright for headless rendering and export generation
- Sharp for image post-processing

### Phase 5: keep legacy vendor code isolated

- keep legacy vendor code outside the frozen runtime stack
- do not let archived components reintroduce removed dependencies
- preserve the current product contract while the new implementation matures

### Phase 6: replace legacy assumptions with internal implementation

- remove legacy runtime assumptions from the active code path
- keep the same document contract
- keep the same editor behaviors
- validate each replaced capability with user flows

## Implementation Rules

- one source of truth for the document
- one binding model for all data-driven content
- one preview pipeline for editor and export parity
- one inspector contract per node type
- specialized tools may be used only when they are better than the generic
  canvas tool for that specific block

## Acceptance Criteria

The document contract is respected when:

- a template can be opened, edited, previewed, and exported
- variables can be mapped to text and media
- presets can be inserted and previewed as thumbnails
- pages can be managed from the page list
- text blocks and tables can be edited with TipTap
- photo blocks can be moved, resized, rotated, masked, and filtered
- the inspector changes according to the selected object type
- the final output matches the composition model as closely as possible
