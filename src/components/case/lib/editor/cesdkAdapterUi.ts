import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type {
  EditorPanelOptions,
  EditorScaleConfig,
  EditorThemeConfig,
  EditorTranslations
} from './types';

export interface CesdkUiPort {
  getTheme(): ReturnType<CreativeEditorSDK['ui']['getTheme']>;
  setTheme(theme: EditorThemeConfig): void;
  getScale(): ReturnType<CreativeEditorSDK['ui']['getScale']>;
  setScale(scale: EditorScaleConfig): void;
  getView(): ReturnType<CreativeEditorSDK['ui']['getView']>;
  setView(view: ReturnType<CreativeEditorSDK['ui']['getView']>): void;
  openPanel(panelId: string, options?: EditorPanelOptions): void;
  closePanel(panelId: string): void;
  isPanelOpen(panelId: string): boolean;
  setPanelPosition(panelId: string, position: 'left' | 'right'): void;
  setPanelFloating(panelId: string, floating: boolean): void;
  setTranslations(translations: EditorTranslations): void;
}

export function createCesdkUiPort(cesdk: CreativeEditorSDK): CesdkUiPort {
  return {
    getTheme(): ReturnType<CreativeEditorSDK['ui']['getTheme']> {
      return cesdk.ui.getTheme();
    },

    setTheme(theme: EditorThemeConfig): void {
      cesdk.ui.setTheme(theme as never);
    },

    getScale(): ReturnType<CreativeEditorSDK['ui']['getScale']> {
      return cesdk.ui.getScale();
    },

    setScale(scale: EditorScaleConfig): void {
      cesdk.ui.setScale(scale);
    },

    getView(): ReturnType<CreativeEditorSDK['ui']['getView']> {
      return cesdk.ui.getView();
    },

    setView(view: ReturnType<CreativeEditorSDK['ui']['getView']>): void {
      cesdk.ui.setView(view);
    },

    openPanel(panelId: string, options: EditorPanelOptions = {}): void {
      if (options.position) {
        cesdk.ui.setPanelPosition(panelId, options.position);
      }
      if (typeof options.floating === 'boolean') {
        cesdk.ui.setPanelFloating(panelId, options.floating);
      }
      cesdk.ui.openPanel(panelId);
    },

    closePanel(panelId: string): void {
      cesdk.ui.closePanel(panelId);
    },

    isPanelOpen(panelId: string): boolean {
      return cesdk.ui.isPanelOpen(panelId);
    },

    setPanelPosition(panelId: string, position: 'left' | 'right'): void {
      cesdk.ui.setPanelPosition(panelId, position);
    },

    setPanelFloating(panelId: string, floating: boolean): void {
      cesdk.ui.setPanelFloating(panelId, floating);
    },

    setTranslations(translations: EditorTranslations): void {
      cesdk.i18n.setTranslations(translations);
    }
  };
}
