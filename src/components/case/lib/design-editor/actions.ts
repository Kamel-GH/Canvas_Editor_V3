import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  registerEditorActions
} from '../editor';
import type { EditorActionController } from '../editor';

export function setupActions(
  cesdk: CreativeEditorSDK,
  controller: EditorActionController
): void {
  registerEditorActions(cesdk.actions, controller);
}
