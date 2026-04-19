import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { EditorManifest } from '../../editor/types';

import { applyEditorUiOrderApplication } from './applicator';

type NavigationManifest = EditorManifest['ui']['navigation'];

export function setupNavigationBar(
  cesdk: CreativeEditorSDK,
  navigation: NavigationManifest
): void {
  applyEditorUiOrderApplication(cesdk, {
    surfaceId: 'ly.img.navigation.bar',
    order: navigation.order
  });
}
