"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { EmojiClickData } from "emoji-picker-react";
import { Canvg } from "canvg";
import twemoji from "twemoji";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpToLine,
  Check,
  Circle,
  Copy,
  FileText,
  Grid3X3,
  Hand,
  Layers3,
  LayoutDashboard,
  LineSquiggle,
  Minus,
  Paintbrush,
  PanelLeft,
  PanelRight,
  Play,
  Plus,
  RectangleHorizontal,
  Redo2,
  Save,
  Search,
  Settings2,
  Shapes,
  Square,
  TextCursorInput,
  Undo2,
  UserCircle2,
  ZoomIn,
} from "lucide-react";

import { useStudioDocumentStore } from "./model/studioDocumentStore";
import type {
  StudioNode,
  StudioNodeKind,
  StudioPage,
  StudioPreset,
  StudioVariable,
} from "./model/studioDocumentTypes";
import { StudioFloatingPalette } from "./StudioFloatingPalette";
import { StudioUtilityPalette } from "./StudioUtilityPalette";
import styles from "./StudioShell.module.css";
import type { StudioLeftTabId, StudioToolId } from "./store/studioShellTypes";
import { useStudioShellStore } from "./store/studioShellStore";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

type StudioResourceDragPayload =
  | {
      type: "preset";
      id: string;
      name: string;
      preview: string;
    }
  | {
      type: "asset";
      id: string;
      kind: "image" | "icon" | "shape" | "svg";
      name: string;
      description: string;
      source?: string;
    }
  | {
      type: "variable";
      id: string;
      key: string;
      label: string;
      description: string;
    };

function createStudioId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

const tools: Array<{
  id: StudioToolId;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "select", label: "Sélection", shortLabel: "Sel.", icon: LayoutDashboard },
  { id: "multi", label: "Multi-sélection", shortLabel: "Multi", icon: Square },
  { id: "pan", label: "Pan", shortLabel: "Pan", icon: Hand },
  { id: "zoom", label: "Zoom", shortLabel: "Zoom", icon: ZoomIn },
  { id: "brush", label: "Crayon", shortLabel: "Crayon", icon: Paintbrush },
  { id: "polygon", label: "Polygone", shortLabel: "Poly", icon: Shapes },
  { id: "circle", label: "Cercle", shortLabel: "Cercle", icon: Circle },
  {
    id: "rectangle",
    label: "Rectangle",
    shortLabel: "Rect.",
    icon: RectangleHorizontal,
  },
  { id: "line", label: "Ligne", shortLabel: "Ligne", icon: LineSquiggle },
  { id: "text", label: "Texte", shortLabel: "Texte", icon: TextCursorInput },
];

const leftTabs: Array<{
  id: StudioLeftTabId;
  label: string;
  icon: typeof PanelLeft;
}> = [
  { id: "resources", label: "Ressources", icon: PanelLeft },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "objects", label: "Objets", icon: Layers3 },
  { id: "layers", label: "Calques", icon: Grid3X3 },
];

const kindLabels: Record<StudioNodeKind, string> = {
  text: "Texte",
  image: "Image",
  shape: "Forme",
  group: "Groupe",
  component: "Composant",
  placeholder: "Placeholder",
  emoji: "Emoji",
  svg: "SVG",
};

const inspectorByKind: Record<StudioNodeKind, Array<{ label: string; value: string }>> = {
  text: [
    { label: "Police", value: "Manrope Bold" },
    { label: "Taille", value: "32 px" },
    { label: "Alignement", value: "Gauche" },
    { label: "Espacement", value: "24 px" },
  ],
  image: [
    { label: "Masque", value: "Circulaire" },
    { label: "Rognage", value: "Auto" },
    { label: "Contraste", value: "95%" },
    { label: "Ombre", value: "Activée" },
  ],
  shape: [
    { label: "Remplissage", value: "Ambre 10%" },
    { label: "Contour", value: "2 px" },
    { label: "Coins", value: "16 px" },
    { label: "Opacité", value: "100%" },
  ],
  group: [
    { label: "Composition", value: "3 couches" },
    { label: "Verrouillage", value: "Partiel" },
    { label: "Disposition", value: "Auto" },
    { label: "Distribution", value: "Flexible" },
  ],
  component: [
    { label: "Instance", value: "Connectée" },
    { label: "Version", value: "v1" },
    { label: "Réutilisable", value: "Oui" },
    { label: "Overrides", value: "Paramétrés" },
  ],
  placeholder: [
    { label: "Rôle", value: "Réserve" },
    { label: "Contenu", value: "À définir" },
    { label: "Visibilité", value: "Optionnelle" },
    { label: "Fallback", value: "Activé" },
  ],
  emoji: [
    { label: "Source", value: "Bibliothèque emoji" },
    { label: "Rendu", value: "Twemoji" },
    { label: "Taille", value: "120 px" },
    { label: "Usage", value: "Icône / accent" },
  ],
  svg: [
    { label: "Source", value: "Fichier SVG" },
    { label: "Rendu", value: "Canvg → bitmap" },
    { label: "Taille", value: "180 px" },
    { label: "Usage", value: "Import vectoriel" },
  ],
};

function objectToneClass(tone: string) {
  switch (tone) {
    case "title":
      return styles.objectTitle;
    case "image":
      return styles.objectImage;
    case "preset":
      return styles.objectPreset;
    case "table":
      return styles.objectTable;
    case "group":
      return styles.objectGroup;
  case "card":
      return styles.objectCard;
    case "emoji":
      return styles.objectEmoji;
    case "svg":
      return styles.objectSvg;
    default:
      return styles.objectGeneric;
  }
}

