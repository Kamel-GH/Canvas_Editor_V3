import type CreativeEditorSDK from '@cesdk/cesdk-js';

function toArray<T>(value: T | readonly T[]): T[] {
  if (Array.isArray(value)) {
    return [...value] as T[];
  }

  return [value] as T[];
}

export interface CesdkFeaturePort {
  enableFeatures(featureIds: string | readonly string[]): void;
  disableFeatures(featureIds: string | readonly string[]): void;
  setFeatureEnabled(featureId: string, enabled: boolean): void;
}

export function createCesdkFeaturePort(
  cesdk: CreativeEditorSDK
): CesdkFeaturePort {
  return {
    enableFeatures(featureIds: string | readonly string[]): void {
      cesdk.feature.enable([...toArray(featureIds)]);
    },

    disableFeatures(featureIds: string | readonly string[]): void {
      cesdk.feature.disable([...toArray(featureIds)]);
    },

    setFeatureEnabled(featureId: string, enabled: boolean): void {
      cesdk.feature.set(featureId, enabled);
    }
  };
}
