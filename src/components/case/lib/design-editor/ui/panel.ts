/**
 * Panel Configuration - Inspector Panel and Asset Library Panel
 *
 * Configure panel positioning (left/right) and floating state.
 * Panels can be docked to push the canvas or float over it.
 *
 * ## Panel IDs
 *
 * - `'//ly.img.panel/inspector'` - Inspector panel (block properties)
 * - `'//ly.img.panel/assets'` - Asset library panel
 * - `'//ly.img.panel/assetLibrary'` - Alternative asset library panel ID
 *
 * ## Panel Options
 *
 * - **Position**: `'left'` | `'right'`
 * - **Floating**: `true` (float over canvas) | `false` (push canvas)
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/create-custom-panel-d87b83/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { SHELL_VARIABLES_PANEL_ID } from './components';

/**
 * Configure panel positioning and behavior.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupPanels(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // INSPECTOR PANEL
  // Configure the block properties panel
  // ============================================================================

  // #region Inspector Panel
  cesdk.ui.setPanelPosition('//ly.img.panel/inspector', 'right');
  cesdk.ui.setPanelFloating('//ly.img.panel/inspector', false);
  // #endregion

  // ============================================================================
  // ASSETS PANEL
  // Configure the asset library panel
  // ============================================================================

  // #region Assets Panel
  cesdk.ui.setPanelPosition('//ly.img.panel/assets', 'left');
  cesdk.ui.setPanelFloating('//ly.img.panel/assets', false);
  cesdk.ui.setPanelPosition('//ly.img.panel/assetLibrary', 'left');
  cesdk.ui.setPanelFloating('//ly.img.panel/assetLibrary', false);
  cesdk.ui.setPanelPosition(SHELL_VARIABLES_PANEL_ID, 'left');
  cesdk.ui.setPanelFloating(SHELL_VARIABLES_PANEL_ID, false);
  // #endregion
}
