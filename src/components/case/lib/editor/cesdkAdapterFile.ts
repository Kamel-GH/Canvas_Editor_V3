import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { EditorExportOptions, EditorExportResult } from './types';

export interface CesdkFilePort {
  exportDesign(options?: EditorExportOptions): Promise<EditorExportResult>;
  uploadFile(
    file: File,
    context?: string | { sourceId: string; group?: string }
  ): Promise<import('@cesdk/engine').AssetDefinition>;
}

export function createCesdkFilePort(cesdk: CreativeEditorSDK): CesdkFilePort {
  return {
    async exportDesign(
      options: EditorExportOptions = {}
    ): Promise<EditorExportResult> {
      const result = await cesdk.utils.export(options as never);
      return result as EditorExportResult;
    },

    async uploadFile(
      file: File,
      context: string | { sourceId: string; group?: string } = {
        sourceId: 'image'
      }
    ): Promise<import('@cesdk/engine').AssetDefinition> {
      return cesdk.utils.localUpload(file, context as never);
    }
  };
}
