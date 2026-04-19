import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { createEditorActionController } from '../../editor';
import { createCesdkEditorAdapter } from '../../editor/cesdkAdapter';
import type { EditorActionController } from '../../editor';

export interface ShellComponentCommands {
  closeEditor(): void;
  isDocumentMode(): boolean;
  openDocumentPanel(): void;
  saveDocument(): Promise<void>;
  isVariablesPanelOpen(): boolean;
  toggleVariablesPanel(): void;
}

const INSPECTOR_PANEL_ID = '//ly.img.panel/inspector';
const VARIABLES_PANEL_ID = 'canvas-editor.variables.panel';
const ASSET_LIBRARY_PANEL_PATTERN = '*assetLibrary*';
const CLOSE_NOTIFICATION =
  'Close action is not wired to an app route yet.';

function clearSelection(cesdk: CreativeEditorSDK): void {
  cesdk.engine.block.findAllSelected().forEach((blockId) => {
    cesdk.engine.block.setSelected(blockId, false);
  });
}

export function createShellComponentCommands(
  cesdk: CreativeEditorSDK,
  editorActions: EditorActionController = createEditorActionController(
    createCesdkEditorAdapter(cesdk)
  )
): ShellComponentCommands {
  return {
    closeEditor(): void {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
        return;
      }

      cesdk.ui.showNotification(CLOSE_NOTIFICATION);
    },

    isDocumentMode(): boolean {
      return cesdk.engine.block.findAllSelected().length === 0;
    },

    openDocumentPanel(): void {
      clearSelection(cesdk);
      cesdk.ui.openPanel(INSPECTOR_PANEL_ID);
    },

    async saveDocument(): Promise<void> {
      await editorActions.saveDocument();
    },

    isVariablesPanelOpen(): boolean {
      return cesdk.ui.isPanelOpen(VARIABLES_PANEL_ID);
    },

    toggleVariablesPanel(): void {
      if (cesdk.ui.isPanelOpen(VARIABLES_PANEL_ID)) {
        cesdk.ui.closePanel(VARIABLES_PANEL_ID);
        return;
      }

      cesdk.ui.closePanel(ASSET_LIBRARY_PANEL_PATTERN);
      cesdk.ui.openPanel(VARIABLES_PANEL_ID);
    }
  };
}
