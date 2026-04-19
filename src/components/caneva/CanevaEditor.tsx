"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import type { EmojiClickData } from "emoji-picker-react";
import { Canvg } from "canvg";
import twemoji from "twemoji";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Bold,
  Brush,
  ChevronDown,
  ChevronLeft,
  Circle,
  Copy,
  FileText,
  Grid3X3,
  GripHorizontal,
  Hand,
  Hexagon,
  Image as ImageIcon,
  Italic,
  Layers3,
  LayoutDashboard,
  LineSquiggle,
  Lock,
  Magnet,
  MousePointer2,
  MoveVertical,
  PanelLeft,
  PanelRight,
  Pencil,
  Plus,
  Ruler,
  Search,
  Shapes,
  Settings2,
  Smile,
  Square,
  Star,
  Table2,
  TextCursorInput,
  Trash2,
  Underline,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  Frame,
  RotateCw,
  Rows3,
} from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./CanevaEditor.module.css";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

type LeftTabId = "variables" | "libraries" | "layers" | "objects" | "pages";
type LeftSubTabId =
  | "variables"
  | "presets"
  | "images"
  | "graphics"
  | "icons"
  | "emoji";
type LibrarySubTabId = "images" | "graphics" | "icons" | "emoji";
type LibraryViewMode = "grid" | "list";
type LibraryCardSettings = {
  thumbnailWidth: number;
  thumbnailHeight: number;
  showName: boolean;
  showSize: boolean;
};
type SelectionType = "image" | "multi" | "scene" | "richText";
type ToolId =
  | "select"
  | "multi"
  | "pan"
  | "brush"
  | "pencil"
  | "line"
  | "shape"
  | "text"
  | "image"
  | "emoji"
  | "svg";

type CanvasNode = {
  id: string;
  kind: SelectionType;
  title: string;
  note: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone: "warm" | "cool" | "ink" | "graph" | "soft";
};

type PageEntry = {
  id: string;
  title: string;
  note: string;
  size: string;
  status: "Live" | "Draft" | "Variant";
};

type LayerEntry = {
  id: string;
  title: string;
  visible: boolean;
  locked: boolean;
  note: string;
};

type ObjectEntry = {
  id: string;
  title: string;
  kind: SelectionType | "shape";
  note: string;
  badge: string;
};

const leftTabs: Array<{
  id: LeftTabId;
  label: string;
  icon: typeof PanelLeft;
}> = [
  { id: "variables", label: "Variables", icon: PanelLeft },
  { id: "libraries", label: "Bibliothèques", icon: Layers3 },
  { id: "layers", label: "Calques", icon: Grid3X3 },
  { id: "objects", label: "Objets", icon: LayoutDashboard },
  { id: "pages", label: "Pages", icon: FileText },
];

const leftSubTabs: Record<Exclude<LeftTabId, "layers" | "objects" | "pages">, Array<{ id: LeftSubTabId; label: string }>> = {
  variables: [
    { id: "variables", label: "Variables" },
    { id: "presets", label: "Presets" },
  ],
  libraries: [
    { id: "images", label: "Images" },
    { id: "graphics", label: "Graphiques" },
    { id: "icons", label: "Icônes" },
    { id: "emoji", label: "Émojis" },
  ],
};

const librarySubTabs: Array<{
  id: LibrarySubTabId;
  label: string;
  icon: typeof ImageIcon;
}> = [
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "graphics", label: "Graphiques", icon: Shapes },
  { id: "icons", label: "Icônes", icon: Grid3X3 },
  { id: "emoji", label: "Émojis", icon: Smile },
];

const tools: Array<{ id: ToolId; label: string; icon: typeof MousePointer2 }> = [
  { id: "select", label: "Sélection", icon: MousePointer2 },
  { id: "multi", label: "Multi", icon: Square },
  { id: "pan", label: "Pan", icon: Hand },
  { id: "brush", label: "Crayon", icon: Brush },
  { id: "pencil", label: "Pinceau", icon: Pencil },
  { id: "line", label: "Ligne", icon: LineSquiggle },
  { id: "shape", label: "Forme", icon: Shapes },
  { id: "text", label: "Texte", icon: TextCursorInput },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "emoji", label: "Emoji", icon: Smile },
  { id: "svg", label: "SVG", icon: Frame },
];

const pages: PageEntry[] = [
  { id: "cover", title: "Couverture", note: "Hero et identité", size: "1360 × 860", status: "Live" },
  { id: "story", title: "Storyboard", note: "Variantes de blocs", size: "1360 × 860", status: "Draft" },
  { id: "deck", title: "Deck", note: "Présentation avancée", size: "1360 × 860", status: "Variant" },
  { id: "export", title: "Export", note: "Sortie finale", size: "1360 × 860", status: "Live" },
];

const layers: LayerEntry[] = [
  { id: "bg", title: "Background", visible: true, locked: true, note: "Fond et ambiance" },
  { id: "guides", title: "Guides", visible: true, locked: true, note: "Grille et repères" },
  { id: "content", title: "Content", visible: true, locked: false, note: "Textes, images, blocs" },
  { id: "overlay", title: "Overlay", visible: true, locked: false, note: "Badges et accents" },
];

const objects: ObjectEntry[] = [
  { id: "hero-title", title: "Hero title", kind: "richText", note: "Titre principal", badge: "Texte" },
  { id: "hero-image", title: "Hero image", kind: "image", note: "Image centrale", badge: "Image" },
  { id: "metrics", title: "Metrics card", kind: "shape", note: "Carte de synthèse", badge: "Forme" },
  { id: "copy-block", title: "Copy block", kind: "richText", note: "Paragraphe éditable", badge: "Texte" },
  { id: "emoji-badge", title: "Emoji accent", kind: "shape", note: "Accent décoratif", badge: "Emoji" },
  { id: "svg-badge", title: "SVG badge", kind: "shape", note: "Asset vectoriel", badge: "SVG" },
];

const canvasNodes: CanvasNode[] = [
  {
    id: "hero-title",
    kind: "richText",
    title: "Premium scene title",
    note: "Bloc textuel éditable avec hiérarchie et variables.",
    x: 76,
    y: 74,
    width: 454,
    height: 162,
    tone: "warm",
  },
  {
    id: "hero-image",
    kind: "image",
    title: "Portrait / asset image",
    note: "Visuel principal avec masque et ajustements.",
    x: 820,
    y: 74,
    width: 340,
    height: 226,
    tone: "cool",
  },
  {
    id: "metrics",
    kind: "scene",
    title: "Metrics / key figure",
    note: "Carte compacte pour données et repères.",
    x: 76,
    y: 266,
    width: 322,
    height: 160,
    tone: "graph",
  },
  {
    id: "copy-block",
    kind: "richText",
    title: "Narrative paragraph",
    note: "Bloc long pour prose, mapping et alignements.",
    x: 422,
    y: 286,
    width: 738,
    height: 144,
    tone: "ink",
  },
  {
    id: "emoji-badge",
    kind: "image",
    title: "Emoji accent",
    note: "Bibliothèque emoji avec rendu homogène.",
    x: 822,
    y: 456,
    width: 160,
    height: 132,
    tone: "soft",
  },
  {
    id: "svg-badge",
    kind: "image",
    title: "SVG asset",
    note: "Rendu vectoriel rasterisé pour le canvas.",
    x: 1008,
    y: 456,
    width: 160,
    height: 132,
    tone: "cool",
  },
  {
    id: "summary-table",
    kind: "multi",
    title: "Summary table",
    note: "Table, structure ou multi-sélection.",
    x: 76,
    y: 448,
    width: 704,
    height: 196,
    tone: "graph",
  },
];

