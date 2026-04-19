import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { EditorManifest } from '../../editor/types';

import { applyEditorUiOrderApplications } from './applicator';

type CanvasManifest = EditorManifest['ui']['canvas'];

export function setupCanvas(
  cesdk: CreativeEditorSDK,
  canvas: CanvasManifest
): void {
  applyEditorUiOrderApplications(cesdk, [
    {
      surfaceId: 'ly.img.canvas.bar',
      at: canvas.barPosition,
      order: canvas.barOrder
    },
    {
      surfaceId: 'ly.img.canvas.menu',
      when: { editMode: 'Transform' },
      order: canvas.transformMenuOrder
    },
    {
      surfaceId: 'ly.img.canvas.menu',
      when: { editMode: 'Text' },
      order: canvas.textMenuOrder
    }
  ]);
}
