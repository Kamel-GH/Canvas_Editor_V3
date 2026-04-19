import type CreativeEditorSDK from '@cesdk/cesdk-js';

export interface CesdkLifecyclePort {
  addPlugin(plugin: unknown): Promise<unknown>;
  dispose(): void;
}

export function createCesdkLifecyclePort(
  cesdk: CreativeEditorSDK
): CesdkLifecyclePort {
  return {
    addPlugin(plugin: unknown): Promise<unknown> {
      return cesdk.addPlugin(plugin as never);
    },

    dispose(): void {
      cesdk.dispose();
    }
  };
}
