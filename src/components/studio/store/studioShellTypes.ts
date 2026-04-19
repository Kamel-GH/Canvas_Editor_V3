export type StudioToolId =
  | "select"
  | "multi"
  | "pan"
  | "zoom"
  | "brush"
  | "polygon"
  | "circle"
  | "rectangle"
  | "line"
  | "text";

export type StudioLeftTabId = "resources" | "pages" | "objects" | "layers";

export type StudioContextMenuState = {
  x: number;
  y: number;
  targetId: string | null;
  targetName: string;
  targetKind: string;
};
