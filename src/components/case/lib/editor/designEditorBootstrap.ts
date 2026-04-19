import type { EditorShell } from './types';

import { DesignEditorConfig } from '../design-editor/plugin';

export async function bootstrapDesignEditor(
  cesdk: EditorShell
): Promise<void> {
  await cesdk.addPlugin(new DesignEditorConfig());
  await cesdk.createScene({ mode: 'Design' });
}
