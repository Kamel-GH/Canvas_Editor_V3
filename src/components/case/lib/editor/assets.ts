import {
  createFloralStickerCatalog,
  loadPremiumTemplateCatalog,
  resolvePublicAssetBaseURL,
  toEditorAssetDefinition
} from './catalog';
import type { EditorShell } from './types';

export const getTemplateBaseURL = (): string | null => {
  alert(
    'Premium templates CDN URL is not configured. This showcase requires access to premium templates.'
  );
  console.error('Premium templates base URL is not available');
  return null;
};

export const persistSelectedTemplateToURL = (assetId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('template', assetId);
  window.history.pushState({}, '', url);
};

export async function addPremiumTemplatesAssetSource(
  shell: EditorShell,
  persistURL = false
) {
  const baseURL = getTemplateBaseURL();
  if (!baseURL) {
    return;
  }

  const catalog = await loadPremiumTemplateCatalog(baseURL);
  if (!catalog) {
    return;
  }

  if (!shell.hasAssetSource(catalog.id)) {
    shell.addLocalAssetSource({
      id: catalog.id,
      assets: catalog.assets.map(toEditorAssetDefinition),
      onSelectAsset: async (asset) => {
        const archiveUri =
          typeof asset.meta?.uri === 'string' ? asset.meta.uri : undefined;

        if (!archiveUri) {
          return;
        }

        await shell.loadArchiveFromURL(archiveUri);
        await shell.focusPage('first');
        if (persistURL) {
          persistSelectedTemplateToURL(asset.id);
        }
      }
    });
  }

  shell.setTranslations(catalog.translations);

  shell.updateAssetLibraryEntry(catalog.libraryPatch.id, {
    sourceIds: ({ currentIds }) =>
      Array.from(new Set([...currentIds, catalog.id])),
    ...catalog.libraryPatch.entry
  });

  await addFloralStickersAssetSource(shell);
}

export async function addFloralStickersAssetSource(
  shell: EditorShell,
  assetURI = '/icons/florals'
) {
  const catalog = createFloralStickerCatalog(resolvePublicAssetBaseURL(assetURI));

  for (const asset of catalog.assets) {
    shell.addAssetToSource(catalog.id, toEditorAssetDefinition(asset));
  }

  shell.setTranslations(catalog.translations);
}
