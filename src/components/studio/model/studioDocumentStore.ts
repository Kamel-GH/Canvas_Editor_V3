import { create } from "zustand";

import {
  STUDIO_INITIAL_DOCUMENT_ID,
  STUDIO_INITIAL_PAGE_ID,
  type StudioAsset,
  type StudioDocument,
  type StudioDocumentMode,
  type StudioLayer,
  type StudioNode,
  type StudioPage,
  type StudioPreset,
  type StudioVariable,
} from "./studioDocumentTypes";

type StudioDocumentState = {
  document: StudioDocument;
  renameDocument: (name: string) => void;
  setDocumentMode: (mode: StudioDocumentMode) => void;
  addPage: (page: StudioPage) => void;
  updatePage: (pageId: string, patch: Partial<StudioPage>) => void;
  renamePage: (pageId: string, name: string) => void;
  updatePageNote: (pageId: string, note: string) => void;
  updatePageBackgroundColor: (pageId: string, backgroundColor: string) => void;
  updatePageOrientation: (pageId: string, orientation: "portrait" | "landscape") => void;
  duplicatePage: (pageId: string) => void;
  addNode: (node: StudioNode) => void;
  updateNode: (nodeId: string, patch: Partial<StudioNode>) => void;
  renameNode: (nodeId: string, name: string) => void;
  updateNodeDescription: (nodeId: string, description: string) => void;
  updateNodeFrame: (nodeId: string, patch: Partial<StudioNode["frame"]>) => void;
  toggleNodeVisibility: (nodeId: string) => void;
  toggleNodeLock: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  moveNode: (nodeId: string, direction: "up" | "down") => void;
  moveNodeToEdge: (nodeId: string, edge: "front" | "back") => void;
  addLayer: (layer: StudioLayer) => void;
  updateLayer: (layerId: string, patch: Partial<StudioLayer>) => void;
  renameLayer: (layerId: string, name: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  moveLayer: (layerId: string, direction: "up" | "down") => void;
  moveLayerToEdge: (layerId: string, edge: "front" | "back") => void;
  addVariable: (variable: StudioVariable) => void;
  addPreset: (preset: StudioPreset) => void;
  addAsset: (asset: StudioAsset) => void;
};

function resequenceNodes(nodes: StudioNode[]) {
  return nodes
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((node, index) => ({
      ...node,
      order: index + 1,
    }));
}

function resequenceLayers(layers: StudioLayer[]) {
  return layers
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((layer, index) => ({
      ...layer,
      order: index + 1,
    }));
}

function normalizeNodeOrdering(nodes: StudioNode[]) {
  return resequenceNodes(nodes);
}

function normalizeLayerOrdering(layers: StudioLayer[]) {
  return resequenceLayers(layers);
}

const initialDocument: StudioDocument = {
  id: STUDIO_INITIAL_DOCUMENT_ID,
  name: "CV Executive Summary",
  mode: "template",
  pages: [
    {
      id: "studio-page-cover",
      name: "01 Couverture",
      order: 1,
      sizePreset: "A4",
      orientation: "portrait",
      width: 960,
      height: 1320,
      backgroundColor: "#ffffff",
      note: "Page d'entrée",
    },
    {
      id: STUDIO_INITIAL_PAGE_ID,
      name: "02 Expériences",
      order: 2,
      sizePreset: "A4",
      orientation: "portrait",
      width: 960,
      height: 1320,
      backgroundColor: "#ffffff",
      note: "Section principale",
    },
    {
      id: "studio-page-skills",
      name: "03 Compétences",
      order: 3,
      sizePreset: "A4",
      orientation: "portrait",
      width: 960,
      height: 1320,
      backgroundColor: "#ffffff",
      note: "Vue compacte",
    },
    {
      id: "studio-page-contact",
      name: "04 Contact",
      order: 4,
      sizePreset: "A4",
      orientation: "portrait",
      width: 960,
      height: 1320,
      backgroundColor: "#ffffff",
      note: "Dernière page",
    },
  ],
  layers: [
    {
      id: "studio-layer-background",
      pageId: STUDIO_INITIAL_PAGE_ID,
      name: "Background",
      order: 1,
      visible: true,
      locked: true,
    },
    {
      id: "studio-layer-guides",
      pageId: STUDIO_INITIAL_PAGE_ID,
      name: "Grid & guides",
      order: 2,
      visible: true,
      locked: true,
    },
    {
      id: "studio-layer-content",
      pageId: STUDIO_INITIAL_PAGE_ID,
      name: "Content",
      order: 3,
      visible: true,
      locked: false,
    },
    {
      id: "studio-layer-decor",
      pageId: STUDIO_INITIAL_PAGE_ID,
      name: "Decorations",
      order: 4,
      visible: true,
      locked: false,
    },
  ],
  nodes: [
    {
      id: "studio-node-cover-title",
      pageId: "studio-page-cover",
      kind: "text",
      name: "Titre principal",
      order: 1,
      frame: { x: 76, y: 54, width: 390, height: 88 },
      layerId: "studio-layer-content",
      visible: true,
      locked: false,
      tone: "title",
      description: "Bloc titre éditable avec style fort et hiérarchie claire.",
    },
    {
      id: "studio-node-cover-photo",
      pageId: "studio-page-cover",
      kind: "image",
      name: "Photo",
      order: 2,
      frame: { x: 482, y: 50, width: 170, height: 170 },
      layerId: "studio-layer-content",
      visible: true,
      locked: false,
      tone: "image",
      description: "Image principale avec masque circulaire et ombre douce.",
    },
    {
      id: "studio-node-experience-preset",
      pageId: STUDIO_INITIAL_PAGE_ID,
      kind: "text",
      name: "Preset Expériences",
      order: 1,
      frame: { x: 70, y: 76, width: 520, height: 176 },
      layerId: "studio-layer-content",
      visible: true,
      locked: false,
      tone: "preset",
      description: "Preset texte stylisé contenant variables inline et séparateur.",
    },
    {
      id: "studio-node-experience-table",
      pageId: STUDIO_INITIAL_PAGE_ID,
      kind: "shape",
      name: "Tableau synthèse",
      order: 2,
      frame: { x: 70, y: 274, width: 520, height: 140 },
      layerId: "studio-layer-content",
      visible: true,
      locked: false,
      tone: "table",
      description: "Bloc tableau ou carte de données aligné au preset principal.",
    },
    {
      id: "studio-node-skills-grid",
      pageId: "studio-page-skills",
      kind: "group",
      name: "Grille de compétences",
      order: 1,
      frame: { x: 74, y: 82, width: 506, height: 180 },
      layerId: "studio-layer-content",
      visible: true,
      locked: false,
      tone: "group",
      description: "Groupe logique pour badges, niveaux et pictogrammes.",
    },
    {
      id: "studio-node-contact-card",
      pageId: "studio-page-contact",
      kind: "shape",
      name: "Bloc contact",
      order: 1,
      frame: { x: 96, y: 124, width: 360, height: 120 },
      layerId: "studio-layer-content",
      visible: true,
      locked: false,
      tone: "card",
      description: "Carte de contact avec actions rapides et coordonnées.",
    },
  ],
  variables: [
    {
      id: "studio-variable-first-name",
      key: "user.first_name",
      label: "Prénom utilisateur",
      type: "text",
      description: "Prénom issu du profil principal.",
    },
    {
      id: "studio-variable-current-date",
      key: "current_date",
      label: "Date actuelle",
      type: "date",
      description: "Date de génération du document.",
    },
    {
      id: "studio-variable-company-name",
      key: "company.name",
      label: "Nom entreprise",
      type: "text",
      description: "Nom de l'entreprise cible ou source.",
    },
    {
      id: "studio-variable-job-title",
      key: "job.title",
      label: "Intitulé du poste",
      type: "text",
      description: "Titre du poste ou de la mission.",
    },
  ],
  presets: [
    {
      id: "studio-preset-experiences",
      name: "Expériences",
      summary: "Bloc CV structuré",
      kind: "text",
      preview: "Titre, ligne de séparation, date, entreprise, variables inline.",
      variableKeys: ["current_date", "company.name"],
    },
    {
      id: "studio-preset-experience-line",
      name: "Ligne expérience compacte",
      summary: "Variante dense",
      kind: "text",
      preview: "Icône, date, entreprise sur une seule ligne.",
      variableKeys: ["current_date", "company.name"],
    },
    {
      id: "studio-preset-formation",
      name: "Formation",
      summary: "Bloc éducatif",
      kind: "text",
      preview: "Dates, établissement, diplôme.",
      variableKeys: ["current_date", "company.name"],
    },
    {
      id: "studio-preset-contact",
      name: "Contact compact",
      summary: "Bloc signature",
      kind: "text",
      preview: "Coordonnées compactes avec icône.",
      variableKeys: ["user.first_name", "company.name"],
    },
  ],
  assets: [
    {
      id: "studio-asset-portrait",
      kind: "image",
      name: "Portrait principal",
      description: "Photo de profil pour la couverture.",
    },
    {
      id: "studio-asset-logo",
      kind: "icon",
      name: "Logo compact",
      description: "Icône de marque pour les entêtes.",
    },
    {
      id: "studio-asset-svg-badge",
      kind: "svg",
      name: "Badge SVG",
      description: "Exemple de forme vectorielle importable.",
      source:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="48" fill="#111827"/><circle cx="120" cy="120" r="68" fill="#f2b84b"/><text x="120" y="136" font-size="64" text-anchor="middle" font-family="Arial, sans-serif" fill="#111827">SVG</text></svg>',
    },
  ],
};

export const useStudioDocumentStore = create<StudioDocumentState>()((set) => ({
  document: initialDocument,
  renameDocument: (name) =>
    set((state) => ({
      document: {
        ...state.document,
        name,
      },
    })),
  setDocumentMode: (mode) =>
    set((state) => ({
      document: {
        ...state.document,
        mode,
      },
    })),
  addPage: (page) =>
    set((state) => ({
      document: {
        ...state.document,
        pages: [...state.document.pages, page],
      },
    })),
  updatePage: (pageId, patch) =>
    set((state) => ({
      document: {
        ...state.document,
        pages: state.document.pages.map((page) =>
          page.id === pageId ? { ...page, ...patch } : page,
        ),
      },
    })),
  renamePage: (pageId, name) =>
    set((state) => ({
      document: {
        ...state.document,
        pages: state.document.pages.map((page) =>
          page.id === pageId ? { ...page, name } : page,
        ),
      },
    })),
  updatePageNote: (pageId, note) =>
    set((state) => ({
      document: {
        ...state.document,
        pages: state.document.pages.map((page) =>
          page.id === pageId ? { ...page, note } : page,
        ),
      },
    })),
  updatePageBackgroundColor: (pageId, backgroundColor) =>
    set((state) => ({
      document: {
        ...state.document,
        pages: state.document.pages.map((page) =>
          page.id === pageId ? { ...page, backgroundColor } : page,
        ),
      },
    })),
  updatePageOrientation: (pageId, orientation) =>
    set((state) => ({
      document: {
        ...state.document,
        pages: state.document.pages.map((page) =>
          page.id === pageId ? { ...page, orientation } : page,
        ),
      },
    })),
  duplicatePage: (pageId) =>
    set((state) => {
      const sourcePage = state.document.pages.find((page) => page.id === pageId);

      if (!sourcePage) {
        return state;
      }

      const copyIndex = state.document.pages.filter((page) => page.id.startsWith(`${pageId}-copy`))
        .length + 1;
      const duplicatedPage: StudioPage = {
        ...sourcePage,
        id: `${pageId}-copy-${copyIndex}`,
        order: Math.max(...state.document.pages.map((page) => page.order)) + 1,
        name: `${sourcePage.name} (copie)`,
      };

      return {
        document: {
          ...state.document,
          pages: [...state.document.pages, duplicatedPage],
        },
      };
    }),
  addNode: (node) =>
    set((state) => ({
      document: {
        ...state.document,
        nodes: [...state.document.nodes, node],
      },
    })),
  updateNode: (nodeId, patch) =>
    set((state) => ({
      document: {
        ...state.document,
        nodes: state.document.nodes.map((node) =>
          node.id === nodeId ? { ...node, ...patch } : node,
        ),
      },
    })),
  renameNode: (nodeId, name) =>
    set((state) => ({
      document: {
        ...state.document,
        nodes: state.document.nodes.map((node) =>
          node.id === nodeId ? { ...node, name } : node,
        ),
      },
    })),
  updateNodeDescription: (nodeId, description) =>
    set((state) => ({
      document: {
        ...state.document,
        nodes: state.document.nodes.map((node) =>
          node.id === nodeId ? { ...node, description } : node,
        ),
      },
    })),
  updateNodeFrame: (nodeId, patch) =>
    set((state) => ({
      document: {
        ...state.document,
        nodes: state.document.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                frame: {
                  ...node.frame,
                  ...patch,
                },
              }
            : node,
        ),
      },
    })),
  toggleNodeVisibility: (nodeId) =>
    set((state) => ({
      document: {
        ...state.document,
        nodes: state.document.nodes.map((node) =>
          node.id === nodeId ? { ...node, visible: !node.visible } : node,
        ),
      },
    })),
  toggleNodeLock: (nodeId) =>
    set((state) => ({
      document: {
        ...state.document,
        nodes: state.document.nodes.map((node) =>
          node.id === nodeId ? { ...node, locked: !node.locked } : node,
        ),
      },
    })),
  duplicateNode: (nodeId) =>
    set((state) => {
      const sourceNode = state.document.nodes.find((node) => node.id === nodeId);

      if (!sourceNode) {
        return state;
      }

      const copyIndex = state.document.nodes.filter((node) => node.id.startsWith(`${nodeId}-copy`))
        .length + 1;
      const duplicatedNode: StudioNode = {
        ...sourceNode,
        id: `${nodeId}-copy-${copyIndex}`,
        name: `${sourceNode.name} (copie)`,
        order:
          Math.max(
            0,
            ...state.document.nodes
              .filter((node) => node.pageId === sourceNode.pageId)
              .map((node) => node.order),
          ) + 1,
        frame: {
          ...sourceNode.frame,
          x: sourceNode.frame.x + 24,
          y: sourceNode.frame.y + 24,
        },
      };

      return {
        document: {
          ...state.document,
          nodes: [...state.document.nodes, duplicatedNode],
        },
      };
    }),
  moveNode: (nodeId, direction) =>
    set((state) => {
      const sourceNode = state.document.nodes.find((node) => node.id === nodeId);

      if (!sourceNode) {
        return state;
      }

      const pageNodes = state.document.nodes
        .filter((node) => node.pageId === sourceNode.pageId)
        .sort((left, right) => left.order - right.order);
      const currentIndex = pageNodes.findIndex((node) => node.id === nodeId);

      if (currentIndex === -1) {
        return state;
      }

      const targetIndex =
        direction === "up"
          ? Math.max(0, currentIndex - 1)
          : Math.min(pageNodes.length - 1, currentIndex + 1);

      if (currentIndex === targetIndex) {
        return state;
      }

      const nextNodes = pageNodes.slice();
      const [movedNode] = nextNodes.splice(currentIndex, 1);
      nextNodes.splice(targetIndex, 0, movedNode);
      const normalizedNodes = resequenceNodes(nextNodes);

      return {
        document: {
          ...state.document,
          nodes: state.document.nodes.map((node) => {
            const nextNode = normalizedNodes.find((item) => item.id === node.id);
            return nextNode ?? node;
          }),
        },
      };
    }),
  moveNodeToEdge: (nodeId, edge) =>
    set((state) => {
      const sourceNode = state.document.nodes.find((node) => node.id === nodeId);

      if (!sourceNode) {
        return state;
      }

      const pageNodes = state.document.nodes
        .filter((node) => node.pageId === sourceNode.pageId)
        .sort((left, right) => left.order - right.order);
      const currentIndex = pageNodes.findIndex((node) => node.id === nodeId);

      if (currentIndex === -1) {
        return state;
      }

      const nextNodes = pageNodes.slice();
      const [movedNode] = nextNodes.splice(currentIndex, 1);

      if (edge === "front") {
        nextNodes.push(movedNode);
      } else {
        nextNodes.unshift(movedNode);
      }

      const normalizedNodes = normalizeNodeOrdering(nextNodes);

      return {
        document: {
          ...state.document,
          nodes: state.document.nodes.map((node) => {
            const nextNode = normalizedNodes.find((item) => item.id === node.id);
            return nextNode ?? node;
          }),
        },
      };
    }),
  addLayer: (layer) =>
    set((state) => ({
      document: {
        ...state.document,
        layers: [...state.document.layers, layer],
      },
    })),
  updateLayer: (layerId, patch) =>
    set((state) => ({
      document: {
        ...state.document,
        layers: state.document.layers.map((layer) =>
          layer.id === layerId ? { ...layer, ...patch } : layer,
        ),
      },
    })),
  renameLayer: (layerId, name) =>
    set((state) => ({
      document: {
        ...state.document,
        layers: state.document.layers.map((layer) =>
          layer.id === layerId ? { ...layer, name } : layer,
        ),
      },
    })),
  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      document: {
        ...state.document,
        layers: state.document.layers.map((layer) =>
          layer.id === layerId ? { ...layer, visible: !layer.visible } : layer,
        ),
      },
    })),
  toggleLayerLock: (layerId) =>
    set((state) => ({
      document: {
        ...state.document,
        layers: state.document.layers.map((layer) =>
          layer.id === layerId ? { ...layer, locked: !layer.locked } : layer,
        ),
      },
    })),
  moveLayer: (layerId, direction) =>
    set((state) => {
      const sourceLayer = state.document.layers.find((layer) => layer.id === layerId);

      if (!sourceLayer) {
        return state;
      }

      const pageLayers = state.document.layers
        .filter((layer) => layer.pageId === sourceLayer.pageId)
        .sort((left, right) => left.order - right.order);
      const currentIndex = pageLayers.findIndex((layer) => layer.id === layerId);

      if (currentIndex === -1) {
        return state;
      }

      const targetIndex =
        direction === "up"
          ? Math.max(0, currentIndex - 1)
          : Math.min(pageLayers.length - 1, currentIndex + 1);

      if (currentIndex === targetIndex) {
        return state;
      }

      const nextLayers = pageLayers.slice();
      const [movedLayer] = nextLayers.splice(currentIndex, 1);
      nextLayers.splice(targetIndex, 0, movedLayer);
      const normalizedLayers = resequenceLayers(nextLayers);

      return {
        document: {
          ...state.document,
          layers: state.document.layers.map((layer) => {
            const nextLayer = normalizedLayers.find((item) => item.id === layer.id);
            return nextLayer ?? layer;
          }),
        },
      };
    }),
  moveLayerToEdge: (layerId, edge) =>
    set((state) => {
      const sourceLayer = state.document.layers.find((layer) => layer.id === layerId);

      if (!sourceLayer) {
        return state;
      }

      const pageLayers = state.document.layers
        .filter((layer) => layer.pageId === sourceLayer.pageId)
        .sort((left, right) => left.order - right.order);
      const currentIndex = pageLayers.findIndex((layer) => layer.id === layerId);

      if (currentIndex === -1) {
        return state;
      }

      const nextLayers = pageLayers.slice();
      const [movedLayer] = nextLayers.splice(currentIndex, 1);

      if (edge === "front") {
        nextLayers.push(movedLayer);
      } else {
        nextLayers.unshift(movedLayer);
      }

      const normalizedLayers = normalizeLayerOrdering(nextLayers);

      return {
        document: {
          ...state.document,
          layers: state.document.layers.map((layer) => {
            const nextLayer = normalizedLayers.find((item) => item.id === layer.id);
            return nextLayer ?? layer;
          }),
        },
      };
    }),
  addVariable: (variable) =>
    set((state) => ({
      document: {
        ...state.document,
        variables: [...state.document.variables, variable],
      },
    })),
  addPreset: (preset) =>
    set((state) => ({
      document: {
        ...state.document,
        presets: [...state.document.presets, preset],
      },
    })),
  addAsset: (asset) =>
    set((state) => ({
      document: {
        ...state.document,
        assets: [...state.document.assets, asset],
      },
    })),
}));
