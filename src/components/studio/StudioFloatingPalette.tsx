"use client";

import { useState } from "react";
import {
  Circle,
  ChevronDown,
  Eraser,
  GripHorizontal,
  Image as ImageIcon,
  LineSquiggle,
  MousePointer2,
  Paintbrush,
  Pencil,
  Pipette,
  RectangleHorizontal,
  RotateCw,
  Shapes,
  SquareDashedMousePointer,
  Star,
  Type,
  type LucideIcon,
} from "lucide-react";

import { useStudioShellStore } from "./store/studioShellStore";
import type { StudioToolId } from "./store/studioShellTypes";
import styles from "./StudioFloatingPalette.module.css";

type PaletteButton = {
  id: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
};

function buildButton(
  id: string,
  label: string,
  icon: LucideIcon,
  active: boolean,
  onClick: () => void,
): PaletteButton {
  return { id, label, icon, active, onClick };
}

export function StudioFloatingPalette() {
  const activeTool = useStudioShellStore((state) => state.activeTool);
  const setActiveTool = useStudioShellStore((state) => state.setActiveTool);
  const setActiveTab = useStudioShellStore((state) => state.setActiveTab);
  const [collapsed, setCollapsed] = useState(false);
  const [vertical, setVertical] = useState(false);

  const selectTool = (tool: StudioToolId) => {
    setActiveTool(tool);
  };

  const selectionButtons = [
    buildButton("select", "Pointer (V)", MousePointer2, activeTool === "select", () =>
      selectTool("select"),
    ),
    buildButton(
      "multi",
      "Multi-select (M)",
      SquareDashedMousePointer,
      activeTool === "multi",
      () => selectTool("multi"),
    ),
  ];

  const drawingButtons = [
    buildButton("brush", "Pen Tool (P)", Paintbrush, activeTool === "brush", () =>
      selectTool("brush"),
    ),
    buildButton("pencil", "Pencil (B)", Pencil, false, () => selectTool("brush")),
    buildButton("line", "Line (L)", LineSquiggle, activeTool === "line", () =>
      selectTool("line"),
    ),
    buildButton("curve", "Curve", LineSquiggle, false, () => selectTool("brush")),
  ];

  const shapeButtons = [
    buildButton("rectangle", "Rectangle (R)", RectangleHorizontal, activeTool === "rectangle", () =>
      selectTool("rectangle"),
    ),
    buildButton("circle", "Circle (O)", Circle, activeTool === "circle", () =>
      selectTool("circle"),
    ),
    buildButton("polygon", "Polygon", Shapes, activeTool === "polygon", () =>
      selectTool("polygon"),
    ),
    buildButton("star", "Star", Star, false, () => selectTool("polygon")),
  ];

  const contentButtons = [
    buildButton("text", "Text (T)", Type, activeTool === "text", () => selectTool("text")),
    buildButton("image", "Image (I)", ImageIcon, false, () => {
      setActiveTab("resources");
      selectTool("select");
    }),
    buildButton("eyedropper", "Eyedropper (I)", Pipette, false, () => selectTool("select")),
    buildButton("eraser", "Eraser (E)", Eraser, false, () => selectTool("select")),
  ];

  return (
    <div
      className={[
        styles.palette,
        collapsed ? styles.paletteCollapsed : "",
        vertical ? styles.paletteVertical : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.handle} aria-hidden="true">
        <GripHorizontal size={18} />
      </div>

      {!collapsed ? (
        <>
          <div className={`${styles.section} ${vertical ? styles.sectionVertical : ""}`}>
            {selectionButtons.map((button) => {
              const Icon = button.icon;

              return (
                <button
                  key={button.id}
                  type="button"
                  className={`${styles.button} ${styles.buttonCompact} ${
                    button.active ? styles.buttonActive : ""
                  }`}
                  title={button.label}
                  aria-label={button.label}
                  aria-pressed={button.active}
                  onClick={button.onClick}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>

          <div className={`${styles.divider} ${vertical ? styles.dividerVertical : ""}`} />

          <div className={`${styles.section} ${vertical ? styles.sectionVertical : ""}`}>
            {drawingButtons.map((button) => {
              const Icon = button.icon;

              return (
                <button
                  key={button.id}
                  type="button"
                  className={`${styles.button} ${styles.buttonCompact} ${
                    button.active ? styles.buttonActive : ""
                  }`}
                  title={button.label}
                  aria-label={button.label}
                  aria-pressed={button.active}
                  onClick={button.onClick}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>

          <div className={`${styles.divider} ${vertical ? styles.dividerVertical : ""}`} />

          <div className={`${styles.section} ${vertical ? styles.sectionVertical : ""}`}>
            {shapeButtons.map((button) => {
              const Icon = button.icon;

              return (
                <button
                  key={button.id}
                  type="button"
                  className={`${styles.button} ${styles.buttonCompact} ${
                    button.active ? styles.buttonActive : ""
                  }`}
                  title={button.label}
                  aria-label={button.label}
                  aria-pressed={button.active}
                  onClick={button.onClick}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>

          <div className={`${styles.divider} ${vertical ? styles.dividerVertical : ""}`} />

          <div className={`${styles.section} ${vertical ? styles.sectionVertical : ""}`}>
            {contentButtons.map((button) => {
              const Icon = button.icon;

              return (
                <button
                  key={button.id}
                  type="button"
                  className={`${styles.button} ${styles.buttonCompact} ${
                    button.active ? styles.buttonActive : ""
                  }`}
                  title={button.label}
                  aria-label={button.label}
                  aria-pressed={button.active}
                  onClick={button.onClick}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>

          <div className={`${styles.divider} ${vertical ? styles.dividerVertical : ""}`} />

          <div className={styles.swatchGroup}>
            <div className={styles.swatchStack} aria-label="Couleurs de trait et de remplissage">
              <div className={styles.fillSwatch} title="Fill Color" />
              <div className={styles.strokeSwatch} title="Stroke Color" />
            </div>
            <div className={styles.label}>
              <span>Fill / Stroke</span>
              <strong>Palette active</strong>
            </div>
          </div>
        </>
      ) : null}

      <div className={`${styles.divider} ${vertical ? styles.dividerVertical : ""}`} />

      <div className={`${styles.section} ${vertical ? styles.sectionVertical : ""}`}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonCompact}`}
          title="Orientation"
          aria-label="Changer l'orientation de la palette"
          onClick={() => setVertical((value) => !value)}
        >
          <RotateCw size={18} />
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonCompact}`}
          title={collapsed ? "Déplier" : "Collapse"}
          aria-label={collapsed ? "Déplier la palette" : "Réduire la palette"}
          onClick={() => setCollapsed((value) => !value)}
        >
          <ChevronDown size={18} style={{ transform: collapsed ? "rotate(180deg)" : "none" }} />
        </button>
      </div>
    </div>
  );
}
