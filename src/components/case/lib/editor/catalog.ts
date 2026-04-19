import type {
  EditorAssetDefinition,
  EditorAssetLibraryEntry,
  EditorTranslations
} from './types';

export type EditorCatalogAssetRecord = {
  id: string;
  label: string | Partial<Record<string, string>>;
  uri: string;
  groups?: readonly string[];
  tags?: Record<string, string | number | boolean>;
  meta?: Record<string, unknown>;
  thumbUri?: string;
};

export type EditorCatalogLibraryPatch = {
  id: string;
  entry: Partial<EditorAssetLibraryEntry>;
};

export type EditorTemplateCatalog = {
  id: string;
  assets: readonly EditorCatalogAssetRecord[];
  translations: EditorTranslations;
  libraryPatch: EditorCatalogLibraryPatch;
};

export type EditorStickerCatalog = {
  id: string;
  assets: readonly EditorCatalogAssetRecord[];
  translations: EditorTranslations;
};

export function resolvePublicAssetBaseURL(
  assetURI = '/icons/florals'
): string {
  const hostname = process.env.NEXT_PUBLIC_URL_HOSTNAME ?? '';
  const publicUrl = process.env.NEXT_PUBLIC_URL ?? '';
  const baseUrl = `${hostname}${publicUrl}`.replace(/\/$/, '');
  const normalizedAssetURI = assetURI.replace(/^\//, '');

  return assetURI.startsWith('http')
    ? assetURI
    : `${baseUrl}/${normalizedAssetURI}`;
}

type PremiumTemplateSourcePayload = {
  assets?: EditorAssetDefinition[];
  id: string;
};

function toAssetLabel(
  label: EditorAssetDefinition['label'],
  fallback: string
): string | Partial<Record<string, string>> {
  if (typeof label === 'string') {
    return label;
  }

  if (label && typeof label === 'object') {
    return label;
  }

  return fallback;
}

function toAssetRecord(asset: EditorAssetDefinition): EditorCatalogAssetRecord | null {
  const archiveUri =
    typeof asset.meta?.uri === 'string' ? asset.meta.uri : undefined;

  if (!archiveUri) {
    return null;
  }

  return {
    id: asset.id,
    label: toAssetLabel(asset.label, asset.id),
    uri: archiveUri,
    groups: asset.groups,
    tags: asset.tags,
    meta: asset.meta
  };
}

export async function loadPremiumTemplateCatalog(
  baseURL: string,
  fetchImpl: typeof fetch = fetch
): Promise<EditorTemplateCatalog | null> {
  const response = await fetchImpl(`${baseURL}/dist/templates/content.json`);
  const assetSourceData = (await response.json()) as PremiumTemplateSourcePayload;
  const assetSourceString = JSON.stringify(assetSourceData);
  const replacedString = assetSourceString.replace(
    /\{\{base_url\}\}/g,
    `${baseURL}/dist`
  );
  const parsed = JSON.parse(replacedString) as PremiumTemplateSourcePayload;

  const assets = (parsed.assets ?? [])
    .map(toAssetRecord)
    .filter((asset): asset is EditorCatalogAssetRecord => asset !== null);

  return {
    id: parsed.id,
    assets,
    translations: {
      en: {
        'libraries.ly.img.templates.ly.img.template.premium1.label':
          'Templates',
        'libraries.ly.img.templates.ly.img.template.premium1.e-commerce.label':
          'E-Commerce',
        'libraries.ly.img.templates.ly.img.template.premium1.event.label':
          'Event',
        'libraries.ly.img.templates.ly.img.template.premium1.personal.label':
          'Personal',
        'libraries.ly.img.templates.ly.img.template.premium1.professional.label':
          'Professional',
        'libraries.ly.img.templates.ly.img.template.premium1.socials.label':
          'Socials'
      }
    },
    libraryPatch: {
      id: 'ly.img.templates',
      entry: {
        previewBackgroundType: 'contain',
        cardLabel: (asset) =>
          typeof asset.label === 'string' ? asset.label : asset.label?.en,
        cardLabelPosition: 'below',
        promptBeforeApply: false
      }
    }
  };
}

export function createFloralStickerCatalog(
  assetBaseURL: string
): EditorStickerCatalog {
  const assets: EditorCatalogAssetRecord[] = [];

  for (let i = 1; i <= 10; i++) {
    const paddedIndex = i.toString().padStart(2, '0');
    const fileName = `florals_${paddedIndex}.svg`;
    const uri = `${assetBaseURL}/${fileName}`;

    assets.push({
      id: `//ly.img.cesdk.stickers.florals/florals_${paddedIndex}`,
      groups: ['//ly.img.cesdk.stickers.florals/category/florals'],
      label: {
        en: `Floral ${i}`
      },
      uri,
      thumbUri: uri,
      tags: {},
      meta: {
        uri,
        thumbUri: uri,
        filename: fileName,
        kind: 'sticker',
        fillType: '//ly.img.ubq/fill/image',
        width: 2048,
        height: 2048
      }
    });
  }

  return {
    id: 'ly.img.sticker',
    assets,
    translations: {
      en: {
        'libraries.ly.img.sticker.florals.label': 'Florals'
      }
    }
  };
}

export function toEditorAssetDefinition(
  asset: EditorCatalogAssetRecord
): EditorAssetDefinition {
  return {
    id: asset.id,
    label: asset.label,
    groups: asset.groups,
    tags: asset.tags,
    meta: {
      ...asset.meta,
      uri: asset.uri,
      thumbUri: asset.thumbUri ?? asset.uri
    }
  };
}