const variableRows = [
  { key: "{nom}", label: "Nom", type: "Texte", description: "Nom affiché dans le hero." },
  { key: "{prenom}", label: "Prénom", type: "Texte", description: "Prénom du contact." },
  { key: "{age}", label: "Âge", type: "Nombre", description: "Valeur numérique de profil." },
  { key: "{current_date}", label: "Date actuelle", type: "Date", description: "Date système formatée." },
];

const presetCards = [
  { title: "Hero stack", note: "Titre, intro, métriques", badge: "Text", preview: "A" },
  { title: "Data bar", note: "Carte de synthèse", badge: "Block", preview: "B" },
  { title: "Quote strip", note: "Citation éditoriale", badge: "Style", preview: "C" },
];

const imageCards: Array<{
  title: string;
  note: string;
  badge: string;
  tone: "warm" | "cool" | "ink" | "graph";
}> = [
  { title: "Portrait 01", note: "Image éditoriale", badge: "Photo", tone: "warm" },
  { title: "Portrait 02", note: "Asset produit", badge: "Photo", tone: "cool" },
  { title: "Background 01", note: "Texture douce", badge: "BG", tone: "ink" },
  { title: "Frame 01", note: "Cadre prêt à l’emploi", badge: "UI", tone: "graph" },
];

const iconCards: Array<{
  title: string;
  note: string;
  badge: string;
  icon: typeof Grid3X3;
}> = [
  { title: "Grid", note: "Grille", badge: "Icon", icon: Grid3X3 },
  { title: "Layers", note: "Calques", badge: "Icon", icon: Layers3 },
  { title: "Spark", note: "Accent", badge: "Icon", icon: RotateCw },
  { title: "Info", note: "Métadonnées", badge: "Icon", icon: FileText },
  { title: "Lock", note: "Sécurité", badge: "Icon", icon: Lock },
  { title: "Eye", note: "Visibilité", badge: "Icon", icon: Eye },
];

const libraryEmojis = ["✨", "⚡", "🧭", "🪄", "🎯", "🧱", "📐", "🧩", "🪞", "🌿"];

const libraryDefaultSettings: Record<Exclude<LibrarySubTabId, "emoji">, LibraryCardSettings> = {
  images: {
    thumbnailWidth: 108,
    thumbnailHeight: 84,
    showName: false,
    showSize: false,
  },
  graphics: {
    thumbnailWidth: 108,
    thumbnailHeight: 84,
    showName: true,
    showSize: true,
  },
  icons: {
    thumbnailWidth: 96,
    thumbnailHeight: 74,
    showName: true,
    showSize: false,
  },
};

const graphicsCards: Array<{
  title: string;
  note: string;
  badge: string;
  preview: "rect" | "circle" | "star" | "svg";
}> = [
  { title: "Rectangle", note: "Forme de base", badge: "Shape", preview: "rect" },
  { title: "Circle", note: "Forme arrondie", badge: "Shape", preview: "circle" },
  { title: "Star", note: "Accent visuel", badge: "Shape", preview: "star" },
  { title: "SVG badge", note: "Preview rasterisée", badge: "SVG", preview: "svg" },
];

const defaultNodeBySelectionType: Record<SelectionType, string> = {
  image: "hero-image",
  multi: "summary-table",
  scene: "metrics",
  richText: "hero-title",
};

function makeSceneSizeLabel(width: number, height: number) {
  return `${width} × ${height}px`;
}

function imageToneGradient(tone: "warm" | "cool" | "ink" | "graph") {
  switch (tone) {
    case "warm":
      return "linear-gradient(135deg, rgba(245, 166, 35, 0.72), rgba(255, 216, 160, 0.26)), linear-gradient(180deg, rgba(16, 18, 22, 0.12), rgba(16, 18, 22, 0.18))";
    case "cool":
      return "linear-gradient(135deg, rgba(58, 194, 255, 0.7), rgba(154, 220, 255, 0.26)), linear-gradient(180deg, rgba(16, 18, 22, 0.12), rgba(16, 18, 22, 0.18))";
    case "ink":
      return "linear-gradient(135deg, rgba(35, 39, 48, 0.8), rgba(75, 82, 95, 0.24)), linear-gradient(180deg, rgba(16, 18, 22, 0.12), rgba(16, 18, 22, 0.18))";
    case "graph":
      return "linear-gradient(135deg, rgba(95, 255, 196, 0.68), rgba(245, 166, 35, 0.2)), linear-gradient(180deg, rgba(16, 18, 22, 0.12), rgba(16, 18, 22, 0.18))";
  }
}

function shapeGlyphClass(shape: "rect" | "circle" | "star" | "svg") {
  switch (shape) {
    case "rect":
      return styles.shapeGlyphRect;
    case "circle":
      return styles.shapeGlyphCircle;
    case "star":
      return styles.shapeGlyphStar;
    case "svg":
      return styles.shapeGlyphSvg;
  }
}

function buildEmojiHtml(emoji: string) {
  return twemoji.parse(emoji, {
    folder: "svg",
    ext: ".svg",
    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
  });
}

