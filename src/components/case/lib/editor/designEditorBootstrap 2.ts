import { DesignEditorConfig } from '../design-editor/plugin';

import type { EditorShell } from './types';

export async function bootstrapDesignEditor(
  cesdk: EditorShell
): Promise<void> {
  await cesdk.addPlugin(new DesignEditorConfig());
  await cesdk.createScene({ mode: 'Design' });
}
