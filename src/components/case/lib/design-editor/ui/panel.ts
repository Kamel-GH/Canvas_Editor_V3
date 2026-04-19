import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { EditorManifest } from '../../editor/types';

import { applyEditorUiPanelPlacements } from './applicator';

type PanelsManifest = EditorManifest['ui']['panels'];

export function setupPanels(
  cesdk: CreativeEditorSDK,
  panels: PanelsManifest
): void {
  applyEditorUiPanelPlacements(cesdk, panels.placements);
}