function buildSvgMarkup() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f5a623"/>
          <stop offset="100%" stop-color="#ffc880"/>
        </linearGradient>
      </defs>
      <rect x="18" y="18" rx="24" ry="24" width="204" height="124" fill="#111317"/>
      <circle cx="72" cy="82" r="28" fill="url(#g)"/>
      <rect x="114" y="52" width="70" height="16" rx="8" fill="#e2e2e6" opacity="0.9"/>
      <rect x="114" y="78" width="46" height="12" rx="6" fill="#d7c3ae" opacity="0.7"/>
      <rect x="114" y="98" width="56" height="12" rx="6" fill="#9bd9ff" opacity="0.6"/>
    </svg>
  `;
}

function LeftSidebar({
  activeTab,
  activeSubTab,
  setActiveTab,
  setActiveSubTab,
  svgPreviewRef,
  selectedEmoji,
  setSelectedEmoji,
  libraryViewModes,
  setLibraryViewMode,
}: {
  activeTab: LeftTabId;
  activeSubTab: LeftSubTabId;
  setActiveTab: (tab: LeftTabId) => void;
  setActiveSubTab: (tab: LeftSubTabId) => void;
  svgPreviewRef: React.RefObject<HTMLCanvasElement | null>;
  selectedEmoji: string;
  setSelectedEmoji: (emoji: string) => void;
  libraryViewModes: Record<LibrarySubTabId, LibraryViewMode>;
  setLibraryViewMode: (tab: LibrarySubTabId, mode: LibraryViewMode) => void;
}) {
  const [openSettingsTab, setOpenSettingsTab] = useState<LibrarySubTabId | null>(null);
  const [libraryCardSettings, setLibraryCardSettings] = useState<Record<Exclude<LibrarySubTabId, "emoji">, LibraryCardSettings>>(
    libraryDefaultSettings,
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (
        target.closest("[data-library-settings-anchor]") ||
        target.closest("[data-library-settings-popover]")
      ) {
        return;
      }
      setOpenSettingsTab(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenSettingsTab(null);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const topTitle =
    activeTab === "variables"
      ? "Référentiels"
      : activeTab === "libraries"
        ? "Bibliothèque visuelle"
        : activeTab === "layers"
          ? "Gestion des calques"
          : activeTab === "objects"
            ? "Catalogue des objets"
            : "Pages du projet";

  const renderLibrarySettingsPopover = (tab: Exclude<LibrarySubTabId, "emoji">, label: string) => {
    const settings = libraryCardSettings[tab];
    const isOpen = openSettingsTab === tab;

    return (
      <div className={styles.settingsWrap}>
        <button
          type="button"
          className={cn(styles.settingsButton, isOpen && styles.settingsButtonActive)}
          aria-label={`Paramètres ${label}`}
          title={`Paramètres ${label}`}
          data-library-settings-anchor
          onClick={() => setOpenSettingsTab((current) => (current === tab ? null : tab))}
        >
          <Settings2 size={14} />
        </button>
        {isOpen ? (
          <div className={styles.settingsPopover} role="dialog" aria-label={`Paramètres ${label}`} data-library-settings-popover>
            <div className={styles.settingsPopoverHeader}>
              <div>
                <div className={styles.settingsPopoverTitle}>{label}</div>
                <div className={styles.settingsPopoverNote}>Ajuster la densité d’affichage.</div>
              </div>
              <button
                type="button"
                className={styles.settingsPopoverClose}
                aria-label="Fermer"
                onClick={() => setOpenSettingsTab(null)}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            <div className={styles.settingsPopoverGrid}>
              <label className={styles.settingsField}>
                <span className={styles.settingsFieldLabel}>Largeur thumbnail</span>
                <input
                  className={styles.settingsFieldInput}
                  type="number"
                  min={64}
                  max={224}
                  step={4}
                  value={settings.thumbnailWidth}
                  onChange={(event) =>
                    setLibraryCardSettings((current) => ({
                      ...current,
                      [tab]: { ...current[tab], thumbnailWidth: Number(event.target.value) || 64 },
                    }))
                  }
                />
              </label>
              <label className={styles.settingsField}>
                <span className={styles.settingsFieldLabel}>Hauteur thumbnail</span>
                <input
                  className={styles.settingsFieldInput}
                  type="number"
                  min={48}
                  max={224}
                  step={4}
                  value={settings.thumbnailHeight}
                  onChange={(event) =>
                    setLibraryCardSettings((current) => ({
                      ...current,
                      [tab]: { ...current[tab], thumbnailHeight: Number(event.target.value) || 48 },
                    }))
                  }
                />
              </label>
            </div>

            <label className={styles.settingsCheckboxRow}>
              <input
                type="checkbox"
                checked={settings.showName}
                onChange={(event) =>
                  setLibraryCardSettings((current) => ({
                    ...current,
                    [tab]: { ...current[tab], showName: event.target.checked },
                  }))
                }
              />
              <span>Afficher nom</span>
            </label>

            <label className={styles.settingsCheckboxRow}>
              <input
                type="checkbox"
                checked={settings.showSize}
                onChange={(event) =>
                  setLibraryCardSettings((current) => ({
                    ...current,
                    [tab]: { ...current[tab], showSize: event.target.checked },
                  }))
                }
              />
              <span>Afficher taille</span>
            </label>
          </div>
        ) : null}
      </div>
    );
  };

  const libraryThumbStyle = (settings: LibraryCardSettings): CSSProperties =>
    ({
      "--library-thumb-width": `${settings.thumbnailWidth}px`,
      "--library-thumb-height": `${settings.thumbnailHeight}px`,
    }) as CSSProperties;

  const emojiThumbStyle = { "--emoji-thumb-size": "64px" } as CSSProperties;

  return (
    <aside className={styles.leftSidebar}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleRow}>
          <div>
            <div className={styles.panelKicker}>Volet gauche</div>
            <h2 className={styles.panelTitle}>Caneva</h2>
          </div>
          <div className={styles.pill}>Module actif</div>
        </div>
        <div className={styles.panelMeta}>{topTitle}</div>
      </div>

      <div className={styles.tabStrip}>
        {leftTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              className={cn(styles.tabButton, activeTab === tab.id && styles.tabButtonActive)}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "variables") {
                  setActiveSubTab("variables");
                }
                if (tab.id === "libraries") {
                  setActiveSubTab("images");
                }
              }}
            >
              <Icon size={18} />
              <span className="sr-only">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {(activeTab === "variables" || activeTab === "libraries") && (
        <div className={styles.subTabStrip}>
          {activeTab === "variables"
            ? leftSubTabs.variables.map((subTab) => (
                <button
                  key={subTab.id}
                  type="button"
                  className={cn(
                    styles.subTabButton,
                    activeSubTab === subTab.id && styles.subTabButtonActive,
                  )}
                  onClick={() => setActiveSubTab(subTab.id)}
                >
                  <span className={styles.tabLabel}>{subTab.label}</span>
                </button>
              ))
            : librarySubTabs.map((subTab) => {
                const Icon = subTab.icon;

                return (
                  <button
                    key={subTab.id}
                    type="button"
                    className={cn(
                      styles.subTabButton,
                      styles.subTabButtonStack,
                      activeSubTab === subTab.id && styles.subTabButtonActive,
                    )}
                    onClick={() => setActiveSubTab(subTab.id)}
                  >
                    <Icon size={18} />
                    <span className="sr-only">{subTab.label}</span>
                  </button>
                );
              })}
        </div>
      )}

      <div className={styles.content}>
        {activeTab === "variables" && activeSubTab === "variables" && (
          <div className={styles.section}>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Filtrer par nom..." />
            </div>

            <div className={styles.list}>
              {variableRows.map((row) => (
                <article key={row.key} className={styles.rowCard}>
                  <div className={styles.rowHeader}>
                    <div>
                      <h3 className={styles.rowTitle}>{row.label}</h3>
                      <div className={styles.rowMeta}>{row.description}</div>
                    </div>
                    <div className={styles.rowBadge}>{row.type}</div>
                  </div>
                  <div className={styles.rowTag}>{row.key}</div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "variables" && activeSubTab === "presets" && (
          <div className={styles.section}>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Filtrer les presets..." />
            </div>

            <div className={styles.list}>
              {presetCards.map((preset, index) => (
                <article key={preset.title} className={styles.rowCard}>
                  <div className={styles.rowHeader}>
                    <div>
                      <h3 className={styles.rowTitle}>{preset.title}</h3>
                      <div className={styles.rowMeta}>{preset.note}</div>
                    </div>
                    <div className={styles.rowBadge}>{preset.badge}</div>
                  </div>
                  <div className={styles.rowTag}>Preset #{index + 1}</div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "libraries" && activeSubTab === "images" && (
          <div className={styles.section}>
            <div className={styles.sectionToolbar}>
              <div className={styles.sectionTitle}>
                <span>Images</span>
                <span className={styles.sectionNote}>Thumbnail grid / list</span>
              </div>
              <div className={styles.sectionActions}>
                {renderLibrarySettingsPopover("images", "Images")}
                <div className={styles.viewToggle} role="tablist" aria-label="Vue des images">
                <button
                  type="button"
                  className={cn(
                    styles.viewToggleButton,
                    libraryViewModes.images === "grid" && styles.viewToggleButtonActive,
                  )}
                  onClick={() => setLibraryViewMode("images", "grid")}
                  aria-label="Vue grille"
                  title="Vue grille"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  type="button"
                  className={cn(
                    styles.viewToggleButton,
                    libraryViewModes.images === "list" && styles.viewToggleButtonActive,
                  )}
                  onClick={() => setLibraryViewMode("images", "list")}
                  aria-label="Vue liste"
                  title="Vue liste"
                  >
                  <Rows3 size={16} />
                </button>
              </div>
              </div>
            </div>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Rechercher une image..." />
            </div>
            {libraryViewModes.images === "grid" ? (
              <ul className={cn(styles.libraryGridBase, styles.libraryGrid)} role="list" style={libraryThumbStyle(libraryCardSettings.images)}>
                {imageCards.map((card) => (
                  <li key={card.title} className={styles.libraryGridItem}>
                    <button type="button" className={cn(styles.libraryCard, styles.libraryGridTile)}>
                      <div
                        className={styles.libraryGridPreview}
                        style={{
                          background: imageToneGradient(card.tone),
                          width: libraryCardSettings.images.thumbnailWidth,
                          height: libraryCardSettings.images.thumbnailHeight,
                        }}
                      />
                      {libraryCardSettings.images.showName || libraryCardSettings.images.showSize ? (
                        <div className={styles.libraryGridCopy}>
                          {libraryCardSettings.images.showName ? <h3 className={styles.gridTitle}>{card.title}</h3> : null}
                          {libraryCardSettings.images.showSize ? (
                            <div className={styles.gridMeta}>
                              {libraryCardSettings.images.thumbnailWidth} × {libraryCardSettings.images.thumbnailHeight}px
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={cn(styles.libraryGridBase, styles.libraryList)} role="list" style={libraryThumbStyle(libraryCardSettings.images)}>
                {imageCards.map((card) => (
                  <li key={card.title} className={styles.libraryListItem}>
                    <button type="button" className={cn(styles.libraryCard, styles.libraryListRow)}>
                      <div
                        className={styles.libraryListPreview}
                        style={{
                          background: imageToneGradient(card.tone),
                          width: libraryCardSettings.images.thumbnailWidth,
                          height: libraryCardSettings.images.thumbnailHeight,
                        }}
                      >
                        <span
                          className={styles.libraryListPreviewThumb}
                          style={{
                            width: Math.max(24, Math.min(42, Math.round(libraryCardSettings.images.thumbnailWidth / 2.6))),
                            height: Math.max(24, Math.min(42, Math.round(libraryCardSettings.images.thumbnailHeight / 2.6))),
                          }}
                        />
                      </div>
                      <div className={styles.libraryListCopy}>
                        {libraryCardSettings.images.showName ? <h3 className={styles.gridTitle}>{card.title}</h3> : null}
                        {libraryCardSettings.images.showSize ? (
                          <div className={styles.gridMeta}>
                            {libraryCardSettings.images.thumbnailWidth} × {libraryCardSettings.images.thumbnailHeight}px
                          </div>
                        ) : null}
                      </div>
                      <div className={styles.gridBadge}>{card.badge}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "libraries" && activeSubTab === "graphics" && (
          <div className={styles.section}>
            <div className={styles.sectionToolbar}>
              <div className={styles.sectionTitle}>
                <span>Graphiques</span>
                <span className={styles.sectionNote}>Shape grid / list</span>
              </div>
              <div className={styles.sectionActions}>
                {renderLibrarySettingsPopover("graphics", "Graphiques")}
                <div className={styles.viewToggle} role="tablist" aria-label="Vue des graphiques">
                <button
                  type="button"
                  className={cn(
                    styles.viewToggleButton,
                    libraryViewModes.graphics === "grid" && styles.viewToggleButtonActive,
                  )}
                  onClick={() => setLibraryViewMode("graphics", "grid")}
                  aria-label="Vue grille"
                  title="Vue grille"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  type="button"
                  className={cn(
                    styles.viewToggleButton,
                    libraryViewModes.graphics === "list" && styles.viewToggleButtonActive,
                  )}
                  onClick={() => setLibraryViewMode("graphics", "list")}
                  aria-label="Vue liste"
                  title="Vue liste"
                  >
                  <Rows3 size={16} />
                </button>
              </div>
              </div>
            </div>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Rechercher une forme ou un SVG..." />
            </div>
            {libraryViewModes.graphics === "grid" ? (
              <ul className={cn(styles.libraryGridBase, styles.libraryGrid)} role="list" style={libraryThumbStyle(libraryCardSettings.graphics)}>
                {graphicsCards.map((card) => (
                  <li key={card.title} className={styles.libraryGridItem}>
                    <button type="button" className={cn(styles.libraryCard, styles.libraryGridTile)}>
                      {card.preview === "svg" ? (
                        <div className={styles.gridPreviewSvg}>
                          <canvas
                            ref={svgPreviewRef}
                            width={240}
                            height={160}
                            style={{
                              width: libraryCardSettings.graphics.thumbnailWidth,
                              height: libraryCardSettings.graphics.thumbnailHeight,
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className={styles.libraryPreviewShape}
                          style={{
                            width: libraryCardSettings.graphics.thumbnailWidth,
                            height: libraryCardSettings.graphics.thumbnailHeight,
                          }}
                        >
                          <span className={cn(styles.shapeGlyph, shapeGlyphClass(card.preview))} />
                        </div>
                      )}
                      <div className={styles.gridHeader}>
                        <div className={styles.libraryGridCopy}>
                          {libraryCardSettings.graphics.showName ? <h3 className={styles.gridTitle}>{card.title}</h3> : null}
                          {libraryCardSettings.graphics.showSize ? (
                            <div className={styles.gridMeta}>
                              {libraryCardSettings.graphics.thumbnailWidth} × {libraryCardSettings.graphics.thumbnailHeight}px
                            </div>
                          ) : null}
                        </div>
                        <div className={styles.gridBadge}>{card.badge}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={cn(styles.libraryGridBase, styles.libraryList)} role="list" style={libraryThumbStyle(libraryCardSettings.graphics)}>
                {graphicsCards.map((card) => (
                  <li key={card.title} className={styles.libraryListItem}>
                    <button type="button" className={cn(styles.libraryCard, styles.libraryListRow)}>
                      <div className={styles.libraryListPreview}>
                        {card.preview === "svg" ? (
                          <canvas
                            ref={svgPreviewRef}
                            width={240}
                            height={160}
                            style={{
                              width: libraryCardSettings.graphics.thumbnailWidth,
                              height: libraryCardSettings.graphics.thumbnailHeight,
                            }}
                          />
                        ) : (
                          <span
                            className={cn(styles.shapeGlyph, shapeGlyphClass(card.preview), styles.libraryListPreviewThumb)}
                            style={{
                              width: Math.max(24, Math.min(42, Math.round(libraryCardSettings.graphics.thumbnailWidth / 2.6))),
                              height: Math.max(24, Math.min(42, Math.round(libraryCardSettings.graphics.thumbnailHeight / 2.6))),
                            }}
                          />
                        )}
                      </div>
                      <div className={styles.libraryListCopy}>
                        {libraryCardSettings.graphics.showName ? <h3 className={styles.gridTitle}>{card.title}</h3> : null}
                        {libraryCardSettings.graphics.showSize ? (
                          <div className={styles.gridMeta}>
                            {libraryCardSettings.graphics.thumbnailWidth} × {libraryCardSettings.graphics.thumbnailHeight}px
                          </div>
                        ) : null}
                      </div>
                      <div className={styles.gridBadge}>{card.badge}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "libraries" && activeSubTab === "icons" && (
          <div className={styles.section}>
            <div className={styles.sectionToolbar}>
              <div className={styles.sectionTitle}>
                <span>Icônes</span>
                <span className={styles.sectionNote}>Icon list / grid</span>
              </div>
              <div className={styles.sectionActions}>
                {renderLibrarySettingsPopover("icons", "Icônes")}
                <div className={styles.viewToggle} role="tablist" aria-label="Vue des icônes">
                <button
                  type="button"
                  className={cn(
                    styles.viewToggleButton,
                    libraryViewModes.icons === "grid" && styles.viewToggleButtonActive,
                  )}
                  onClick={() => setLibraryViewMode("icons", "grid")}
                  aria-label="Vue grille"
                  title="Vue grille"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  type="button"
                  className={cn(
                    styles.viewToggleButton,
                    libraryViewModes.icons === "list" && styles.viewToggleButtonActive,
                  )}
                  onClick={() => setLibraryViewMode("icons", "list")}
                  aria-label="Vue liste"
                  title="Vue liste"
                  >
                  <Rows3 size={16} />
                </button>
              </div>
              </div>
            </div>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Rechercher une icône..." />
            </div>
            {libraryViewModes.icons === "grid" ? (
              <ul className={cn(styles.libraryGridBase, styles.libraryGrid)} role="list" style={libraryThumbStyle(libraryCardSettings.icons)}>
                {iconCards.map((card) => (
                  <li key={card.title} className={styles.libraryGridItem}>
                    <button type="button" className={cn(styles.libraryCard, styles.libraryGridTile)}>
                      <div
                        className={styles.libraryGridPreview}
                        style={{
                          width: libraryCardSettings.icons.thumbnailWidth,
                          height: libraryCardSettings.icons.thumbnailHeight,
                        }}
                      >
                        <span className={styles.libraryIconGlyph}>
                          <card.icon size={18} />
                        </span>
                      </div>
                      <div className={styles.gridHeader}>
                        <div className={styles.libraryGridCopy}>
                          {libraryCardSettings.icons.showName ? <h3 className={styles.gridTitle}>{card.title}</h3> : null}
                          {libraryCardSettings.icons.showSize ? (
                            <div className={styles.gridMeta}>
                              {libraryCardSettings.icons.thumbnailWidth} × {libraryCardSettings.icons.thumbnailHeight}px
                            </div>
                          ) : null}
                        </div>
                        <div className={styles.gridBadge}>{card.badge}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={cn(styles.libraryGridBase, styles.libraryList)} role="list" style={libraryThumbStyle(libraryCardSettings.icons)}>
                {iconCards.map((card) => (
                  <li key={card.title} className={styles.libraryListItem}>
                    <button type="button" className={cn(styles.libraryCard, styles.libraryListRow)}>
                      <span
                        className={styles.libraryIconGlyph}
                        style={{
                          width: libraryCardSettings.icons.thumbnailWidth,
                          height: libraryCardSettings.icons.thumbnailHeight,
                        }}
                      >
                        <card.icon size={18} />
                      </span>
                      <span className={styles.libraryListCopy}>
                        {libraryCardSettings.icons.showName ? <span className={styles.gridTitle}>{card.title}</span> : null}
                        {libraryCardSettings.icons.showSize ? (
                          <span className={styles.gridMeta}>
                            {libraryCardSettings.icons.thumbnailWidth} × {libraryCardSettings.icons.thumbnailHeight}px
                          </span>
                        ) : null}
                      </span>
                      <span className={styles.gridBadge}>{card.badge}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "libraries" && activeSubTab === "emoji" && (
          <div className={styles.emojiPane}>
            <div className={styles.sectionToolbar}>
              <div className={styles.sectionTitle}>
                <span>Émojis</span>
                <span className={styles.sectionNote}>Emoji grid</span>
              </div>
            </div>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Chercher un emoji..." />
            </div>

            <div className={styles.emojiPreview}>
              <div dangerouslySetInnerHTML={{ __html: buildEmojiHtml(selectedEmoji) }} />
            </div>
            <ul className={cn(styles.libraryGridBase, styles.emojiGrid)} role="list" style={emojiThumbStyle}>
              {libraryEmojis.map((emoji) => (
                <li key={emoji} className={styles.emojiGridItem}>
                  <button type="button" className={styles.emojiTile} onClick={() => setSelectedEmoji(emoji)} aria-label={`Sélectionner ${emoji}`}>
                    <span className={styles.emojiGlyph} style={{ fontSize: "1.85rem" }}>
                      {emoji}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.inspectorCard}>
              <div className={styles.inspectorCardHeader}>
                <div>
                  <h3 className={styles.inspectorCardTitle}>Sélecteur visuel</h3>
                  <div className={styles.inspectorCardNote}>Insertion directe avec rendu homogène.</div>
                </div>
                <div className={styles.inspectorBadge}>Emoji Picker</div>
              </div>
              <EmojiPicker
                onEmojiClick={(emojiData: EmojiClickData) => setSelectedEmoji(emojiData.emoji)}
                skinTonesDisabled
                searchDisabled={false}
                lazyLoadEmojis
                width="100%"
                height={360}
              />
            </div>
          </div>
        )}

        {activeTab === "layers" && (
          <div className={styles.section}>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Filtrer les calques..." />
            </div>
            <div className={styles.list}>
              {layers.map((layer) => (
                <article key={layer.id} className={styles.rowCard}>
                  <div className={styles.rowHeader}>
                    <div>
                      <h3 className={styles.rowTitle}>{layer.title}</h3>
                      <div className={styles.rowMeta}>{layer.note}</div>
                    </div>
                    <div className={styles.rowBadge}>{layer.visible ? "Visible" : "Hidden"}</div>
                  </div>
                  <div className={styles.rowTag}>{layer.locked ? "Verrouillé" : "Editable"}</div>
                </article>
              ))}
            </div>
            <div className={styles.footerBar}>
              <button className={styles.footerButton} type="button" aria-label="Créer">
                <Plus size={16} />
                <span className="sr-only">Créer</span>
              </button>
              <button className={styles.footerButton} type="button" aria-label="Dupliquer">
                <Copy size={16} />
                <span className="sr-only">Dupliquer</span>
              </button>
              <button className={styles.footerButton} type="button" aria-label="Masquer">
                <EyeOff size={16} />
                <span className="sr-only">Masquer</span>
              </button>
              <button
                className={cn(styles.footerButton, styles.footerButtonDanger)}
                type="button"
                aria-label="Supprimer"
              >
                <Trash2 size={16} />
                <span className="sr-only">Supprimer</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "objects" && (
          <div className={styles.section}>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Filtrer les objets..." />
            </div>
            <div className={styles.list}>
              {objects.map((object) => (
                <article key={object.id} className={styles.rowCard}>
                  <div className={styles.rowHeader}>
                    <div>
                      <h3 className={styles.rowTitle}>{object.title}</h3>
                      <div className={styles.rowMeta}>{object.note}</div>
                    </div>
                    <div className={styles.rowBadge}>{object.badge}</div>
                  </div>
                  <div className={styles.rowTag}>{object.kind}</div>
                </article>
              ))}
            </div>
            <div className={styles.footerBar}>
              <button className={styles.footerButton} type="button" aria-label="Dupliquer">
                <Copy size={16} />
                <span className="sr-only">Dupliquer</span>
              </button>
              <button className={styles.footerButton} type="button" aria-label="Visibilité">
                <Eye size={16} />
                <span className="sr-only">Visibilité</span>
              </button>
              <button className={styles.footerButton} type="button" aria-label="Verrouiller">
                <Lock size={16} />
                <span className="sr-only">Verrouiller</span>
              </button>
              <button
                className={cn(styles.footerButton, styles.footerButtonDanger)}
                type="button"
                aria-label="Supprimer"
              >
                <Trash2 size={16} />
                <span className="sr-only">Supprimer</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "pages" && (
          <div className={styles.section}>
            <div className={styles.searchRow}>
              <Search size={16} />
              <input className={styles.searchInput} defaultValue="" placeholder="Filtrer les pages..." />
            </div>
            <div className={styles.list}>
              {pages.map((page, index) => (
                <article key={page.id} className={styles.pageCard}>
                  <div className={styles.pageHeader}>
                    <div>
                      <h3 className={styles.pageTitle}>{String(index + 1).padStart(2, "0")} {page.title}</h3>
                      <div className={styles.pageMeta}>{page.note}</div>
                    </div>
                    <div className={styles.pageBadge}>{page.status}</div>
                  </div>
                  <div className={styles.rowTag}>{page.size}</div>
                </article>
              ))}
            </div>
            <div className={styles.footerBar}>
              <button className={styles.footerButton} type="button" aria-label="Nouvelle page">
                <Plus size={16} />
                <span className="sr-only">Nouvelle page</span>
              </button>
              <button className={styles.footerButton} type="button" aria-label="Dupliquer">
                <Copy size={16} />
                <span className="sr-only">Dupliquer</span>
              </button>
              <button className={styles.footerButton} type="button" aria-label="Monter">
                <ChevronUp size={16} />
                <span className="sr-only">Monter</span>
              </button>
              <button
                className={cn(styles.footerButton, styles.footerButtonDanger)}
                type="button"
                aria-label="Supprimer"
              >
                <Trash2 size={16} />
                <span className="sr-only">Supprimer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function FloatingPalette({
  activeTool,
  setActiveTool,
}: {
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
}) {
  const [vertical, setVertical] = useState(false);
  const [position, setPosition] = useState({ x: 520, y: 108 });
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    pointerId: number;
  } | null>(null);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const drag = dragState.current;

      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      setPosition({
        x: drag.originX + (event.clientX - drag.startX),
        y: drag.originY + (event.clientY - drag.startY),
      });
    };

    const handleUp = (event: PointerEvent) => {
      const drag = dragState.current;

      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      dragState.current = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, []);

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      pointerId: event.pointerId,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  return (
    <div
      className={cn(styles.floatingPalette, vertical && styles.floatingPaletteVertical)}
      style={{ left: position.x, top: position.y, transform: "none" }}
    >
      <div
        className={cn(styles.paletteHandle, vertical && styles.paletteHandleVertical)}
        aria-hidden="true"
        onPointerDown={startDrag}
      >
        <GripHorizontal size={18} />
      </div>

      <div className={cn(styles.paletteGroup, vertical && styles.paletteGroupVertical)}>
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              type="button"
              className={cn(styles.paletteButton, activeTool === tool.id && styles.paletteButtonActive)}
              aria-label={tool.label}
              title={tool.label}
              onClick={() => setActiveTool(tool.id)}
            >
              <Icon size={17} />
            </button>
          );
        })}
      </div>

      <div className={cn(styles.paletteDivider, vertical && styles.paletteDividerVertical)} />

      <div className={cn(styles.swatchPanel, vertical && styles.swatchPanelVertical)}>
        <div className={styles.swatches} aria-hidden="true">
          <span className={styles.fillSwatch} />
          <span className={styles.strokeSwatch} />
        </div>
        <div className={styles.swatchCopy}>
          <span className={styles.swatchLabel}>Couleurs</span>
          <strong className={styles.swatchValue}>Fill / Stroke</strong>
        </div>
      </div>

      <div className={cn(styles.paletteDivider, vertical && styles.paletteDividerVertical)} />

      <div className={cn(styles.paletteGroup, vertical && styles.paletteGroupVertical)}>
        <button
          type="button"
          className={styles.paletteButton}
          title={vertical ? "Horizontal" : "Vertical"}
          aria-label={vertical ? "Repasser la palette en horizontal" : "Passer la palette en vertical"}
          onClick={() => setVertical((value) => !value)}
        >
          <RotateCw size={17} />
        </button>
        <button
          type="button"
          className={styles.paletteButton}
          title="Réduire"
          aria-label="Réduire la palette"
        >
          <ChevronDown size={17} />
        </button>
      </div>
    </div>
  );
}

function UtilityPalette({
  activePageIndex,
  pagesCount,
  zoom,
  setZoom,
  panEnabled,
  setPanEnabled,
  gridVisible,
  setGridVisible,
  rulersVisible,
  setRulersVisible,
  snapEnabled,
  setSnapEnabled,
  onPrevPage,
  onNextPage,
}: {
  activePageIndex: number;
  pagesCount: number;
  zoom: number;
  setZoom: (value: number) => void;
  panEnabled: boolean;
  setPanEnabled: (value: boolean) => void;
  gridVisible: boolean;
  setGridVisible: (value: boolean) => void;
  rulersVisible: boolean;
  setRulersVisible: (value: boolean) => void;
  snapEnabled: boolean;
  setSnapEnabled: (value: boolean) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}) {
  return (
    <div className={styles.utilityPalette}>
      <div className={styles.utilityHandle} aria-hidden="true">
        <ChevronLeft size={17} />
      </div>

      <div className={styles.utilityGroup}>
        <button type="button" className={styles.utilityButton} title="Page précédente" onClick={onPrevPage}>
          <ArrowLeft size={16} />
        </button>
        <div className={styles.swatchCopy}>
          <span className={styles.swatchLabel}>Page</span>
          <strong className={styles.swatchValue}>{pagesCount ? `${activePageIndex + 1}/${pagesCount}` : "0/0"}</strong>
        </div>
        <button type="button" className={styles.utilityButton} title="Page suivante" onClick={onNextPage}>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className={styles.utilityDivider} />

      <div className={styles.utilityGroup}>
        <button type="button" className={styles.utilityButton} title="Zoom arrière" onClick={() => setZoom(Math.max(30, zoom - 10))}>
          <ZoomOut size={16} />
        </button>
        <div className={styles.swatchCopy}>
          <span className={styles.swatchLabel}>Zoom</span>
          <strong className={styles.swatchValue}>{zoom}%</strong>
        </div>
        <button type="button" className={styles.utilityButton} title="Zoom avant" onClick={() => setZoom(Math.min(160, zoom + 10))}>
          <ZoomIn size={16} />
        </button>
      </div>

      <div className={styles.utilityDivider} />

      <div className={styles.utilityGroup}>
        <button
          type="button"
          className={cn(styles.utilityButton, panEnabled && styles.utilityButtonActive)}
          title="Pan"
          onClick={() => setPanEnabled(!panEnabled)}
        >
          <Hand size={16} />
        </button>
        <button
          type="button"
          className={cn(styles.utilityButton, snapEnabled && styles.utilityButtonActive)}
          title="Snap"
          onClick={() => setSnapEnabled(!snapEnabled)}
        >
          <Magnet size={16} />
        </button>
        <button
          type="button"
          className={cn(styles.utilityButton, gridVisible && styles.utilityButtonActive)}
          title="Grille"
          onClick={() => setGridVisible(!gridVisible)}
        >
          <Grid3X3 size={16} />
        </button>
        <button
          type="button"
          className={cn(styles.utilityButton, rulersVisible && styles.utilityButtonActive)}
          title="Repères"
          onClick={() => setRulersVisible(!rulersVisible)}
        >
          <Ruler size={16} />
        </button>
      </div>
    </div>
  );
}

function InspectorSection({
  title,
  note,
  badge,
  children,
}: {
  title: string;
  note: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.inspectorCard}>
      <div className={styles.inspectorCardHeader}>
        <div>
          <h3 className={styles.inspectorCardTitle}>{title}</h3>
          <div className={styles.inspectorCardNote}>{note}</div>
        </div>
        {badge ? <div className={styles.inspectorBadge}>{badge}</div> : null}
      </div>
      {children}
    </section>
  );
}

function RightInspector({
  selectionType,
  selectedObjectTitle,
  selectedObjectNote,
  sceneSize,
  setSceneSize,
}: {
  selectionType: SelectionType;
  selectedObjectTitle: string;
  selectedObjectNote: string;
  sceneSize: { width: number; height: number };
  setSceneSize: (value: { width: number; height: number }) => void;
}) {
  return (
    <aside className={styles.rightInspector}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleRow}>
          <div>
            <div className={styles.panelKicker}>Volet droit</div>
            <h2 className={styles.panelTitle}>Inspecteur</h2>
          </div>
          <div className={styles.pill}>{selectionType}</div>
        </div>
        <div className={styles.panelMeta}>{selectedObjectTitle}</div>
      </div>

      <div className={styles.inspectorTabs}>
        <button type="button" className={cn(styles.inspectorTabButton, styles.inspectorTabButtonActive)}>
          <span className={styles.inspectorTabLabel}>Propriétés</span>
          <span className={styles.inspectorTabValue}>Contexte actif</span>
        </button>
        <button type="button" className={styles.inspectorTabButton}>
          <span className={styles.inspectorTabLabel}>Document</span>
          <span className={styles.inspectorTabValue}>Scene / page</span>
        </button>
        <button type="button" className={styles.inspectorTabButton}>
          <span className={styles.inspectorTabLabel}>Assets</span>
          <span className={styles.inspectorTabValue}>Ressources</span>
        </button>
      </div>

      <div className={styles.inspectorContent}>
        {selectionType === "image" && (
          <>
            <InspectorSection title="Image Specialist" note="Masques, couleur, contour et crop." badge="Image">
              <div className={styles.chipRow}>
                <button className={cn(styles.chip, styles.chipActive)} type="button">
                  <Circle size={14} />
                  Circulaire
                </button>
                <button className={styles.chip} type="button">
                  <Square size={14} />
                  Carré
                </button>
                <button className={styles.chip} type="button">
                  <Hexagon size={14} />
                  Polygone
                </button>
                <button className={styles.chip} type="button">
                  <Star size={14} />
                  Étoile
                </button>
              </div>
            </InspectorSection>

            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>95%</div>
                <div className={styles.statLabel}>Contraste</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>16px</div>
                <div className={styles.statLabel}>Radius</div>
              </div>
            </div>

            <InspectorSection title="Effets" note="Masque et superpositions." badge="FX">
              <div className={styles.inspectorGrid}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Accent</span>
                  <input className={styles.fieldInput} defaultValue="#f5a623" />
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Contour</span>
                  <input className={styles.fieldInput} defaultValue="2 px" />
                </div>
              </div>
            </InspectorSection>
          </>
        )}

        {selectionType === "multi" && (
          <>
            <InspectorSection title="Multi-selection" note="Alignement et transformation groupés." badge="Multi">
              <div className={styles.chipRow}>
                <button className={styles.chip} type="button">
                  <AlignLeft size={14} />
                  Gauche
                </button>
                <button className={styles.chip} type="button">
                  <AlignCenter size={14} />
                  Centre
                </button>
                <button className={styles.chip} type="button">
                  <AlignRight size={14} />
                  Droite
                </button>
                <button className={styles.chip} type="button">
                  <AlignJustify size={14} />
                  Justifié
                </button>
              </div>
            </InspectorSection>

            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>3</div>
                <div className={styles.statLabel}>Objets sélectionnés</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>42 px</div>
                <div className={styles.statLabel}>Espacement moyen</div>
              </div>
            </div>

            <InspectorSection title="Ordre" note="Z-order et verrouillage." badge="Stack">
              <div className={styles.chipRow}>
                <button className={styles.chip} type="button">
                  <MoveVertical size={14} />
                  Monter
                </button>
                <button className={styles.chip} type="button">
                  <ArrowUpDown size={14} />
                  Distribuer
                </button>
                <button className={styles.chip} type="button">
                  <Lock size={14} />
                  Verrouiller
                </button>
                <button className={styles.chip} type="button">
                  <Copy size={14} />
                  Grouper
                </button>
              </div>
            </InspectorSection>
          </>
        )}

        {selectionType === "scene" && (
          <>
            <InspectorSection title="Scene settings" note="Surface générique, sans contrainte A4." badge="Scene">
              <div className={styles.inspectorGrid}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Largeur</span>
                  <input
                    className={styles.fieldInput}
                    type="number"
                    value={sceneSize.width}
                    onChange={(event) =>
                      setSceneSize({
                        width: Number(event.target.value || 0),
                        height: sceneSize.height,
                      })
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Hauteur</span>
                  <input
                    className={styles.fieldInput}
                    type="number"
                    value={sceneSize.height}
                    onChange={(event) =>
                      setSceneSize({
                        width: sceneSize.width,
                        height: Number(event.target.value || 0),
                      })
                    }
                  />
                </label>
              </div>
            </InspectorSection>

            <InspectorSection title="Grille & marges" note="Aide au placement et export." badge="Grid">
              <div className={styles.chipRow}>
                <span className={styles.chip}>
                  <Grid3X3 size={14} />
                  32 px
                </span>
                <span className={styles.chip}>
                  <Ruler size={14} />
                  Repères
                </span>
                <span className={styles.chip}>
                  <Magnet size={14} />
                  Snap
                </span>
              </div>
            </InspectorSection>

            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{makeSceneSizeLabel(sceneSize.width, sceneSize.height)}</div>
                <div className={styles.statLabel}>Scene active</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>Free</div>
                <div className={styles.statLabel}>Mode de surface</div>
              </div>
            </div>
          </>
        )}

        {selectionType === "richText" && (
          <>
            <InspectorSection title="Typography engine" note="Texte riche et variables inline." badge="Text">
              <div className={styles.chipRow}>
                <button className={cn(styles.chip, styles.chipActive)} type="button">
                  <Bold size={14} />
                  Bold
                </button>
                <button className={styles.chip} type="button">
                  <Italic size={14} />
                  Italic
                </button>
                <button className={styles.chip} type="button">
                  <Underline size={14} />
                  Underline
                </button>
              </div>
            </InspectorSection>

            <InspectorSection title="Alignment & flow" note="Bloc, flux et mapping." badge="Flow">
              <div className={styles.chipRow}>
                <button className={styles.chip} type="button">
                  <AlignLeft size={14} />
                  Left
                </button>
                <button className={styles.chip} type="button">
                  <AlignCenter size={14} />
                  Center
                </button>
                <button className={styles.chip} type="button">
                  <AlignRight size={14} />
                  Right
                </button>
                <button className={styles.chip} type="button">
                  <Table2 size={14} />
                  Table
                </button>
              </div>
            </InspectorSection>

            <InspectorSection title="Variable mapping" note="Injection de données et fallback." badge="Vars">
              <div className={styles.list}>
                <div className={styles.rowCard}>
                  <div className={styles.rowHeader}>
                    <div>
                      <h3 className={styles.rowTitle}>user.first_name</h3>
                      <div className={styles.rowMeta}>Prénom du profil courant</div>
                    </div>
                    <div className={styles.rowBadge}>Bind</div>
                  </div>
                </div>
                <div className={styles.rowCard}>
                  <div className={styles.rowHeader}>
                    <div>
                      <h3 className={styles.rowTitle}>current_date</h3>
                      <div className={styles.rowMeta}>Date d’export dynamique</div>
                    </div>
                    <div className={styles.rowBadge}>Bind</div>
                  </div>
                </div>
              </div>
            </InspectorSection>
          </>
        )}

        <InspectorSection title="Current selection" note={selectedObjectNote} badge="Focus">
          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{selectedObjectTitle}</div>
              <div className={styles.statLabel}>Objet actif</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{selectionType}</div>
              <div className={styles.statLabel}>Type de sélection</div>
            </div>
          </div>
        </InspectorSection>
      </div>
    </aside>
  );
}

export function CanevaEditor() {
  const svgPreviewRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTab, setActiveTab] = useState<LeftTabId>("variables");
  const [activeSubTab, setActiveSubTab] = useState<LeftSubTabId>("variables");
  const [activeTool, setActiveTool] = useState<ToolId>("select");
  const [selectionType, setSelectionType] = useState<SelectionType>("scene");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("metrics");
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [panEnabled, setPanEnabled] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [rulersVisible, setRulersVisible] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [sceneSize, setSceneSize] = useState({ width: 1360, height: 860 });
  const [selectedEmoji, setSelectedEmoji] = useState("✨");
  const [libraryViewModes, setLibraryViewModes] = useState<Record<LibrarySubTabId, LibraryViewMode>>({
    images: "grid",
    graphics: "grid",
    icons: "list",
    emoji: "grid",
  });

  useEffect(() => {
    if (activeTab === "variables" && activeSubTab !== "variables" && activeSubTab !== "presets") {
      setActiveSubTab("variables");
    }
    if (activeTab === "libraries" && !["images", "graphics", "icons", "emoji"].includes(activeSubTab)) {
      setActiveSubTab("images");
    }
  }, [activeSubTab, activeTab]);

  useEffect(() => {
    if (activeTool === "multi") {
      setSelectionType("multi");
      setSelectedNodeId(null);
    }
    if (activeTool === "select" && !selectedNodeId) {
      setSelectionType("scene");
    }
  }, [activeTool, selectedNodeId]);

  useEffect(() => {
    if (activeTab !== "libraries" || activeSubTab !== "graphics") {
      return;
    }

    const canvas = svgPreviewRef.current;
    if (!canvas) {
      return;
    }

    let cancelled = false;

    const renderPreview = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const svg = buildSvgMarkup();
      const canvg = await Canvg.fromString(ctx, svg, {
        ignoreMouse: true,
        ignoreAnimation: true,
      });

      if (!cancelled) {
        await canvg.render();
      }
    };

    void renderPreview();

    return () => {
      cancelled = true;
    };
  }, [activeSubTab, activeTab]);

  const parsedEmoji = useMemo(() => buildEmojiHtml(selectedEmoji), [selectedEmoji]);
  const activePage = pages[activePageIndex] ?? pages[0];
  const selectedNodeKey = selectedNodeId ?? defaultNodeBySelectionType[selectionType];
  const selectedNode = canvasNodes.find((node) => node.id === selectedNodeKey) ?? null;
  const displayedSelectionType = selectionType === "scene" && selectedNode ? selectedNode.kind : selectionType;
  const sceneScale = useMemo(() => {
    const fitWidth = 1120 / sceneSize.width;
    const fitHeight = 740 / sceneSize.height;
    return Math.min(1, fitWidth, fitHeight);
  }, [sceneSize.height, sceneSize.width]);

  const movePage = (offset: number) => {
    setActivePageIndex((current) => {
      const next = (current + offset + pages.length) % pages.length;
      return next;
    });
  };

  const selectedObjectTitle = selectedNode ? selectedNode.title : activePage.title;
  const selectedObjectNote = selectedNode ? selectedNode.note : activePage.note;

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <div className={styles.brandBlock}>
          <div className={styles.brandMark}>CNV</div>
          <div className={styles.brandCopy}>
            <div className={styles.brandName}>Caneva Editor</div>
            <div className={styles.brandMeta}>Scene / objects / layers workspace</div>
          </div>
        </div>

        <nav className={styles.topNav} aria-label="Main sections">
          {["Scene", "Layers", "Assets", "History"].map((item, index) => (
            <button
              key={item}
              type="button"
              className={cn(styles.topNavButton, index === 0 && styles.topNavButtonActive)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className={styles.topActions}>
          <button type="button" className={styles.ghostButton}>
            <PanelRight size={16} />
            Preview
          </button>
          <button type="button" className={styles.primaryButton}>
            Export
          </button>
          <button type="button" className={styles.avatarButton} aria-label="Profile">
            <div className={styles.avatarFallback}>KM</div>
          </button>
        </div>
      </header>

      <main className={styles.workspace}>
        <LeftSidebar
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveTab={setActiveTab}
          setActiveSubTab={setActiveSubTab}
          svgPreviewRef={svgPreviewRef}
          selectedEmoji={selectedEmoji}
          setSelectedEmoji={setSelectedEmoji}
          libraryViewModes={libraryViewModes}
          setLibraryViewMode={(tab, mode) =>
            setLibraryViewModes((current) => ({ ...current, [tab]: mode }))
          }
        />

        <section className={styles.canvasArea}>
          {rulersVisible ? (
            <>
              <div className={styles.rulerTop} />
              <div className={styles.rulerLeft} />
            </>
          ) : null}

          <div className={styles.canvasInset}>
            <div className={styles.stage}>
              <div
                className={styles.sceneWrap}
                style={{
                  width: sceneSize.width,
                  height: sceneSize.height,
                  transform: `scale(${sceneScale})`,
                }}
              >
                <div
                  className={cn(styles.sceneFrame, gridVisible ? styles.sceneGridVisible : styles.sceneGridHidden)}
                  style={{ width: sceneSize.width, height: sceneSize.height }}
                >
                  <div className={styles.sceneHeader}>
                    <span className={styles.sceneHeaderStrong}>{activePage.title}</span>
                    <span>•</span>
                    <span>{makeSceneSizeLabel(sceneSize.width, sceneSize.height)}</span>
                  </div>

                  <div className={styles.canvasFloatingBadge}>
                    {panEnabled ? "Pan actif" : activeTool.toUpperCase()}
                  </div>

                  {canvasNodes.map((node) => {
                    const selected = selectedNodeId === node.id || (selectionType !== "multi" && !selectedNodeId && node.kind === displayedSelectionType);

                    return (
                      <button
                        key={node.id}
                        type="button"
                        className={cn(styles.canvasNode, selected && styles.canvasNodeSelected)}
                        style={{
                          left: node.x,
                          top: node.y,
                          width: node.width,
                          height: node.height,
                        }}
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          setSelectionType(node.kind);
                          setActiveTool("select");
                        }}
                      >
                        <span className={styles.canvasNodeBadge}>
                          {node.kind === "richText" ? "Text" : node.kind}
                        </span>
                        <h3 className={styles.canvasNodeTitle}>{node.title}</h3>
                        <p className={styles.canvasNodeText}>{node.note}</p>
                        {selected ? (
                          <span className={styles.nodeHandles} aria-hidden="true">
                            <span className={cn(styles.nodeHandle, styles.nodeHandleTopLeft)} />
                            <span className={cn(styles.nodeHandle, styles.nodeHandleTopRight)} />
                            <span className={cn(styles.nodeHandle, styles.nodeHandleBottomLeft)} />
                            <span className={cn(styles.nodeHandle, styles.nodeHandleBottomRight)} />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}

                  <div className={styles.canvasLabel}>
                    <span className={styles.canvasLabelStrong}>Workspace</span>
                    <span>Scene générique</span>
                  </div>
                  <div className={styles.canvasFooter}>
                    <span>{zoom}%</span>
                    <span>•</span>
                    <span>{snapEnabled ? "Snap on" : "Snap off"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FloatingPalette activeTool={activeTool} setActiveTool={setActiveTool} />

          <UtilityPalette
            activePageIndex={activePageIndex}
            pagesCount={pages.length}
            zoom={zoom}
            setZoom={setZoom}
            panEnabled={panEnabled}
            setPanEnabled={setPanEnabled}
            gridVisible={gridVisible}
            setGridVisible={setGridVisible}
            rulersVisible={rulersVisible}
            setRulersVisible={setRulersVisible}
            snapEnabled={snapEnabled}
            setSnapEnabled={setSnapEnabled}
            onPrevPage={() => movePage(-1)}
            onNextPage={() => movePage(1)}
          />
        </section>

        <RightInspector
          selectionType={displayedSelectionType}
          selectedObjectTitle={selectedObjectTitle}
          selectedObjectNote={selectedObjectNote}
          sceneSize={sceneSize}
          setSceneSize={setSceneSize}
        />
      </main>

      <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: parsedEmoji }} />
    </div>
  );
}
