export const STUDIO_INITIAL_DOCUMENT_ID = "studio-document-v1";
export const STUDIO_INITIAL_PAGE_ID = "studio-page-experience";

export type StudioDocumentMode = "template" | "document";

export type StudioVariableType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "enum"
  | "color"
  | "image"
  | "photo";

export type StudioNodeKind =
  | "text"
  | "image"
  | "shape"
  | "group"
  | "component"
  | "placeholder"
  | "emoji"
  | "svg";

export type StudioPage = {
  id: string;
  name: string;
  order: number;
  sizePreset: "A4";
  orientation: "portrait" | "landscape";
  width: number;
  height: number;
  backgroundColor: string;
  note: string;
};

export type StudioNodeFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StudioNode = {
  id: string;
  pageId: string;
  kind: StudioNodeKind;
  name: string;
  order: number;
  frame: StudioNodeFrame;
  layerId: string;
  visible: boolean;
  locked: boolean;
  tone: string;
  description: string;
  previewUrl?: string;
  source?: string;
};

export type StudioLayer = {
  id: string;
  pageId: string;
  name: string;
  order: number;
  visible: boolean;
  locked: boolean;
};

export type StudioVariable = {
  id: string;
  key: string;
  label: string;
  type: StudioVariableType;
  description: string;
};

export type StudioPreset = {
  id: string;
  name: string;
  summary: string;
  kind: "text";
  preview: string;
  variableKeys: string[];
};

export type StudioAsset = {
  id: string;
  kind: "image" | "icon" | "shape" | "svg";
  name: string;
  description: string;
  source?: string;
};

export type StudioDocument = {
  id: string;
  name: string;
  mode: StudioDocumentMode;
  pages: StudioPage[];
  nodes: StudioNode[];
  layers: StudioLayer[];
  variables: StudioVariable[];
  presets: StudioPreset[];
  assets: StudioAsset[];
};
