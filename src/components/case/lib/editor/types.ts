export type EditorTheme = 'light' | 'dark' | 'system';

export type EditorThemeConfig = EditorTheme | (() => EditorTheme);

export type EditorShellConfig = {
  licenseKey: string;
  baseUrl: string;
};

export type EditorRuntimeConfig = {
  licenseKey: string;
  baseURL: string;
};

export type EditorScale = 'normal' | 'large' | 'modern';

export type EditorScaleConfig =
  | EditorScale
  | ((context: {
      containerWidth?: number;
      isTouch?: boolean;
    }) => EditorScale);

export type EditorView = 'default' | 'advanced';

export type EditorPanelPosition = 'left' | 'right';

export type EditorSceneMode = 'Design';

export interface EditorScenePageSpec {
  [key: string]: unknown;
}

export type EditorSceneCreateOptions =
  | {
      mode?: EditorSceneMode;
      layout?: string;
      page?: EditorScenePageSpec;
      pageCount?: number;
      pages?: never;
    }
  | {
      mode?: EditorSceneMode;
      layout?: string;
      page?: never;
      pageCount?: never;
      pages: readonly EditorScenePageSpec[];
    };

export interface EditorSceneLoadOptions {
  overrideEditorConfig?: boolean;
}

export interface EditorExportOptions {
  mimeType?: string;
  targetWidth?: number;
  targetHeight?: number;
  jpegQuality?: number;
  pngCompressionLevel?: number;
}

export interface EditorExportResult {
  blobs: Blob[];
  options: EditorExportOptions;
}

export interface EditorFeatureOptions {
  featureIds: string | readonly string[];
}

export interface EditorPanelOptions {
  position?: EditorPanelPosition;
  floating?: boolean;
}

export type EditorTranslations = Partial<
  Record<string, Partial<Record<string, string>>>
>;

export interface EditorAssetDefinition {
  id: string;
  label?: string | Partial<Record<string, string>>;
  groups?: readonly string[];
  tags?: Record<string, string | number | boolean>;
  meta?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface EditorAssetSourceDefinition {
  id: string;
  assets?: readonly EditorAssetDefinition[];
  onSelectAsset?: (asset: EditorAssetDefinition) => void | Promise<void>;
}

export interface EditorAssetLibraryEntry {
  sourceIds?:
    | readonly string[]
    | ((context: { currentIds: readonly string[] }) => readonly string[]);
  title?: string;
  icon?: { name: string } | { svg: string };
  previewBackgroundType?: 'contain' | 'cover';
  cardLabel?:
    | string
    | ((asset: EditorAssetDefinition) => string | undefined | null);
  cardLabelPosition?: 'below' | 'overlay';
  promptBeforeApply?: boolean;
}

export type EditorSettingKey = string;

export type EditorSettingValue = unknown;

export type EditorSettingEntry = {
  key: EditorSettingKey;
  value: EditorSettingValue;
};

export type EditorManifestSemanticId = string;

export type EditorUiOrderItem = string | { id: string; children: readonly string[] };

export type EditorPanelPlacement = {
  id: string;
  position: 'left' | 'right';
  floating: boolean;
};

export type EditorAssetLibraryManifestEntry = {
  id: string;
  key: string;
  icon: string;
  label: string;
  entries: readonly string[];
};

export type EditorUiSurfaces = {
  navigationBar: string;
  dock: string;
  canvasBar: string;
  canvasMenu: string;
  inspectorBar: string;
  assetLibraryDock: string;
};

export type EditorManifestSpecOrderItem =
  | EditorManifestSemanticId
  | {
      id: EditorManifestSemanticId;
      children: readonly EditorManifestSemanticId[];
    };

export type EditorManifestSpecSurfaceIds = {
  navigationBar: EditorManifestSemanticId;
  dock: EditorManifestSemanticId;
  canvasBar: EditorManifestSemanticId;
  canvasMenu: EditorManifestSemanticId;
  inspectorBar: EditorManifestSemanticId;
  assetLibraryDock: EditorManifestSemanticId;
};

export type EditorManifestSpecAssetLibraryEntry = {
  id: EditorManifestSemanticId;
  key: EditorManifestSemanticId;
  icon: string;
  label: EditorManifestSemanticId;
  entries: readonly EditorManifestSemanticId[];
};

export type EditorManifestSpecSettingEntry = {
  key: EditorManifestSemanticId;
  value: EditorSettingValue;
};

export type EditorManifestSpecPanelPlacement = {
  id: EditorManifestSemanticId;
  position: EditorPanelPosition;
  floating: boolean;
};

export type EditorManifestSpec = {
  ui: {
    surfaces: EditorManifestSpecSurfaceIds;
    navigation: {
      order: readonly EditorManifestSpecOrderItem[];
    };
    dock: {
      customEntries: readonly EditorManifestSemanticId[];
    };
    canvas: {
      barPosition: 'top' | 'bottom';
      barOrder: readonly EditorManifestSpecOrderItem[];
      transformMenuOrder: readonly EditorManifestSpecOrderItem[];
      textMenuOrder: readonly EditorManifestSpecOrderItem[];
    };
    inspector: {
      transformBarOrder: readonly EditorManifestSpecOrderItem[];
      textBarOrder: readonly EditorManifestSpecOrderItem[];
      trimBarOrder: readonly EditorManifestSpecOrderItem[];
      cropBarOrder: readonly EditorManifestSpecOrderItem[];
    };
    panels: {
      placements: readonly EditorManifestSpecPanelPlacement[];
    };
  };
  content: {
    assets: {
      libraries: readonly EditorManifestSpecAssetLibraryEntry[];
    };
  };
  behavior: {
    features: {
      enabled: readonly EditorManifestSemanticId[];
    };
    settings: {
      values: readonly EditorManifestSpecSettingEntry[];
    };
    translations: {
      en: Record<EditorManifestSemanticId, string>;
    };
  };
};

export type EditorResolvedManifest = {
  ui: {
    surfaces: EditorUiSurfaces;
    navigation: {
      order: readonly EditorUiOrderItem[];
    };
    dock: {
      customEntries: readonly string[];
    };
    canvas: {
      barPosition: 'top' | 'bottom';
      barOrder: readonly EditorUiOrderItem[];
      transformMenuOrder: readonly EditorUiOrderItem[];
      textMenuOrder: readonly EditorUiOrderItem[];
    };
    inspector: {
      transformBarOrder: readonly EditorUiOrderItem[];
      textBarOrder: readonly EditorUiOrderItem[];
      trimBarOrder: readonly EditorUiOrderItem[];
      cropBarOrder: readonly EditorUiOrderItem[];
    };
    panels: {
      placements: readonly EditorPanelPlacement[];
    };
  };
  content: {
    assets: {
      libraries: readonly EditorAssetLibraryManifestEntry[];
    };
  };
  behavior: {
    features: {
      enabled: readonly string[];
    };
    settings: {
      values: readonly EditorSettingEntry[];
    };
    translations: {
      en: Record<string, string>;
    };
  };
};

/**
 * Public editor manifest contract.
 *
 * This is intentionally the semantic, data-first shape. Callers should treat
 * it as the source of truth and only resolve it at the adapter boundary.
 */
export type EditorManifest = EditorManifestSpec;

/**
 * Backward-compatible alias for the semantic manifest contract.
 */
export type EditorSemanticManifest = EditorManifestSpec;

export type EditorResolvedAssetLibrary = EditorAssetLibraryManifestEntry;
export type EditorResolvedComponentOrderItem = EditorUiOrderItem;

export interface EditorBootstrapOptions {
  container: HTMLDivElement | string;
  config?: Record<string, unknown>;
}

export interface EditorShell {
  readonly ready: Promise<void>;
  addPlugin(plugin: unknown): Promise<unknown>;
  hasAssetSource(sourceId: string): boolean;

