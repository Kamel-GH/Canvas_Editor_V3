import type { CreativeEngine } from '@cesdk/cesdk-js';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { EditorResolvedManifest } from './types';

export function applyEditorShellFeatures(
  cesdk: CreativeEditorSDK,
  manifest: EditorResolvedManifest
): void {
  cesdk.feature.enable([...manifest.behavior.features.enabled]);
}

export function applyEditorShellTranslations(
  cesdk: CreativeEditorSDK,
  manifest: EditorResolvedManifest
): void {
  cesdk.i18n.setTranslations(manifest.behavior.translations);
}

export function applyEditorShellSettings(
  engine: CreativeEngine,
  manifest: EditorResolvedManifest
): void {
  for (const { key, value } of manifest.behavior.settings.values) {
    engine.editor.setSetting(key as never, value as never);
  }
}

export function applyEditorShellPolicy(options: {
  cesdk: CreativeEditorSDK;
  engine: CreativeEngine;
  manifest: EditorResolvedManifest;
}): void {
  applyEditorShellFeatures(options.cesdk, options.manifest);
  applyEditorShellTranslations(options.cesdk, options.manifest);
  applyEditorShellSettings(options.engine, options.manifest);
}
