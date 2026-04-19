import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type {
  EditorSceneCreateOptions,
  EditorSceneLoadOptions
} from './types';

export interface CesdkScenePort {
  createScene(options?: EditorSceneCreateOptions): Promise<void>;
  saveScene(): Promise<string>;
  saveArchive(): Promise<Blob>;
  loadScene(scene: string, options?: EditorSceneLoadOptions): Promise<void>;
  loadSceneFromURL(
    url: string,
    options?: EditorSceneLoadOptions
  ): Promise<void>;
  loadArchiveFromURL(
    url: string,
    options?: EditorSceneLoadOptions
  ): Promise<void>;
  focusPage(page: 'first' | 'current'): Promise<void>;
}

export function createCesdkScenePort(
  cesdk: CreativeEditorSDK
): CesdkScenePort {
  return {
    async createScene(options?: EditorSceneCreateOptions): Promise<void> {
      await cesdk.actions.run('scene.create', options as never);
    },

    async saveScene(): Promise<string> {
      return cesdk.engine.scene.saveToString();
    },

    async saveArchive(): Promise<Blob> {
      return cesdk.engine.scene.saveToArchive();
    },

    async loadScene(
      scene: string,
      options: EditorSceneLoadOptions = {}
    ): Promise<void> {
      await cesdk.engine.scene.loadFromString(
        scene,
        options.overrideEditorConfig ?? false
      );
    },

    async loadSceneFromURL(
      url: string,
      options: EditorSceneLoadOptions = {}
    ): Promise<void> {
      await cesdk.engine.scene.loadFromURL(
        url,
        options.overrideEditorConfig ?? false
      );
    },

    async loadArchiveFromURL(
      url: string,
      options: EditorSceneLoadOptions = {}
    ): Promise<void> {
      await cesdk.engine.scene.loadFromArchiveURL(
        url,
        options.overrideEditorConfig ?? false
      );
    },

    async focusPage(page: 'first' | 'current'): Promise<void> {
      if (page === 'first') {
        const firstPage = cesdk.engine.scene.getPages()[0];
        if (!firstPage) {
          return;
        }

        await cesdk.actions.run('zoom.toBlock', firstPage, {
          autoFit: false,
          animate: false
        } as never);
        return;
      }

      await cesdk.actions.run('zoom.toPage', { page } as never);
    }
  };
}