function buildPageInspectorFields(page: StudioPage) {
  return [
    { label: "Format", value: `${page.sizePreset} ${page.orientation}` },
    { label: "Dimensions", value: `${page.width} × ${page.height}` },
    { label: "Fond", value: page.backgroundColor },
    { label: "Note", value: page.note },
  ];
}

function buildResourceGroups(
  variables: StudioVariable[],
  presets: StudioPreset[],
  assets: { name: string }[],
) {
  return [
    {
      title: "Variables",
      summary: `${variables.length} champs liés aux données`,
      items: variables.map((variable) => variable.key),
    },
    {
      title: "Presets",
      summary: `${presets.length} blocs réutilisables`,
      items: presets.map((preset) => preset.name),
    },
    {
      title: "Bibliothèques",
      summary: `${assets.length} ressources visuelles`,
      items: assets.map((asset) => asset.name),
    },
  ];
}

function buildDroppedNode(
  payload: StudioResourceDragPayload,
  pageId: string,
  order: number,
  frame: { x: number; y: number },
) {
  switch (payload.type) {
    case "preset":
      return {
        id: createStudioId("studio-node"),
        pageId,
        kind: "text" as const,
        name: payload.name,
        order,
        frame: {
          x: frame.x,
          y: frame.y,
          width: 460,
          height: 170,
        },
        layerId: "studio-layer-content",
        visible: true,
        locked: false,
        tone: "preset",
        description: payload.preview,
      };
    case "asset":
      if (payload.kind === "svg") {
        return {
          id: createStudioId("studio-node"),
          pageId,
          kind: "svg" as const,
          name: payload.name,
          order,
          frame: {
            x: frame.x,
            y: frame.y,
            width: 180,
            height: 180,
          },
          layerId: "studio-layer-content",
          visible: true,
          locked: false,
          tone: "svg",
          description: payload.description,
          previewUrl: payload.source,
          source: payload.source,
        };
      }

      return {
        id: createStudioId("studio-node"),
        pageId,
        kind: payload.kind === "icon" ? "shape" : payload.kind,
        name: payload.name,
        order,
        frame: {
          x: frame.x,
          y: frame.y,
          width: payload.kind === "image" ? 180 : 140,
          height: payload.kind === "image" ? 180 : 140,
        },
        layerId: "studio-layer-content",
        visible: true,
        locked: false,
        tone: payload.kind === "image" ? "image" : "card",
        description: payload.description,
      };
    case "variable":
      return {
        id: createStudioId("studio-node"),
        pageId,
        kind: "placeholder" as const,
        name: payload.label,
        order,
        frame: {
          x: frame.x,
          y: frame.y,
          width: 320,
          height: 96,
        },
        layerId: "studio-layer-content",
        visible: true,
        locked: false,
        tone: "placeholder",
        description: `${payload.key} · ${payload.description}`,
      };
  }
}

function buildEmojiNode(emoji: string, pageId: string, order: number, frame: { x: number; y: number }) {
  return {
    id: createStudioId("studio-node"),
    pageId,
    kind: "emoji" as const,
    name: emoji,
    order,
    frame: {
      x: frame.x,
      y: frame.y,
      width: 120,
      height: 120,
    },
    layerId: "studio-layer-content",
    visible: true,
    locked: false,
    tone: "emoji",
    description: "Emoji inséré depuis la bibliothèque",
  };
}

async function rasterizeSvgToDataUrl(svgSource: string) {
  const canvas = globalThis.document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }

  const renderer = Canvg.fromString(context, svgSource);
  await renderer.render();

  return canvas.toDataURL("image/png");
}

