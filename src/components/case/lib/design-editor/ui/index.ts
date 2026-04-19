/**
 * UI Configuration - Orchestrates All UI Setup
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/overview-41101a/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { EditorManifest } from '../../editor/types';
import type { EditorActionController } from '../../editor';

import { applyEditorUiManifest } from './applicator';
import { setupComponents } from './components';

export function setupUI(
  cesdk: CreativeEditorSDK,
  manifest: EditorManifest,
  editorActions?: EditorActionController
): void {
  applyEditorUiManifest(cesdk, manifest);
  setupComponents(cesdk, manifest.behavior.translations.en, editorActions);
}

export {
  applyEditorDockOrder,
  applyEditorPanelPlacements,
  applyEditorUiDockApplication,
  applyEditorUiManifest,
  applyEditorUiOrderApplication,
  applyEditorUiOrderApplications,
  applyEditorUiPanelPlacements
} from './applicator';

export { setupComponents };
