import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { EditorManifest } from '../../editor/types';

import { applyEditorUiOrderApplications } from './applicator';

type InspectorManifest = EditorManifest['ui']['inspector'];

export function setupInspectorBar(
  cesdk: CreativeEditorSDK,
  inspector: InspectorManifest
): void {
  applyEditorUiOrderApplications(cesdk, [
    {
      surfaceId: 'ly.img.inspector.bar',
      when: { editMode: 'Transform' },
      order: inspector.transformBarOrder
    },
    {
      surfaceId: 'ly.img.inspector.bar',
      when: { editMode: 'Text' },
      order: inspector.textBarOrder
    },
    {
      surfaceId: 'ly.img.inspector.bar',
      when: { editMode: 'Trim' },
      order: inspector.trimBarOrder
    },
    {
      surfaceId: 'ly.img.inspector.bar',
      when: { editMode: 'Crop' },
      order: inspector.cropBarOrder
    }
  ]);
}
