import type { EditorExportOptions } from './types';

import type {
  EditorDocumentFormat,
  EditorDocumentService
} from './documentService';

export interface EditorActionRegistry {
  register(actionId: string, handler: (...args: any[]) => unknown): void;
}

export type EditorActionController = EditorDocumentService;

export { createEditorActionController } from './documentService';

export function registerEditorActions(
  registry: EditorActionRegistry,
  controller: EditorDocumentService
): void {
  registry.register('saveScene', async () => {
    await controller.saveDocument();
  });

  registry.register(
    'exportDesign',
    async (exportOptions?: EditorExportOptions) => {
      await controller.exportDesign(exportOptions);
    }
  );

  registry.register('importScene', async (...args: unknown[]) => {
    const [options = {}] = args as [{ format?: EditorDocumentFormat }?];
    await controller.importDocument(options.format);
  });

  registry.register('exportScene', async (...args: unknown[]) => {
    const [options = {}] = args as [{ format?: EditorDocumentFormat }?];
    await controller.exportDocument(options.format);
  });

  registry.register(
    'uploadFile',
    (file: File, _onProgress: unknown, context: string | undefined) =>
      controller.uploadFile(file, context)
  );

  registry.register('exportImage', async () => {
    await controller.exportImage();
  });
}
