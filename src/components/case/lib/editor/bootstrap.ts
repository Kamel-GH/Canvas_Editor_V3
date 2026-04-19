import CreativeEditorSDK from '@cesdk/cesdk-js';

import { DesignEditorConfig } from '../design-editor/plugin';

import { createCesdkEditorAdapter } from './cesdkAdapter';
import type { EditorBootstrapOptions, EditorShell } from './types';

export async function bootstrapEditorShell(
  options: EditorBootstrapOptions
): Promise<EditorShell> {
  const cesdk = await CreativeEditorSDK.create(
    options.container,
    options.config as never
  );
  const shell = createCesdkEditorAdapter(cesdk);

  await shell.addPlugin(new DesignEditorConfig());
  await shell.createScene({ mode: 'Design' });

  return shell;
}
