import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type {
  EditorManifest,
  EditorPanelPlacement,
  EditorResolvedAssetLibrary,
  EditorUiOrderItem
} from '../../editor/types';

type EditorUiOrder = readonly EditorUiOrderItem[];
type ComponentOrderLocation = Parameters<
  CreativeEditorSDK['ui']['setComponentOrder']
>[0];
type ComponentOrderSurfaceId = ComponentOrderLocation extends {
  in: infer SurfaceId;
}
  ? SurfaceId
  : never;
type ComponentOrderAt = ComponentOrderLocation extends {
  at?: infer At;
}
  ? At
  : never;
type ComponentOrderWhen = ComponentOrderLocation extends {
  when?: infer When;
}
  ? When
  : never;

export type EditorUiManifestInput = Pick<EditorManifest, 'ui' | 'content'>;

export type EditorUiOrderApplication = {
  surfaceId: string;
  order: EditorUiOrder;
  at?: ComponentOrderAt;
  when?: ComponentOrderWhen;
};

export type EditorUiDockApplication = {
  surfaceId?: string;
  libraries: readonly EditorResolvedAssetLibrary[];
  customEntries: readonly string[];
};

function cloneEditorUiOrderItem(item: EditorUiOrderItem): EditorUiOrderItem {
  if (typeof item === 'string') {
    return item;
  }

  return {
    id: item.id,
    children: [...item.children]
  };
}

function cloneEditorUiOrder(order: EditorUiOrder): EditorUiOrderItem[] {
  return order.map(cloneEditorUiOrderItem);
}

function toComponentOrderSurfaceId(surfaceId: string): ComponentOrderSurfaceId {
  return surfaceId as ComponentOrderSurfaceId;
}

function buildComponentOrderLocation(
  application: EditorUiOrderApplication
): ComponentOrderLocation {
  return {
    in: toComponentOrderSurfaceId(application.surfaceId),
    ...(application.at === undefined ? {} : { at: application.at }),
    ...(application.when === undefined ? {} : { when: application.when })
  } as ComponentOrderLocation;
}

function setComponentOrder(
  cesdk: CreativeEditorSDK,
  location: ComponentOrderLocation,
  order: EditorUiOrder
): void {
  const registerComponentOrder = cesdk.ui.setComponentOrder as unknown as (
    nextLocation: ComponentOrderLocation,
    nextOrder: EditorUiOrderItem[]
  ) => void;

  registerComponentOrder(location, cloneEditorUiOrder(order));
}

export function applyEditorUiOrderApplication(
  cesdk: CreativeEditorSDK,
  application: EditorUiOrderApplication
): void {
  setComponentOrder(
    cesdk,
    buildComponentOrderLocation(application),
    application.order
  );
}

export function applyEditorUiOrderApplications(
  cesdk: CreativeEditorSDK,
  applications: readonly EditorUiOrderApplication[]
): void {
  for (const application of applications) {
    applyEditorUiOrderApplication(cesdk, application);
  }
}

export function applyEditorUiDockApplication(
  cesdk: CreativeEditorSDK,
  application: EditorUiDockApplication
): void {
  const surfaceId = toComponentOrderSurfaceId(
    application.surfaceId ?? 'ly.img.dock'
  );
  const registerComponentOrder = cesdk.ui.setComponentOrder as unknown as (
    nextLocation: ComponentOrderLocation,
    nextOrder: Array<EditorResolvedAssetLibrary | string>
  ) => void;

  registerComponentOrder(
    { in: surfaceId } as never,
    [
      ...application.libraries.map((library) => ({
        ...library,
        entries: [...library.entries]
      })),
      ...application.customEntries
    ]
  );
}

export function applyEditorUiPanelPlacements(
  cesdk: CreativeEditorSDK,
  placements: readonly EditorPanelPlacement[]
): void {
  for (const panel of placements) {
    cesdk.ui.setPanelPosition(panel.id, panel.position);
    cesdk.ui.setPanelFloating(panel.id, panel.floating);
  }
}

export function applyEditorUiManifest(
  cesdk: CreativeEditorSDK,
  manifest: EditorUiManifestInput
): void {
  const { ui, content } = manifest;

  applyEditorUiOrderApplications(cesdk, [
    {
      surfaceId: ui.surfaces.navigationBar,
      order: ui.navigation.order
    },
    {
      surfaceId: ui.surfaces.canvasBar,
      at: ui.canvas.barPosition,
      order: ui.canvas.barOrder
    },
    {
      surfaceId: ui.surfaces.canvasMenu,
      when: { editMode: 'Transform' },
      order: ui.canvas.transformMenuOrder
    },
    {
      surfaceId: ui.surfaces.canvasMenu,
      when: { editMode: 'Text' },
      order: ui.canvas.textMenuOrder
    },
    {
      surfaceId: ui.surfaces.inspectorBar,
      when: { editMode: 'Transform' },
      order: ui.inspector.transformBarOrder
    },
    {
      surfaceId: ui.surfaces.inspectorBar,
      when: { editMode: 'Text' },
      order: ui.inspector.textBarOrder
    },
    {
      surfaceId: ui.surfaces.inspectorBar,
      when: { editMode: 'Trim' },
      order: ui.inspector.trimBarOrder
    },
    {
      surfaceId: ui.surfaces.inspectorBar,
      when: { editMode: 'Crop' },
      order: ui.inspector.cropBarOrder
    }
  ]);

  applyEditorUiDockApplication(cesdk, {
    surfaceId: ui.surfaces.dock,
    libraries: content.assets.libraries,
    customEntries: ui.dock.customEntries
  });
  applyEditorUiPanelPlacements(cesdk, ui.panels.placements);
}

export const applyEditorUiComponentOrder = applyEditorUiOrderApplication;
export const applyEditorUiComponentOrders = applyEditorUiOrderApplications;
export const applyEditorDockOrder = applyEditorUiDockApplication;
export const applyEditorPanelPlacements = applyEditorUiPanelPlacements;
