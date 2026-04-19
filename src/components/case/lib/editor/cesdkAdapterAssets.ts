import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type {
  EditorAssetDefinition,
  EditorAssetLibraryEntry,
  EditorAssetSourceDefinition
} from './types';

export interface CesdkAssetPort {
  hasAssetSource(sourceId: string): boolean;
  addLocalAssetSource(source: EditorAssetSourceDefinition): void;
  addAssetToSource(sourceId: string, asset: EditorAssetDefinition): void;
  updateAssetLibraryEntry(
    id: string,
    assetLibraryEntry:
      | Partial<EditorAssetLibraryEntry>
      | ((entry: EditorAssetLibraryEntry | undefined) => Partial<EditorAssetLibraryEntry>)
  ): void;
}

export function createCesdkAssetPort(
  cesdk: CreativeEditorSDK
): CesdkAssetPort {
  return {
    hasAssetSource(sourceId: string): boolean {
      return cesdk.engine.asset.findAllSources().includes(sourceId);
    },

    addLocalAssetSource(source: EditorAssetSourceDefinition): void {
      const assetIds = (source.assets ?? []).map((asset) => asset.id);

      cesdk.engine.asset.addLocalSource(
        source.id,
        assetIds,
        async (asset): Promise<number | undefined> => {
          if (source.onSelectAsset) {
            await source.onSelectAsset(asset as EditorAssetDefinition);
          }
          return undefined;
        }
      );

      for (const asset of source.assets ?? []) {
        cesdk.engine.asset.addAssetToSource(source.id, asset as never);
      }
    },

    addAssetToSource(sourceId: string, asset: EditorAssetDefinition): void {
      cesdk.engine.asset.addAssetToSource(sourceId, asset as never);
    },

    updateAssetLibraryEntry(
      id: string,
      assetLibraryEntry:
        | Partial<EditorAssetLibraryEntry>
        | ((entry: EditorAssetLibraryEntry | undefined) => Partial<EditorAssetLibraryEntry>)
    ): void {
      cesdk.ui.updateAssetLibraryEntry(id, assetLibraryEntry as never);
    }
  };
}
