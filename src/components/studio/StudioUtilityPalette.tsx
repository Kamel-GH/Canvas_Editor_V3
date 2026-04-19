"use client";

import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  GripHorizontal,
  Grid3X3,
  Hand,
  Magnet,
  Ruler,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { useStudioDocumentStore } from "./model/studioDocumentStore";
import { useStudioShellStore } from "./store/studioShellStore";
import styles from "./StudioUtilityPalette.module.css";

export function StudioUtilityPalette() {
  const pages = useStudioDocumentStore((state) => state.document.pages);
  const activePageId = useStudioShellStore((state) => state.activePageId);
  const selectedObjectId = useStudioShellStore((state) => state.selectedObjectId);
  const zoom = useStudioShellStore((state) => state.zoom);
  const panMode = useStudioShellStore((state) => state.panMode);
  const gridVisible = useStudioShellStore((state) => state.gridVisible);
  const rulersVisible = useStudioShellStore((state) => state.rulersVisible);
  const snapEnabled = useStudioShellStore((state) => state.snapEnabled);
  const setActivePageId = useStudioShellStore((state) => state.setActivePageId);
  const setSelectedObjectId = useStudioShellStore((state) => state.setSelectedObjectId);
  const closeContextMenu = useStudioShellStore((state) => state.closeContextMenu);
  const zoomBy = useStudioShellStore((state) => state.zoomBy);
  const togglePanMode = useStudioShellStore((state) => state.togglePanMode);
  const toggleGridVisible = useStudioShellStore((state) => state.toggleGridVisible);
  const toggleRulersVisible = useStudioShellStore((state) => state.toggleRulersVisible);
  const toggleSnapEnabled = useStudioShellStore((state) => state.toggleSnapEnabled);

  const orderedPages = useMemo(
    () => [...pages].sort((left, right) => left.order - right.order),
    [pages],
  );

  const activePageIndex = useMemo(
    () => orderedPages.findIndex((page) => page.id === activePageId),
    [activePageId, orderedPages],
  );

  const currentIndex = activePageIndex >= 0 ? activePageIndex : 0;
  const activePage = orderedPages[currentIndex];
  const pageLabel = orderedPages.length ? `${currentIndex + 1}/${orderedPages.length}` : "0/0";

  const goToPageOffset = (offset: number) => {
    if (!orderedPages.length) {
      return;
    }

    const currentIndex = activePageIndex >= 0 ? activePageIndex : 0;
    const nextIndex = (currentIndex + offset + orderedPages.length) % orderedPages.length;
    setActivePageId(orderedPages[nextIndex].id);
    setSelectedObjectId(null);
    closeContextMenu();
  };

  return (
    <div className={styles.palette}>
      <div className={styles.handle} aria-hidden="true">
        <GripHorizontal size={18} />
      </div>

      <div className={styles.segment}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Page précédente"
          onClick={() => goToPageOffset(-1)}
          disabled={!orderedPages.length}
          title="Page précédente"
        >
          <ArrowLeft size={16} />
        </button>
        <div className={styles.pageMeta}>
          <span>Page</span>
          <strong>{pageLabel}</strong>
        </div>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Page suivante"
          onClick={() => goToPageOffset(1)}
          disabled={!orderedPages.length}
          title="Page suivante"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.segment}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Zoom arrière"
          onClick={() => zoomBy(-10)}
          title="Zoom arrière"
        >
          <ZoomOut size={16} />
        </button>
        <div className={styles.zoomReadout}>{zoom}%</div>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Zoom avant"
          onClick={() => zoomBy(10)}
          title="Zoom avant"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.segment}>
        <button
          type="button"
          className={`${styles.iconButton} ${panMode ? styles.iconButtonActive : ""}`}
          aria-label="Activer le déplacement"
          aria-pressed={panMode}
          onClick={() => togglePanMode()}
          title="Déplacement"
        >
          <Hand size={16} />
        </button>
        <button
          type="button"
          className={`${styles.iconButton} ${snapEnabled ? styles.iconButtonActive : ""}`}
          aria-label="Activer l'accrochage"
          aria-pressed={snapEnabled}
          onClick={() => toggleSnapEnabled()}
          title="Snap"
        >
          <Magnet size={16} />
        </button>
        <button
          type="button"
          className={`${styles.iconButton} ${gridVisible ? styles.iconButtonActive : ""}`}
          aria-label="Afficher la grille"
          aria-pressed={gridVisible}
          onClick={() => toggleGridVisible()}
          title="Grille"
        >
          <Grid3X3 size={16} />
        </button>
        <button
          type="button"
          className={`${styles.iconButton} ${rulersVisible ? styles.iconButtonActive : ""}`}
          aria-label="Afficher les repères"
          aria-pressed={rulersVisible}
          onClick={() => toggleRulersVisible()}
          title="Repères"
        >
          <Ruler size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.stateMeta}>
        <span>{selectedObjectId ? "1 sélection" : "Aucune sélection"}</span>
        <strong>{activePage ? activePage.name : "Aucune page"}</strong>
      </div>
    </div>
  );
}
