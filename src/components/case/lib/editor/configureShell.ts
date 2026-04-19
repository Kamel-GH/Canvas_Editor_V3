import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { CreativeEngine } from '@cesdk/cesdk-js';

import { resolveEditorManifest } from './manifest';
import type { EditorManifestSpec } from './types';
import { createCesdkEditorAdapter } from './cesdkAdapter';
import { createEditorActionController } from './actions';
import { applyEditorShellPolicy } from './shellPolicy';

import { setupActions } from '../design-editor/actions';
import { setupUI } from '../design-editor/ui';

export type ConfigureEditorShellOptions = {
  cesdk: CreativeEditorSDK;
  engine: CreativeEngine;
  manifest: EditorManifestSpec;
  resetEditor?: boolean;
};

export function configureEditorShell({
  cesdk,
  engine,
  manifest,
  resetEditor = true
}: ConfigureEditorShellOptions): void {
  const resolvedManifest = resolveEditorManifest(manifest);
  const editorActions = createEditorActionController(
    createCesdkEditorAdapter(cesdk)
  );

  if (resetEditor) {
    cesdk.resetEditor();
  }

  applyEditorShellPolicy({
    cesdk,
    engine,
    manifest: resolvedManifest
  });
  setupUI(cesdk, resolvedManifest, editorActions);
  setupActions(cesdk, editorActions);
  cesdk.reapplyLegacyUserConfiguration();
}
