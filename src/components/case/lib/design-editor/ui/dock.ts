import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { EditorManifest } from '../../editor/types';

import { applyEditorUiDockApplication } from './applicator';

type UiManifest = EditorManifest['ui'];
type AssetManifest = EditorManifest['content']['assets'];

export function setupDock(
  cesdk: CreativeEditorSDK,
  ui: UiManifest,
  assets: AssetManifest,
  dock: UiManifest['dock']
): void {
  applyEditorUiDockApplication(cesdk, {
    surfaceId: ui.surfaces.dock,
    libraries: assets.libraries,
    customEntries: dock.customEntries
  });
}
