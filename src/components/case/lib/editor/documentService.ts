import type { EditorExportOptions, EditorShell } from './types';

import {
  createBrowserEditorDocumentIO,
  filenameForMimeType,
  type EditorDocumentIO
} from './documentIO';

export type EditorDocumentFormat = 'scene' | 'archive';

export interface EditorDocumentService {
  saveDocument(): Promise<void>;
  exportDesign(options?: EditorExportOptions): Promise<void>;
  importDocument(format?: EditorDocumentFormat): Promise<void>;
  exportDocument(format?: EditorDocumentFormat): Promise<void>;
  uploadFile(
    file: File,
    context?: string | { sourceId: string; group?: string }
  ): Promise<import('@cesdk/engine').AssetDefinition>;
  exportImage(): Promise<void>;
}

function downloadSceneFile(
  io: EditorDocumentIO,
  value: Blob | string,
  mimeType: string,
  fallbackName: string
): void {
  io.download(value, mimeType, fallbackName);
}

export function createEditorDocumentService(
  shell: EditorShell,
  io: EditorDocumentIO = createBrowserEditorDocumentIO()
): EditorDocumentService {
  return {
    async saveDocument(): Promise<void> {
      const scene = await shell.saveScene();
      downloadSceneFile(io, scene, 'text/plain;charset=UTF-8', 'design.scene');
    },

    async exportDesign(options: EditorExportOptions = {}): Promise<void> {
      const { blobs, options: resolvedOptions } = await shell.exportDesign(
        options
      );
      const blob = blobs[0];
      const mimeType = resolvedOptions.mimeType ?? blob.type;

      io.download(blob, mimeType, filenameForMimeType(mimeType, 'design'));
    },

    async importDocument(
      format: EditorDocumentFormat = 'scene'
    ): Promise<void> {
      if (format === 'scene') {
        const file = await io.pickFile('.scene,.json,application/json');
        if (!file) {
          return;
        }

        await shell.loadScene(await file.text());
        await shell.focusPage('first');
        return;
      }

      const file = await io.pickFile('.zip,application/zip');
      if (!file) {
        return;
      }

      const objectURL = URL.createObjectURL(file);
      try {
        await shell.loadArchiveFromURL(objectURL);
        await shell.focusPage('first');
      } finally {
        URL.revokeObjectURL(objectURL);
      }
    },

    async exportDocument(
      format: EditorDocumentFormat = 'scene'
    ): Promise<void> {
      if (format === 'archive') {
        io.download(
          await shell.saveArchive(),
          'application/zip',
          'design.zip'
        );
        return;
      }

      io.download(
        await shell.saveScene(),
        'text/plain;charset=UTF-8',
        'design.scene'
      );
    },

    async uploadFile(
      file: File,
      context = { sourceId: 'image' }
    ): Promise<import('@cesdk/engine').AssetDefinition> {
      return shell.uploadFile(file, context);
    },

    async exportImage(): Promise<void> {
      const { blobs, options } = await shell.exportDesign({
        mimeType: 'image/png',
        targetWidth: 1080,
        targetHeight: 1080
      });
      const blob = blobs[0];

      io.download(blob, options.mimeType ?? 'image/png', 'design.png');
    }
  };
}

export function createEditorActionController(
  shell: EditorShell,
  io: EditorDocumentIO = createBrowserEditorDocumentIO()
): EditorDocumentService {
  return createEditorDocumentService(shell, io);
}
