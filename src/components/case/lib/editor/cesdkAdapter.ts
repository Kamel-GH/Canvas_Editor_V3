import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type {
  EditorAssetDefinition,
  EditorAssetLibraryEntry,
  EditorAssetSourceDefinition,
  EditorExportOptions,
  EditorExportResult,
  EditorPanelOptions,
  EditorSceneCreateOptions,
  EditorSceneLoadOptions,
  EditorShell,
  EditorScaleConfig,
  EditorThemeConfig,
  EditorTranslations
} from './types';
import { createCesdkAssetPort } from './cesdkAdapterAssets';
import { createCesdkFeaturePort } from './cesdkAdapterFeatures';
import { createCesdkFilePort } from './cesdkAdapterFile';
import { createCesdkLifecyclePort } from './cesdkAdapterLifecycle';
import { createCesdkScenePort } from './cesdkAdapterScene';
import { createCesdkUiPort } from './cesdkAdapterUi';

export class CesdkEditorAdapter implements EditorShell {
  readonly ready = Promise.resolve();

  private readonly scenePort;
  private readonly uiPort;
  private readonly featurePort;
  private readonly assetPort;
  private readonly filePort;
  private readonly lifecyclePort;

  constructor(cesdk: CreativeEditorSDK) {
    this.scenePort = createCesdkScenePort(cesdk);
    this.uiPort = createCesdkUiPort(cesdk);
    this.featurePort = createCesdkFeaturePort(cesdk);
    this.assetPort = createCesdkAssetPort(cesdk);
    this.filePort = createCesdkFilePort(cesdk);
    this.lifecyclePort = createCesdkLifecyclePort(cesdk);
  }

  async addPlugin(plugin: unknown): Promise<unknown> {
    return this.lifecyclePort.addPlugin(plugin);
  }

  hasAssetSource(sourceId: string): boolean {
    return this.assetPort.hasAssetSource(sourceId);
  }

  async createScene(options?: EditorSceneCreateOptions): Promise<void> {
    await this.scenePort.createScene(options);
  }

  async saveScene(): Promise<string> {
    return this.scenePort.saveScene();
  }

  async saveArchive(): Promise<Blob> {
    return this.scenePort.saveArchive();
  }

  async loadScene(
    scene: string,
    options: EditorSceneLoadOptions = {}
  ): Promise<void> {
    await this.scenePort.loadScene(scene, options);
  }

  async loadSceneFromURL(
    url: string,
    options: EditorSceneLoadOptions = {}
  ): Promise<void> {
    await this.scenePort.loadSceneFromURL(url, options);
  }

  async loadArchiveFromURL(
    url: string,
    options: EditorSceneLoadOptions = {}
  ): Promise<void> {
    await this.scenePort.loadArchiveFromURL(url, options);
  }

  async exportDesign(
    options: EditorExportOptions = {}
  ): Promise<EditorExportResult> {
    return this.filePort.exportDesign(options);
  }

  async focusPage(page: 'first' | 'current'): Promise<void> {
    await this.scenePort.focusPage(page);
  }

  async uploadFile(
    file: File,
    context: string | { sourceId: string; group?: string } = {
      sourceId: 'image'
    }
  ): Promise<import('@cesdk/engine').AssetDefinition> {
    return this.filePort.uploadFile(file, context);
  }

  getTheme(): ReturnType<CreativeEditorSDK['ui']['getTheme']> {
    return this.uiPort.getTheme();
  }

  setTheme(theme: EditorThemeConfig): void {
    this.uiPort.setTheme(theme);
  }

  getScale(): ReturnType<CreativeEditorSDK['ui']['getScale']> {
    return this.uiPort.getScale();
  }

  setScale(scale: EditorScaleConfig): void {
    this.uiPort.setScale(scale);
  }

  getView(): ReturnType<CreativeEditorSDK['ui']['getView']> {
    return this.uiPort.getView();
  }

  setView(view: ReturnType<CreativeEditorSDK['ui']['getView']>): void {
    this.uiPort.setView(view);
  }

  enableFeatures(featureIds: string | readonly string[]): void {
    this.featurePort.enableFeatures(featureIds);
  }

  disableFeatures(featureIds: string | readonly string[]): void {
    this.featurePort.disableFeatures(featureIds);
  }

  setFeatureEnabled(featureId: string, enabled: boolean): void {
    this.featurePort.setFeatureEnabled(featureId, enabled);
  }

  openPanel(panelId: string, options: EditorPanelOptions = {}): void {
    this.uiPort.openPanel(panelId, options);
  }

  closePanel(panelId: string): void {
    this.uiPort.closePanel(panelId);
  }

  isPanelOpen(panelId: string): boolean {
    return this.uiPort.isPanelOpen(panelId);
  }

  setPanelPosition(panelId: string, position: 'left' | 'right'): void {
    this.uiPort.setPanelPosition(panelId, position);
  }

  setPanelFloating(panelId: string, floating: boolean): void {
    this.uiPort.setPanelFloating(panelId, floating);
  }

  setTranslations(translations: EditorTranslations): void {
    this.uiPort.setTranslations(translations);
  }

  addLocalAssetSource(source: EditorAssetSourceDefinition): void {
    this.assetPort.addLocalAssetSource(source);
  }

  addAssetToSource(sourceId: string, asset: EditorAssetDefinition): void {
    this.assetPort.addAssetToSource(sourceId, asset);
  }

  updateAssetLibraryEntry(
    id: string,
    assetLibraryEntry:
      | Partial<EditorAssetLibraryEntry>
      | ((entry: EditorAssetLibraryEntry | undefined) => Partial<EditorAssetLibraryEntry>)
  ): void {
    this.assetPort.updateAssetLibraryEntry(id, assetLibraryEntry);
  }

  dispose(): void {
    this.lifecyclePort.dispose();
  }
}

export function createCesdkEditorAdapter(
  cesdk: CreativeEditorSDK
): EditorShell {
  return new CesdkEditorAdapter(cesdk);
}