export function StudioShell() {
  const studioDocument = useStudioDocumentStore((state) => state.document);
  const activeTool = useStudioShellStore((state) => state.activeTool);
  const activeTab = useStudioShellStore((state) => state.activeTab);
  const activePageId = useStudioShellStore((state) => state.activePageId);
  const selectedObjectId = useStudioShellStore((state) => state.selectedObjectId);
  const zoom = useStudioShellStore((state) => state.zoom);
  const panMode = useStudioShellStore((state) => state.panMode);
  const gridVisible = useStudioShellStore((state) => state.gridVisible);
  const rulersVisible = useStudioShellStore((state) => state.rulersVisible);
  const snapEnabled = useStudioShellStore((state) => state.snapEnabled);
  const gridSize = useStudioShellStore((state) => state.gridSize);
  const contextMenu = useStudioShellStore((state) => state.contextMenu);
  const renameDocument = useStudioDocumentStore((state) => state.renameDocument);
  const addNode = useStudioDocumentStore((state) => state.addNode);
  const setDocumentMode = useStudioDocumentStore((state) => state.setDocumentMode);
  const renamePage = useStudioDocumentStore((state) => state.renamePage);
  const updatePageNote = useStudioDocumentStore((state) => state.updatePageNote);
  const updatePageBackgroundColor = useStudioDocumentStore(
    (state) => state.updatePageBackgroundColor,
  );
  const updatePageOrientation = useStudioDocumentStore(
    (state) => state.updatePageOrientation,
  );
  const duplicatePage = useStudioDocumentStore((state) => state.duplicatePage);
  const renameNode = useStudioDocumentStore((state) => state.renameNode);
  const updateNodeDescription = useStudioDocumentStore(
    (state) => state.updateNodeDescription,
  );
  const updateNodeFrame = useStudioDocumentStore((state) => state.updateNodeFrame);
  const toggleNodeVisibility = useStudioDocumentStore(
    (state) => state.toggleNodeVisibility,
  );
  const toggleNodeLock = useStudioDocumentStore((state) => state.toggleNodeLock);
  const duplicateNode = useStudioDocumentStore((state) => state.duplicateNode);
  const moveNode = useStudioDocumentStore((state) => state.moveNode);
  const moveNodeToEdge = useStudioDocumentStore((state) => state.moveNodeToEdge);
  const toggleLayerVisibility = useStudioDocumentStore(
    (state) => state.toggleLayerVisibility,
  );
  const toggleLayerLock = useStudioDocumentStore((state) => state.toggleLayerLock);
  const moveLayer = useStudioDocumentStore((state) => state.moveLayer);
  const moveLayerToEdge = useStudioDocumentStore((state) => state.moveLayerToEdge);
  const setActiveTool = useStudioShellStore((state) => state.setActiveTool);
  const setActiveTab = useStudioShellStore((state) => state.setActiveTab);
  const setActivePageId = useStudioShellStore((state) => state.setActivePageId);
  const setSelectedObjectId = useStudioShellStore((state) => state.setSelectedObjectId);
  const openContextMenu = useStudioShellStore((state) => state.openContextMenu);
  const closeContextMenu = useStudioShellStore((state) => state.closeContextMenu);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const svgInputRef = useRef<HTMLInputElement | null>(null);
  const [isCanvasDropActive, setIsCanvasDropActive] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [svgImportMessage, setSvgImportMessage] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const canvasDragRef = useRef<{
    nodeId: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startFrameX: number;
    startFrameY: number;
  } | null>(null);

  const pages = useMemo(
    () => [...studioDocument.pages].sort((left, right) => left.order - right.order),
    [studioDocument.pages],
  );
  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId, pages],
  );
  const activeLayers = useMemo(
    () =>
      studioDocument.layers
        .filter((layer) => layer.pageId === activePageId)
        .sort((left, right) => left.order - right.order),
    [activePageId, studioDocument.layers],
  );
  const activeLayerOrder = useMemo(() => {
    return new Map(activeLayers.map((layer) => [layer.id, layer.order]));
  }, [activeLayers]);
  const activeNodes = useMemo(
    () =>
      studioDocument.nodes
        .filter((node) => node.pageId === activePageId)
        .sort((left, right) => {
          const leftLayerOrder = activeLayerOrder.get(left.layerId) ?? 0;
          const rightLayerOrder = activeLayerOrder.get(right.layerId) ?? 0;

          if (leftLayerOrder !== rightLayerOrder) {
            return leftLayerOrder - rightLayerOrder;
          }

          return left.order - right.order;
        }),
    [activeLayerOrder, activePageId, studioDocument.nodes],
  );
  const resourceGroups = useMemo(
    () =>
      buildResourceGroups(
        studioDocument.variables,
        studioDocument.presets,
        studioDocument.assets,
      ),
    [studioDocument.assets, studioDocument.presets, studioDocument.variables],
  );
  const selectedObject = useMemo(() => {
    if (!selectedObjectId) {
      return null;
    }

    return activeNodes.find((node) => node.id === selectedObjectId) ?? null;
  }, [activeNodes, selectedObjectId]);
  const selectedLayer = useMemo(() => {
    if (!selectedObject) {
      return null;
    }

    return activeLayers.find((layer) => layer.id === selectedObject.layerId) ?? null;
  }, [activeLayers, selectedObject]);

  useEffect(() => {
    if (!activeNodes.length) {
      setSelectedObjectId(null);
      return;
    }
    if (selectedObjectId && !activeNodes.some((node) => node.id === selectedObjectId)) {
      setSelectedObjectId(null);
    }
  }, [activeNodes, selectedObjectId, setSelectedObjectId]);

  useEffect(() => {
    if (draggingNodeId && !activeNodes.some((node) => node.id === draggingNodeId)) {
      canvasDragRef.current = null;
      setDraggingNodeId(null);
    }
  }, [activeNodes, draggingNodeId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeContextMenu();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        contextMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeContextMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeContextMenu, contextMenu]);

  const inspectorFields = selectedObject
    ? inspectorByKind[selectedObject.kind]
    : buildPageInspectorFields(activePage);
  const activePageLabel = activePage.name;
  const selectedObjectLabel = selectedObject ? selectedObject.name : activePage.name;
  const selectedObjectKind = selectedObject ? kindLabels[selectedObject.kind] : "Page";
  const selectedObjectDescription = selectedObject
    ? selectedObject.description
    : "Aucune sélection. Les réglages affichés concernent la page active.";

  const canDragNode = (node: StudioNode) => {
    const layer = activeLayers.find((entry) => entry.id === node.layerId);

    return Boolean(
      node.visible &&
        !node.locked &&
        layer &&
        layer.visible &&
        !layer.locked &&
        node.pageId === activePageId,
    );
  };

  const getInsertionPosition = () => {
    const pageSurface = globalThis.document.querySelector<HTMLDivElement>(
      `[data-studio-page-surface="true"]`,
    );
    const rect = pageSurface?.getBoundingClientRect();

    if (!rect) {
      return { x: 64, y: 64 };
    }

    return {
      x: Math.max(24, Math.round(rect.width / 2 - 80)),
      y: Math.max(24, Math.round(rect.height / 2 - 80)),
    };
  };

  const insertResourceNode = (payload: StudioResourceDragPayload, clientX: number, clientY: number) => {
    const pageSurface = globalThis.document.querySelector<HTMLDivElement>(
      `[data-studio-page-surface="true"]`,
    );
    const rect = pageSurface?.getBoundingClientRect();
    const nextOrder =
      Math.max(
        0,
        ...studioDocument.nodes
          .filter((node) => node.pageId === activePageId)
          .map((node) => node.order),
      ) + 1;
    const position = rect
      ? {
          x: Math.max(24, Math.round(clientX - rect.left - 60)),
          y: Math.max(24, Math.round(clientY - rect.top - 40)),
        }
      : { x: 64, y: 64 };
    const node = buildDroppedNode(payload, activePageId, nextOrder, position);

    addNode(node);
    setActivePageId(activePageId);
    setSelectedObjectId(node.id);
    closeContextMenu();
  };

  const insertEmojiNode = (emoji: string) => {
    const nextOrder =
      Math.max(
        0,
        ...studioDocument.nodes
          .filter((node) => node.pageId === activePageId)
          .map((node) => node.order),
      ) + 1;
    const position = getInsertionPosition();
    const node = buildEmojiNode(emoji, activePageId, nextOrder, position);

    addNode(node);
    setSelectedObjectId(node.id);
    setActiveTab("objects");
    setEmojiPickerOpen(false);
    closeContextMenu();
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    insertEmojiNode(emojiData.emoji);
  };

  const handleSvgPick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      setSvgImportMessage("Le fichier sélectionné n’est pas un SVG.");
      return;
    }

    try {
      const svgSource = await file.text();
      const previewUrl = await rasterizeSvgToDataUrl(svgSource);
      const nextOrder =
        Math.max(
          0,
          ...studioDocument.nodes
            .filter((node) => node.pageId === activePageId)
            .map((node) => node.order),
        ) + 1;
      const position = getInsertionPosition();
      const node = {
        id: createStudioId("studio-node"),
        pageId: activePageId,
        kind: "svg" as const,
        name: file.name.replace(/\.svg$/i, ""),
        order: nextOrder,
        frame: {
          x: position.x,
          y: position.y,
          width: 180,
          height: 180,
        },
        layerId: "studio-layer-content",
        visible: true,
        locked: false,
        tone: "svg",
        description: "SVG importé rasterisé pour l’aperçu du canvas",
        previewUrl,
        source: svgSource,
      };

      addNode(node);
      setSelectedObjectId(node.id);
      setActiveTab("objects");
      setSvgImportMessage(`SVG importé: ${file.name}`);
      closeContextMenu();
    } catch {
      setSvgImportMessage("Impossible de rasteriser ce SVG.");
    } finally {
      event.target.value = "";
    }
  };

  const handleResourceDragStart = (payload: StudioResourceDragPayload) => {
    return (event: DragEvent<HTMLButtonElement>) => {
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("application/json", JSON.stringify(payload));
    };
  };

  const handleCanvasDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsCanvasDropActive(false);

    const rawPayload = event.dataTransfer.getData("application/json");

    if (!rawPayload) {
      return;
    }

    try {
      const payload = JSON.parse(rawPayload) as StudioResourceDragPayload;

      if (!payload || typeof payload !== "object" || !("type" in payload)) {
        return;
      }

      insertResourceNode(payload, event.clientX, event.clientY);
    } catch {
      return;
    }
  };

  const moveSelectedNode = (direction: "up" | "down") => {
    if (!selectedObject) {
      return;
    }

    moveNode(selectedObject.id, direction);
  };

  const moveSelectedNodeToEdge = (edge: "front" | "back") => {
    if (!selectedObject) {
      return;
    }

    moveNodeToEdge(selectedObject.id, edge);
  };

  const moveLayerById = (layerId: string, direction: "up" | "down") => {
    moveLayer(layerId, direction);
  };

  const moveLayerToEdgeById = (layerId: string, edge: "front" | "back") => {
    moveLayerToEdge(layerId, edge);
  };

  const beginNodeDrag = (node: StudioNode) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !canDragNode(node)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    canvasDragRef.current = {
      nodeId: node.id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startFrameX: node.frame.x,
      startFrameY: node.frame.y,
    };
    setDraggingNodeId(node.id);
    setSelectedObjectId(node.id);
    closeContextMenu();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateDraggedNode = (node: StudioNode) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = canvasDragRef.current;

    if (!drag || drag.nodeId !== node.id || drag.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();

    const rawX = Math.max(0, Math.round(drag.startFrameX + (event.clientX - drag.startClientX)));
    const rawY = Math.max(0, Math.round(drag.startFrameY + (event.clientY - drag.startClientY)));
    const nextX =
      snapEnabled && gridSize > 0 ? Math.round(rawX / gridSize) * gridSize : rawX;
    const nextY =
      snapEnabled && gridSize > 0 ? Math.round(rawY / gridSize) * gridSize : rawY;

    updateNodeFrame(node.id, {
      x: nextX,
      y: nextY,
    });
  };

  const finishNodeDrag = (node: StudioNode) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = canvasDragRef.current;

    if (!drag || drag.nodeId !== node.id || drag.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    canvasDragRef.current = null;
    setDraggingNodeId(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const duplicateContextTarget = () => {
    if (contextMenu?.targetKind === "Page") {
      duplicatePage(activePage.id);
      closeContextMenu();
      return;
    }

    if (selectedObject) {
      duplicateNode(selectedObject.id);
    }

    closeContextMenu();
  };

  const toggleContextVisibility = () => {
    if (selectedObject && contextMenu?.targetKind !== "Page") {
      toggleNodeVisibility(selectedObject.id);
    }

    closeContextMenu();
  };

  const toggleContextLock = () => {
    if (selectedObject && contextMenu?.targetKind !== "Page") {
      toggleNodeLock(selectedObject.id);
    }

    closeContextMenu();
  };

  return (
    <main className={styles.shell}>
      <header className={styles.topBar}>
        <div className={styles.brandBlock}>
          <div className={styles.brandMark}>TS</div>
          <div>
            <div className={styles.brandName}>Template Studio</div>
            <div className={styles.brandMeta}>Clean-room editor shell v1</div>
          </div>
        </div>

        <div className={styles.documentBlock}>
          <button type="button" className={styles.documentBackButton}>
            <ArrowLeft size={16} />
            Retour
          </button>
          <div className={styles.documentInfo}>
            <span className={styles.documentLabel}>Document actif</span>
            <strong>{studioDocument.name}</strong>
          </div>
          <div className={styles.modePill}>{studioDocument.mode}</div>
        </div>

        <div className={styles.topActions}>
          <button type="button" className={styles.iconButton} aria-label="Undo">
            <Undo2 size={16} />
          </button>
          <button type="button" className={styles.iconButton} aria-label="Redo">
            <Redo2 size={16} />
          </button>
          <button type="button" className={styles.secondaryAction}>
            <Play size={16} />
            Preview
          </button>
          <button type="button" className={styles.primaryAction}>
            <ArrowDownToLine size={16} />
            Export
          </button>
          <button type="button" className={styles.iconButton} aria-label="Save">
            <Save size={16} />
          </button>
          <button type="button" className={styles.avatarButton} aria-label="Account">
            <UserCircle2 size={22} />
          </button>
        </div>
      </header>

      <aside className={styles.leftRail} aria-label="Outils">
        <div className={styles.railGroup}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            const active = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                className={`${styles.railButton} ${active ? styles.railButtonActive : ""}`}
                aria-pressed={active}
                aria-label={tool.label}
                title={tool.label}
                onClick={() => setActiveTool(tool.id)}
              >
                <Icon size={17} />
                <span>{tool.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.railFooter}>
          <button type="button" className={styles.railUtilityButton} aria-label="Search">
            <Search size={16} />
          </button>
          <button type="button" className={styles.railUtilityButton} aria-label="Settings">
            <Settings2 size={16} />
          </button>
        </div>
      </aside>

      <aside className={styles.leftPanel}>
        <div className={styles.sideHeader}>
          <div>
            <div className={styles.sideTitle}>Structure & ressources</div>
            <div className={styles.sideSubtitle}>Navigation, bibliothèques et calques</div>
          </div>
          <button type="button" className={styles.sideHeaderButton}>
            <Plus size={15} />
          </button>
        </div>

        <div className={styles.tabRow} role="tablist" aria-label="Navigation du panneau gauche">
          {leftTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabButton} ${active ? styles.tabButtonActive : ""}`}
                aria-pressed={active}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.sideBody}>
          {activeTab === "resources" ? (
            <div className={styles.stack}>
              <section className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <h2>Bibliothèque emoji</h2>
                  <span>Insertion directe dans le canvas</span>
                </div>
                <div className={styles.emojiTools}>
                  <button
                    type="button"
                    className={styles.quickAction}
                    onClick={() => setEmojiPickerOpen((value) => !value)}
                  >
                    <TextCursorInput size={14} />
                    {emojiPickerOpen ? "Masquer" : "Afficher"} le sélecteur
                  </button>
                </div>
                {emojiPickerOpen ? (
                  <div className={styles.emojiPickerShell}>
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      lazyLoadEmojis
                      searchDisabled={false}
                      skinTonesDisabled={false}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                ) : null}
              </section>

              <section className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <h2>Import SVG</h2>
                  <span>Rasterisation via Canvg</span>
                </div>
                <div className={styles.stack}>
                  <input
                    ref={svgInputRef}
                    className={styles.svgInput}
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleSvgPick}
                  />
                  <button
                    type="button"
                    className={styles.quickAction}
                    onClick={() => svgInputRef.current?.click()}
                  >
                    <ArrowDownToLine size={14} />
                    Choisir un SVG
                  </button>
                  <p className={styles.helperText}>
                    Le SVG est rasterisé pour l’aperçu du canvas, sans édition vectorielle.
                  </p>
                  {svgImportMessage ? <p className={styles.helperText}>{svgImportMessage}</p> : null}
                </div>
              </section>

              {resourceGroups.map((group) => (
                <section key={group.title} className={styles.cardSection}>
                  <div className={styles.sectionHeader}>
                    <h2>{group.title}</h2>
                    <span>{group.summary}</span>
                  </div>
                  <div className={styles.chipGrid}>
                    {group.items.map((item, index) => {
                      const variable = studioDocument.variables.find((entry) => entry.key === item);
                      const preset = studioDocument.presets.find((entry) => entry.name === item);
                      const asset = studioDocument.assets.find((entry) => entry.name === item);
                      const payload: StudioResourceDragPayload | null = variable
                        ? {
                            type: "variable",
                            id: variable.id,
                            key: variable.key,
                            label: variable.label,
                            description: variable.description,
                          }
                        : preset
                          ? {
                              type: "preset",
                              id: preset.id,
                              name: preset.name,
                              preview: preset.preview,
                            }
                          : asset
                            ? {
                            type: "asset",
                            id: asset.id,
                            kind: asset.kind,
                            name: asset.name,
                            description: asset.description,
                            source: asset.source,
                          }
                          : null;

                      return (
                        <button
                          key={`${item}-${index}`}
                          type="button"
                          className={styles.chip}
                          draggable={Boolean(payload)}
                          onDragStart={payload ? handleResourceDragStart(payload) : undefined}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          {activeTab === "pages" ? (
            <div className={styles.stack}>
              {pages.map((page) => {
                const active = page.id === activePageId;
                return (
                  <button
                    key={page.id}
                    type="button"
                    className={`${styles.pageThumb} ${active ? styles.pageThumbActive : ""}`}
                    onClick={() => {
                      setActivePageId(page.id);
                      closeContextMenu();
                    }}
                  >
                    <div className={styles.pageThumbIndex}>
                      {String(page.order).padStart(2, "0")}
                    </div>
                    <div className={styles.pageThumbCanvas}>
                      <div className={styles.pageThumbBar} />
                      <div className={styles.pageThumbLine} />
                      <div className={styles.pageThumbLineShort} />
                    </div>
                    <div className={styles.pageThumbMeta}>
                      <strong>{page.name}</strong>
                      <span>
                        {page.note} · {page.sizePreset}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          {activeTab === "objects" ? (
            <div className={styles.stack}>
              <section className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <h2>Objets de la page active</h2>
                  <span>{activeNodes.length} objets visibles</span>
                </div>
                <div className={styles.objectList}>
                  {activeNodes.map((node: StudioNode) => {
                    const active = node.id === selectedObjectId;
                    return (
                      <div
                        key={node.id}
                        className={`${styles.objectRow} ${active ? styles.objectRowActive : ""}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedObjectId(node.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedObjectId(node.id);
                          }
                        }}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          setSelectedObjectId(node.id);
                          openContextMenu({
                            x: event.clientX,
                            y: event.clientY,
                            targetId: node.id,
                            targetName: node.name,
                            targetKind: kindLabels[node.kind],
                          });
                        }}
                      >
                        <span className={styles.objectBadge}>{kindLabels[node.kind]}</span>
                        <div className={styles.objectRowText}>
                          <strong>{node.name}</strong>
                          <span>{node.description}</span>
                        </div>
                        <div className={styles.objectRowActions}>
                          <button
                            type="button"
                            className={styles.objectMoveButton}
                            onClick={(event) => {
                              event.stopPropagation();
                              moveNode(node.id, "up");
                            }}
                            aria-label={`Monter ${node.name}`}
                          >
                            <ArrowLeft size={12} />
                          </button>
                          <button
                            type="button"
                            className={styles.objectMoveButton}
                            onClick={(event) => {
                              event.stopPropagation();
                              moveNode(node.id, "down");
                            }}
                            aria-label={`Descendre ${node.name}`}
                          >
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === "layers" ? (
            <div className={styles.stack}>
              <section className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <h2>Gestion des calques</h2>
                  <span>Visibilité et verrouillage</span>
                </div>
                <div className={styles.layerList}>
                  {activeLayers.map((layer) => (
                    <div key={layer.id} className={styles.layerRow}>
                      <div className={styles.layerIdentity}>
                        <Grid3X3 size={14} />
                        <strong>{layer.name}</strong>
                      </div>
                      <div className={styles.layerActions}>
                        <button
                          type="button"
                          className={`${styles.layerActionButton} ${
                            layer.visible ? styles.layerActionButtonActive : ""
                          }`}
                          onClick={() => toggleLayerVisibility(layer.id)}
                        >
                          {layer.visible ? "Visible" : "Masqué"}
                        </button>
                        <button
                          type="button"
                          className={`${styles.layerActionButton} ${
                            layer.locked ? styles.layerActionButtonActive : ""
                          }`}
                          onClick={() => toggleLayerLock(layer.id)}
                        >
                          {layer.locked ? "Verrouillé" : "Libre"}
                        </button>
                        <button
                          type="button"
                          className={styles.layerMoveButton}
                          onClick={() => moveLayerById(layer.id, "up")}
                          aria-label={`Monter ${layer.name}`}
                        >
                          <ArrowLeft size={12} />
                        </button>
                        <button
                          type="button"
                          className={styles.layerMoveButton}
                          onClick={() => moveLayerById(layer.id, "down")}
                          aria-label={`Descendre ${layer.name}`}
                        >
                          <ArrowRight size={12} />
                        </button>
                        <button
                          type="button"
                          className={styles.layerMoveButton}
                          onClick={() => moveLayerToEdgeById(layer.id, "front")}
                          aria-label={`Placer ${layer.name} au premier plan`}
                        >
                          <ArrowDownToLine size={12} />
                        </button>
                        <button
                          type="button"
                          className={styles.layerMoveButton}
                          onClick={() => moveLayerToEdgeById(layer.id, "back")}
                          aria-label={`Placer ${layer.name} à l'arrière-plan`}
                        >
                          <ArrowUpToLine size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </aside>

      <section className={styles.workspace}>
        <div className={styles.workspaceHeader}>
          <div className={styles.workspaceMeta}>
            <span>Canvas / Template</span>
            <strong>{activePageLabel}</strong>
          </div>
          <div className={styles.workspaceStatus}>
            <span>{panMode ? "Pan" : "Sélection"}</span>
            <span>{zoom}%</span>
          </div>
        </div>

        <div className={styles.canvasShell}>
          {rulersVisible ? (
            <>
              <div className={styles.rulerTop}>
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
              <div className={styles.rulerLeft}>
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </>
          ) : null}

          <div
            className={`${styles.canvasStage} ${gridVisible ? "" : styles.canvasStageNoGrid}`}
            onClick={() => {
              setSelectedObjectId(null);
              closeContextMenu();
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              openContextMenu({
                x: event.clientX,
                y: event.clientY,
                targetId: activePage.id,
                targetName: activePageLabel,
                targetKind: "Page",
              });
            }}
          >
            <div className={styles.pageFrame}>
              <div className={styles.pageHeader}>
                <div>
                  <strong>{activePageLabel}</strong>
                  <span>{activePage.note}</span>
                </div>
                <div className={styles.pagePill}>{activePage.sizePreset}</div>
              </div>

              <div
                className={styles.pageSurface}
                data-studio-page-surface="true"
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsCanvasDropActive(true);
                }}
                onDragLeave={() => setIsCanvasDropActive(false)}
                onDrop={handleCanvasDrop}
              >
                <div
                  className={`${styles.canvasDropOverlay} ${
                    isCanvasDropActive ? styles.canvasDropOverlayActive : ""
                  }`}
                />
                  {activeNodes.map((node) => {
                  const active = node.id === selectedObject?.id;
                  const dragging = node.id === draggingNodeId;
                  const emojiMarkup =
                    node.kind === "emoji"
                      ? twemoji.parse(node.name, { folder: "svg", ext: ".svg" })
                      : "";
                  return (
                    <button
                      key={node.id}
                      type="button"
                      className={`${styles.canvasObject} ${objectToneClass(node.tone)} ${
                        active ? styles.canvasObjectActive : ""
                      } ${dragging ? styles.canvasObjectDragging : ""}`}
                      style={{
                        left: `${node.frame.x}px`,
                        top: `${node.frame.y}px`,
                        width: `${node.frame.width}px`,
                        height: `${node.frame.height}px`,
                      }}
                      data-dragging={dragging ? "true" : undefined}
                      aria-grabbed={dragging}
                      onPointerDown={beginNodeDrag(node)}
                      onPointerMove={updateDraggedNode(node)}
                      onPointerUp={finishNodeDrag(node)}
                      onPointerCancel={finishNodeDrag(node)}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedObjectId(node.id);
                      }}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setSelectedObjectId(node.id);
                        openContextMenu({
                          x: event.clientX,
                          y: event.clientY,
                          targetId: node.id,
                          targetName: node.name,
                          targetKind: kindLabels[node.kind],
                        });
                      }}
                    >
                      <span className={styles.canvasObjectType}>{kindLabels[node.kind]}</span>
                      {node.kind === "emoji" ? (
                        <span
                          className={styles.canvasEmoji}
                          aria-label={node.name}
                          dangerouslySetInnerHTML={{ __html: emojiMarkup }}
                        />
                      ) : node.kind === "svg" ? (
                        <>
                          {node.previewUrl ? (
                            <img className={styles.canvasSvgPreview} src={node.previewUrl} alt={node.name} />
                          ) : null}
                          <span className={styles.canvasObjectName}>{node.name}</span>
                        </>
                      ) : (
                        <span className={styles.canvasObjectName}>{node.name}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <StudioUtilityPalette />
            <StudioFloatingPalette />

            {contextMenu ? (
              <div
                ref={menuRef}
                className={styles.contextMenu}
                style={{ left: contextMenu.x, top: contextMenu.y }}
                role="menu"
                aria-label="Menu contextuel"
              >
                <div className={styles.contextMenuHeader}>
                  <strong>{contextMenu.targetName}</strong>
                  <span>{contextMenu.targetKind}</span>
                </div>
                <button type="button" className={styles.contextMenuItem} onClick={duplicateContextTarget}>
                  <Copy size={14} />
                  {contextMenu.targetKind === "Page" ? "Dupliquer la page" : "Dupliquer l’objet"}
                </button>
                {contextMenu.targetKind !== "Page" ? (
                  <button
                    type="button"
                    className={styles.contextMenuItem}
                    onClick={toggleContextVisibility}
                  >
                    <PanelRight size={14} />
                    {selectedObject?.visible ? "Masquer" : "Afficher"}
                  </button>
                ) : null}
                {contextMenu.targetKind !== "Page" ? (
                  <button
                    type="button"
                    className={styles.contextMenuItem}
                    onClick={toggleContextLock}
                  >
                    <Check size={14} />
                    {selectedObject?.locked ? "Déverrouiller" : "Verrouiller"}
                  </button>
                ) : null}
                {contextMenu.targetKind !== "Page" ? (
                  <button
                    type="button"
                    className={styles.contextMenuItem}
                    onClick={() => {
                      moveSelectedNodeToEdge("front");
                      closeContextMenu();
                    }}
                  >
                    <ArrowDownToLine size={14} />
                    Premier plan
                  </button>
                ) : null}
                {contextMenu.targetKind !== "Page" ? (
                  <button
                    type="button"
                    className={styles.contextMenuItem}
                    onClick={() => {
                      moveSelectedNodeToEdge("back");
                      closeContextMenu();
                    }}
                  >
                    <ArrowUpToLine size={14} />
                    Arrière-plan
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <aside className={styles.rightPanel}>
        <div className={styles.sideHeader}>
          <div>
            <div className={styles.sideTitle}>Inspecteur</div>
            <div className={styles.sideSubtitle}>
              {selectedObject
                ? `${selectedObject.name} · ${selectedObjectKind}`
                : activePageLabel}
            </div>
          </div>
          <button type="button" className={styles.sideHeaderButton}>
            <PanelRight size={15} />
          </button>
        </div>

        <div className={styles.inspectorSummary}>
          <div className={styles.inspectorKicker}>
            {selectedObject ? "Objet sélectionné" : "Page active"}
          </div>
          <h2>{selectedObject ? selectedObjectLabel : activePageLabel}</h2>
          <p>{selectedObjectDescription}</p>
        </div>

        <div className={styles.inspectorBody}>
          <section className={styles.inspectorSection}>
            <div className={styles.sectionHeader}>
              <h3>Document</h3>
              <span>{studioDocument.mode}</span>
            </div>
            <div className={styles.fieldStack}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Nom du document</span>
                <input
                  className={styles.fieldInput}
                  value={studioDocument.name}
                  onChange={(event) => renameDocument(event.target.value)}
                />
              </label>

              <div className={styles.segmentedRow}>
                <button
                  type="button"
                  className={`${styles.segmentButton} ${
                    studioDocument.mode === "template" ? styles.segmentButtonActive : ""
                  }`}
                  onClick={() => setDocumentMode("template")}
                >
                  Template
                </button>
                <button
                  type="button"
                  className={`${styles.segmentButton} ${
                    studioDocument.mode === "document" ? styles.segmentButtonActive : ""
                  }`}
                  onClick={() => setDocumentMode("document")}
                >
                  Document
                </button>
              </div>
            </div>
          </section>

          <section className={styles.inspectorSection}>
            <div className={styles.sectionHeader}>
              <h3>{selectedObject ? "Objet" : "Page"}</h3>
              <span>{selectedObject ? selectedObjectKind : activePage.sizePreset}</span>
            </div>
            <div className={styles.fieldStack}>
              {selectedObject ? (
                <>
                  <div className={styles.inspectorMetaRow}>
                    <div className={styles.inspectorMetaItem}>
                      <span className={styles.fieldLabel}>Calque</span>
                      <strong>{selectedLayer ? selectedLayer.name : "Sans calque"}</strong>
                    </div>
                    <div className={styles.inspectorMetaItem}>
                      <span className={styles.fieldLabel}>Ordre</span>
                      <strong>{selectedObject.order}</strong>
                    </div>
                  </div>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Nom</span>
                    <input
                      className={styles.fieldInput}
                      value={selectedObject.name}
                      onChange={(event) => renameNode(selectedObject.id, event.target.value)}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Description</span>
                    <textarea
                      className={styles.fieldTextarea}
                      value={selectedObject.description}
                      onChange={(event) =>
                        updateNodeDescription(selectedObject.id, event.target.value)
                      }
                    />
                  </label>

                  <div className={styles.geometryGrid}>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>X</span>
                      <input
                        className={styles.fieldInput}
                        type="number"
                        value={selectedObject.frame.x}
                        onChange={(event) =>
                          updateNodeFrame(selectedObject.id, {
                            x: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Y</span>
                      <input
                        className={styles.fieldInput}
                        type="number"
                        value={selectedObject.frame.y}
                        onChange={(event) =>
                          updateNodeFrame(selectedObject.id, {
                            y: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Largeur</span>
                      <input
                        className={styles.fieldInput}
                        type="number"
                        value={selectedObject.frame.width}
                        onChange={(event) =>
                          updateNodeFrame(selectedObject.id, {
                            width: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Hauteur</span>
                      <input
                        className={styles.fieldInput}
                        type="number"
                        value={selectedObject.frame.height}
                        onChange={(event) =>
                          updateNodeFrame(selectedObject.id, {
                            height: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  </div>

                  <div className={styles.quickActionGrid}>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => duplicateNode(selectedObject.id)}
                    >
                      <Copy size={14} />
                      Dupliquer
                    </button>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => toggleNodeVisibility(selectedObject.id)}
                    >
                      <ArrowLeft size={14} />
                      {selectedObject.visible ? "Masquer" : "Afficher"}
                    </button>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => toggleNodeLock(selectedObject.id)}
                    >
                      <ArrowRight size={14} />
                      {selectedObject.locked ? "Déverrouiller" : "Verrouiller"}
                    </button>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => moveSelectedNode("up")}
                    >
                      <ArrowLeft size={14} />
                      Monter
                    </button>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => moveSelectedNode("down")}
                    >
                      <ArrowRight size={14} />
                      Descendre
                    </button>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => moveSelectedNodeToEdge("front")}
                    >
                      <ArrowDownToLine size={14} />
                      Premier plan
                    </button>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => moveSelectedNodeToEdge("back")}
                    >
                      <ArrowUpToLine size={14} />
                      Arrière-plan
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Nom de la page</span>
                    <input
                      className={styles.fieldInput}
                      value={activePage.name}
                      onChange={(event) => renamePage(activePage.id, event.target.value)}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Note</span>
                    <input
                      className={styles.fieldInput}
                      value={activePage.note}
                      onChange={(event) => updatePageNote(activePage.id, event.target.value)}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Couleur de fond</span>
                    <input
                      className={styles.fieldColor}
                      type="color"
                      value={activePage.backgroundColor}
                      onChange={(event) =>
                        updatePageBackgroundColor(activePage.id, event.target.value)
                      }
                    />
                  </label>

                  <div className={styles.segmentedRow}>
                    <button
                      type="button"
                      className={`${styles.segmentButton} ${
                        activePage.orientation === "portrait" ? styles.segmentButtonActive : ""
                      }`}
                      onClick={() => updatePageOrientation(activePage.id, "portrait")}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      className={`${styles.segmentButton} ${
                        activePage.orientation === "landscape" ? styles.segmentButtonActive : ""
                      }`}
                      onClick={() => updatePageOrientation(activePage.id, "landscape")}
                    >
                      Paysage
                    </button>
                  </div>

                  <div className={styles.quickActionGrid}>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => duplicatePage(activePage.id)}
                    >
                      <Copy size={14} />
                      Dupliquer la page
                    </button>
                    <button
                      type="button"
                      className={styles.quickAction}
                      onClick={() => duplicatePage(activePage.id)}
                    >
                      <ArrowLeft size={14} />
                      Créer une copie
                    </button>
                    <button type="button" className={styles.quickAction}>
                      <ArrowRight size={14} />
                      Paramètres
                    </button>
                    <button type="button" className={styles.quickAction}>
                      <Minus size={14} />
                      Aperçu
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className={styles.inspectorSection}>
            <div className={styles.sectionHeader}>
              <h3>Propriétés</h3>
              <span>{selectedObject ? selectedObjectKind : "Page"}</span>
            </div>
            <div className={styles.propertyGrid}>
              {inspectorFields.map((field) => (
                <div key={field.label} className={styles.propertyCard}>
                  <span>{field.label}</span>
                  <strong>{field.value}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </main>
  );
}
