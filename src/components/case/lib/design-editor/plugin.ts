/**
 * Editor Shell Plugin - Complete editing configuration for the shell
 *
 * This plugin provides a production-ready design editor configuration with
 * templates, elements, asset libraries, and comprehensive editing capabilities.
 *
 * @example Basic usage
 * ```typescript
 * import CreativeEditorSDK from '@cesdk/cesdk-js';
 * import { DesignEditorConfig } from './plugin';
 *
 * const cesdk = await CreativeEditorSDK.create('#editor', config);
 * await cesdk.addPlugin(new DesignEditorConfig());
 * await cesdk.actions.run('scene.create');
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 * @see https://img.ly/docs/cesdk/js/configuration-2c1c3d/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { editorManifest as editorShellManifest } from '../editor/manifest';
import { configureEditorShell } from '../editor/configureShell';

/**
 * Editor shell configuration plugin.
 *
 * Provides a complete design editing experience optimized for creating
 * graphics, templates, marketing materials, and multi-page documents.
 *
 * @public
 */
export class DesignEditorConfig implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   * Used to identify the plugin in the CE.SDK plugin registry.
   */
  name = 'cesdk-design-editor';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Initialize the editor shell configuration.
   *
   * This method is called when the plugin is added to CE.SDK via addPlugin().
   * It sets up shell features, UI components, translations, and settings.
   *
   * @param ctx - The editor plugin context containing cesdk and engine instances
   */
  async initialize({ cesdk, engine }: EditorPluginContext) {
    if (cesdk) {
      configureEditorShell({
        cesdk,
        engine,
        manifest: editorShellManifest
      });
    }
  }
}