  createScene(options?: EditorSceneCreateOptions): Promise<void>;
  saveScene(): Promise<string>;
  saveArchive(): Promise<Blob>;
  loadScene(scene: string, options?: EditorSceneLoadOptions): Promise<void>;
  loadSceneFromURL(url: string, options?: EditorSceneLoadOptions): Promise<void>;
  loadArchiveFromURL(url: string, options?: EditorSceneLoadOptions): Promise<void>;
  exportDesign(options?: EditorExportOptions): Promise<EditorExportResult>;
  focusPage(page: 'first' | 'current'): Promise<void>;
  uploadFile(
    file: File,
    context?: string | { sourceId: string; group?: string }
  ): Promise<import('@cesdk/engine').AssetDefinition>;

  getTheme(): EditorTheme;
  setTheme(theme: EditorThemeConfig): void;
  getScale(): EditorScale;
  setScale(scale: EditorScaleConfig): void;
  getView(): EditorView;
  setView(view: EditorView): void;

  enableFeatures(featureIds: string | readonly string[]): void;
  disableFeatures(featureIds: string | readonly string[]): void;
  setFeatureEnabled(featureId: string, enabled: boolean): void;

  openPanel(panelId: string, options?: EditorPanelOptions): void;
  closePanel(panelId: string): void;
  isPanelOpen(panelId: string): boolean;
  setPanelPosition(panelId: string, position: EditorPanelPosition): void;
  setPanelFloating(panelId: string, floating: boolean): void;

  setTranslations(translations: EditorTranslations): void;

  addLocalAssetSource(source: EditorAssetSourceDefinition): void;
  addAssetToSource(sourceId: string, asset: EditorAssetDefinition): void;
  updateAssetLibraryEntry(
    id: string,
    assetLibraryEntry: Partial<EditorAssetLibraryEntry> | ((
      entry: EditorAssetLibraryEntry | undefined
    ) => Partial<EditorAssetLibraryEntry>)
  ): void;

  dispose(): void;
}
