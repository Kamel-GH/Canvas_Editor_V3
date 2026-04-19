import { create } from "zustand";

import { STUDIO_INITIAL_PAGE_ID } from "../model/studioDocumentTypes";
import type {
  StudioContextMenuState,
  StudioLeftTabId,
  StudioToolId,
} from "./studioShellTypes";

type StudioShellState = {
  activeTool: StudioToolId;
  activeTab: StudioLeftTabId;
  activePageId: string;
  selectedObjectId: string | null;
  zoom: number;
  panMode: boolean;
  gridVisible: boolean;
  rulersVisible: boolean;
  snapEnabled: boolean;
  gridSize: number;
  contextMenu: StudioContextMenuState | null;
  setActiveTool: (tool: StudioToolId) => void;
  setActiveTab: (tab: StudioLeftTabId) => void;
  setActivePageId: (pageId: string) => void;
  setSelectedObjectId: (objectId: string | null) => void;
  setZoom: (zoom: number) => void;
  zoomBy: (delta: number) => void;
  setPanMode: (enabled: boolean) => void;
  togglePanMode: () => void;
  setGridVisible: (enabled: boolean) => void;
  toggleGridVisible: () => void;
  setRulersVisible: (enabled: boolean) => void;
  toggleRulersVisible: () => void;
  setSnapEnabled: (enabled: boolean) => void;
  toggleSnapEnabled: () => void;
  openContextMenu: (menu: StudioContextMenuState) => void;
  closeContextMenu: () => void;
};

const MIN_ZOOM = 30;
const MAX_ZOOM = 160;

export const useStudioShellStore = create<StudioShellState>()((set, get) => ({
  activeTool: "select",
  activeTab: "resources",
  activePageId: STUDIO_INITIAL_PAGE_ID,
  selectedObjectId: null,
  zoom: 85,
  panMode: false,
  gridVisible: true,
  rulersVisible: true,
  snapEnabled: true,
  gridSize: 38,
  contextMenu: null,
  setActiveTool: (tool) =>
    set({
      activeTool: tool,
      panMode: tool === "pan",
    }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActivePageId: (pageId) => set({ activePageId: pageId }),
  setSelectedObjectId: (objectId) => set({ selectedObjectId: objectId }),
  setZoom: (zoom) =>
    set({
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)),
    }),
  zoomBy: (delta) =>
    set({
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, get().zoom + delta)),
    }),
  setPanMode: (enabled) =>
    set({
      panMode: enabled,
      activeTool: enabled ? "pan" : get().activeTool === "pan" ? "select" : get().activeTool,
    }),
  togglePanMode: () =>
    set((state) => {
      const nextPanMode = !state.panMode;

      return {
        panMode: nextPanMode,
        activeTool: nextPanMode
          ? "pan"
          : state.activeTool === "pan"
            ? "select"
          : state.activeTool,
      };
    }),
  setGridVisible: (enabled) => set({ gridVisible: enabled }),
  toggleGridVisible: () => set((state) => ({ gridVisible: !state.gridVisible })),
  setRulersVisible: (enabled) => set({ rulersVisible: enabled }),
  toggleRulersVisible: () => set((state) => ({ rulersVisible: !state.rulersVisible })),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  toggleSnapEnabled: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
  openContextMenu: (menu) => set({ contextMenu: menu }),
  closeContextMenu: () => set({ contextMenu: null }),
}));
