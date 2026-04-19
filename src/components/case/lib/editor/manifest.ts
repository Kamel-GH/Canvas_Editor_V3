/**
 * Canonical editor manifest used by the design editor shell.
 *
 * The source manifest stays data-first and domain-oriented. A resolver maps the
 * semantic tokens into the CE.SDK ids consumed by the adapter layer.
 */

import {
  SHELL_CLOSE_COMPONENT_ID,
  SHELL_DOCUMENT_COMPONENT_ID,
  SHELL_SAVE_COMPONENT_ID,
  SHELL_VARIABLES_DOCK_COMPONENT_ID,
  SHELL_VARIABLES_PANEL_ID
} from '../design-editor/ui/components';

import type {
  EditorManifest,
  EditorManifestSpec,
  EditorPanelPlacement,
  EditorResolvedManifest,
  EditorSettingEntry,
  EditorUiSurfaces
} from './types';

export type {
  EditorManifest,
  EditorManifestSpec,
  EditorPanelPlacement,
  EditorSettingEntry,
  EditorUiSurfaces
} from './types';

export const editorUiSurfaces = {
  navigationBar: 'ly.img.navigation.bar',
  dock: 'ly.img.dock',
  canvasBar: 'ly.img.canvas.bar',
  canvasMenu: 'ly.img.canvas.menu',
  inspectorBar: 'ly.img.inspector.bar',
  assetLibraryDock: 'ly.img.assetLibrary.dock'
} as const;

type ManifestOrderItem = EditorManifestSpec['ui']['navigation']['order'][number];
type ManifestAssetLibraryEntry =
  EditorManifestSpec['content']['assets']['libraries'][number];
type ManifestSettingEntry =
  EditorManifestSpec['behavior']['settings']['values'][number];
type ManifestUiSurfaces = EditorManifestSpec['ui']['surfaces'];
type ManifestPanelPlacement = EditorPanelPlacement;

const semanticIds = {
  surface: {
    navigationBar: 'surface.navigationBar',
    dock: 'surface.dock',
    canvasBar: 'surface.canvasBar',
    canvasMenu: 'surface.canvasMenu',
    inspectorBar: 'surface.inspectorBar',
    assetLibraryDock: 'surface.assetLibraryDock'
  },
  shell: {
    closeButton: 'shell.closeButton',
    documentButton: 'shell.documentButton',
    saveButton: 'shell.saveButton',
    variablesDockEntry: 'shell.variablesDockEntry',
    variablesPanel: 'shell.variablesPanel'
  },
  layout: {
    separator: 'layout.separator',
    spacer: 'layout.spacer'
  },
  navigation: {
    undoRedo: 'navigation.undoRedo',
    title: 'navigation.title',
    zoom: 'navigation.zoom'
  },
  canvas: {
    pageAdd: 'canvas.pageAdd',
    groupEnter: 'canvas.group.enter',
    groupSelect: 'canvas.group.select',
    pageMoveUp: 'canvas.page.moveUp',
    pageMoveDown: 'canvas.page.moveDown',
    textEdit: 'canvas.text.edit',
    replace: 'canvas.text.replace',
    flipX: 'canvas.transform.flipX',
    flipY: 'canvas.transform.flipY',
    bringForward: 'canvas.layer.bringForward',
    sendBackward: 'canvas.layer.sendBackward',
    copy: 'canvas.clipboard.copy',
    paste: 'canvas.clipboard.paste',
    duplicate: 'canvas.clipboard.duplicate',
    delete: 'canvas.clipboard.delete',
    options: 'canvas.options',
    textColor: 'canvas.text.color',
    textBold: 'canvas.text.bold',
    textItalic: 'canvas.text.italic',
    textVariables: 'canvas.text.variables'
  },
  inspector: {
    videoCaption: 'inspector.video.caption',
    shapeOptions: 'inspector.shape.options',
    cutoutType: 'inspector.cutout.type',
    cutoutOffset: 'inspector.cutout.offset',
    cutoutSmoothing: 'inspector.cutout.smoothing',
    groupCreate: 'inspector.group.create',
    groupUngroup: 'inspector.group.ungroup',
    audioReplace: 'inspector.audio.replace',
    textTypeFace: 'inspector.text.typeFace',
    textStyle: 'inspector.text.style',
    textBold: 'inspector.text.bold',
    textItalic: 'inspector.text.italic',
    textFontSize: 'inspector.text.fontSize',
    textAlignHorizontal: 'inspector.text.alignHorizontal',
    textAdvanced: 'inspector.text.advanced',
    combine: 'inspector.combine',
    fill: 'inspector.fill',
    trim: 'inspector.trim',
    volume: 'inspector.volume',
    crop: 'inspector.crop',
    stroke: 'inspector.stroke',
    textBackground: 'inspector.text.background',
    animations: 'inspector.animations',
    eject: 'inspector.eject'
  },
  asset: {
    templates: 'asset.templates',
    elements: 'asset.elements',
    uploads: 'asset.uploads',
    image: 'asset.image',
    text: 'asset.text',
    shapes: 'asset.shapes',
    stickers: 'asset.stickers',
    imageUpload: 'asset.imageUpload'
  },
  panel: {
    localAssets: 'panel.localAssets',
    globalAssets: 'panel.globalAssets',
    uploads: 'panel.uploads',
    templates: 'panel.templates'
  },
  feature: {
    navigation: 'feature.navigation',
    text: 'feature.text',
    crop: 'feature.crop',
    transform: 'feature.transform',
    effects: 'feature.effects',
    dock: 'feature.dock',
    library: 'feature.library'
  },
  setting: {
    cropDoubleClickAction: 'setting.crop.doubleClickAction',
    cropAspectRatioLock: 'setting.crop.aspectRatioLock',
    pageEnable: 'setting.page.enable',
    placeholderOverlayOpacity: 'setting.placeholderOverlay.opacity'
  },
  copy: {
    templatesLabel: 'copy.templatesLabel',
    uploadsLabel: 'copy.uploadsLabel',
    imagesLabel: 'copy.imagesLabel',
    textLabel: 'copy.textLabel',
    shapesLabel: 'copy.shapesLabel',
    stickersLabel: 'copy.stickersLabel',
    elementsLabel: 'copy.elementsLabel',
    closeLabel: 'copy.closeLabel',
    documentLabel: 'copy.documentLabel',
    saveLabel: 'copy.saveLabel',
    variablesTitle: 'copy.variablesTitle',
    variablesDescription: 'copy.variablesDescription',
    variablesEmpty: 'copy.variablesEmpty'
  }
} as const;

const tokenToResolvedId: Record<string, string> = {
  [semanticIds.surface.navigationBar]: editorUiSurfaces.navigationBar,
  [semanticIds.surface.dock]: editorUiSurfaces.dock,
  [semanticIds.surface.canvasBar]: editorUiSurfaces.canvasBar,
  [semanticIds.surface.canvasMenu]: editorUiSurfaces.canvasMenu,
  [semanticIds.surface.inspectorBar]: editorUiSurfaces.inspectorBar,
  [semanticIds.surface.assetLibraryDock]: editorUiSurfaces.assetLibraryDock,

  [semanticIds.shell.closeButton]: SHELL_CLOSE_COMPONENT_ID,
  [semanticIds.shell.documentButton]: SHELL_DOCUMENT_COMPONENT_ID,
  [semanticIds.shell.saveButton]: SHELL_SAVE_COMPONENT_ID,
  [semanticIds.shell.variablesDockEntry]: SHELL_VARIABLES_DOCK_COMPONENT_ID,
  [semanticIds.shell.variablesPanel]: SHELL_VARIABLES_PANEL_ID,

  [semanticIds.layout.separator]: 'ly.img.separator',
  [semanticIds.layout.spacer]: 'ly.img.spacer',

  [semanticIds.navigation.undoRedo]: 'ly.img.undoRedo.navigationBar',
  [semanticIds.navigation.title]: 'ly.img.title.navigationBar',
  [semanticIds.navigation.zoom]: 'ly.img.zoom.navigationBar',

  [semanticIds.canvas.pageAdd]: 'ly.img.page.add.canvasBar',
  [semanticIds.canvas.groupEnter]: 'ly.img.group.enter.canvasMenu',
  [semanticIds.canvas.groupSelect]: 'ly.img.group.select.canvasMenu',
  [semanticIds.canvas.pageMoveUp]: 'ly.img.page.moveUp.canvasMenu',
  [semanticIds.canvas.pageMoveDown]: 'ly.img.page.moveDown.canvasMenu',
  [semanticIds.canvas.textEdit]: 'ly.img.text.edit.canvasMenu',
  [semanticIds.canvas.replace]: 'ly.img.replace.canvasMenu',
  [semanticIds.canvas.flipX]: 'ly.img.flipX.canvasMenu',
  [semanticIds.canvas.flipY]: 'ly.img.flipY.canvasMenu',
  [semanticIds.canvas.bringForward]: 'ly.img.bringForward.canvasMenu',
  [semanticIds.canvas.sendBackward]: 'ly.img.sendBackward.canvasMenu',
  [semanticIds.canvas.copy]: 'ly.img.copy.canvasMenu',
  [semanticIds.canvas.paste]: 'ly.img.paste.canvasMenu',
  [semanticIds.canvas.duplicate]: 'ly.img.duplicate.canvasMenu',
  [semanticIds.canvas.delete]: 'ly.img.delete.canvasMenu',
  [semanticIds.canvas.options]: 'ly.img.options.canvasMenu',
  [semanticIds.canvas.textColor]: 'ly.img.text.color.canvasMenu',
  [semanticIds.canvas.textBold]: 'ly.img.text.bold.canvasMenu',
  [semanticIds.canvas.textItalic]: 'ly.img.text.italic.canvasMenu',
  [semanticIds.canvas.textVariables]: 'ly.img.text.variables.canvasMenu',

  [semanticIds.inspector.videoCaption]: 'ly.img.video.caption.inspectorBar',
  [semanticIds.inspector.shapeOptions]: 'ly.img.shape.options.inspectorBar',
  [semanticIds.inspector.cutoutType]: 'ly.img.cutout.type.inspectorBar',
  [semanticIds.inspector.cutoutOffset]: 'ly.img.cutout.offset.inspectorBar',
  [semanticIds.inspector.cutoutSmoothing]: 'ly.img.cutout.smoothing.inspectorBar',
  [semanticIds.inspector.groupCreate]: 'ly.img.group.create.inspectorBar',
  [semanticIds.inspector.groupUngroup]: 'ly.img.group.ungroup.inspectorBar',
  [semanticIds.inspector.audioReplace]: 'ly.img.audio.replace.inspectorBar',
  [semanticIds.inspector.textTypeFace]: 'ly.img.text.typeFace.inspectorBar',
  [semanticIds.inspector.textStyle]: 'ly.img.text.style.inspectorBar',
  [semanticIds.inspector.textBold]: 'ly.img.text.bold.inspectorBar',
  [semanticIds.inspector.textItalic]: 'ly.img.text.italic.inspectorBar',
  [semanticIds.inspector.textFontSize]: 'ly.img.text.fontSize.inspectorBar',
  [semanticIds.inspector.textAlignHorizontal]:
    'ly.img.text.alignHorizontal.inspectorBar',
  [semanticIds.inspector.textAdvanced]: 'ly.img.text.advanced.inspectorBar',
  [semanticIds.inspector.combine]: 'ly.img.combine.inspectorBar',
  [semanticIds.inspector.fill]: 'ly.img.fill.inspectorBar',
  [semanticIds.inspector.trim]: 'ly.img.trim.inspectorBar',
  [semanticIds.inspector.volume]: 'ly.img.volume.inspectorBar',
  [semanticIds.inspector.crop]: 'ly.img.crop.inspectorBar',
  [semanticIds.inspector.stroke]: 'ly.img.stroke.inspectorBar',
  [semanticIds.inspector.textBackground]: 'ly.img.text.background.inspectorBar',
  [semanticIds.inspector.animations]: 'ly.img.animations.inspectorBar',
  [semanticIds.inspector.eject]: 'ly.img.eject.inspectorBar',

  [semanticIds.asset.templates]: 'ly.img.templates',
  [semanticIds.asset.elements]: 'ly.img.elements',
  [semanticIds.asset.uploads]: 'ly.img.upload',
  [semanticIds.asset.image]: 'ly.img.image',
  [semanticIds.asset.text]: 'ly.img.text',
  [semanticIds.asset.shapes]: 'ly.img.vector.shape',
  [semanticIds.asset.stickers]: 'ly.img.sticker',
  [semanticIds.asset.imageUpload]: 'ly.img.image.upload',

  [semanticIds.panel.localAssets]: 'ly.img.assetLibrary.local',
  [semanticIds.panel.globalAssets]: 'ly.img.assetLibrary.global',
  [semanticIds.panel.uploads]: 'ly.img.assetLibrary.uploads',
  [semanticIds.panel.templates]: 'ly.img.assetLibrary.templates',

  [semanticIds.feature.navigation]: 'ly.img.feature.navigation',
  [semanticIds.feature.text]: 'ly.img.feature.text',
  [semanticIds.feature.crop]: 'ly.img.feature.crop',
  [semanticIds.feature.transform]: 'ly.img.feature.transform',
  [semanticIds.feature.effects]: 'ly.img.feature.effects',
  [semanticIds.feature.dock]: 'ly.img.feature.dock',
  [semanticIds.feature.library]: 'ly.img.feature.library',

  [semanticIds.setting.cropDoubleClickAction]: 'ly.img.view.crop.doubleClickAction',
  [semanticIds.setting.cropAspectRatioLock]: 'ly.img.view.crop.aspectRatioLock',
  [semanticIds.setting.pageEnable]: 'ly.img.page.enable',
  [semanticIds.setting.placeholderOverlayOpacity]:
    'ly.img.view.placeholderOverlay.opacity',

  [semanticIds.copy.templatesLabel]: 'libraries.ly.img.templates.label',
  [semanticIds.copy.uploadsLabel]: 'libraries.ly.img.upload.label',
  [semanticIds.copy.imagesLabel]: 'libraries.ly.img.image.label',
  [semanticIds.copy.textLabel]: 'libraries.ly.img.text.label',
  [semanticIds.copy.shapesLabel]: 'libraries.ly.img.vector.shape.label',
  [semanticIds.copy.stickersLabel]: 'libraries.ly.img.sticker.label',
  [semanticIds.copy.elementsLabel]: 'component.library.elements',
  [semanticIds.copy.closeLabel]: 'component.button.close',
  [semanticIds.copy.documentLabel]: 'component.button.document',
  [semanticIds.copy.saveLabel]: 'component.button.save',
  [semanticIds.copy.variablesTitle]: 'component.panel.variables.title',
  [semanticIds.copy.variablesDescription]:
    'component.panel.variables.description',
  [semanticIds.copy.variablesEmpty]: 'component.panel.variables.empty'
};

export const editorManifestSpec = {
  ui: {
    surfaces: {
      navigationBar: semanticIds.surface.navigationBar,
      dock: semanticIds.surface.dock,
      canvasBar: semanticIds.surface.canvasBar,
      canvasMenu: semanticIds.surface.canvasMenu,
      inspectorBar: semanticIds.surface.inspectorBar,
      assetLibraryDock: semanticIds.surface.assetLibraryDock
    },
    navigation: {
      order: [
        semanticIds.shell.closeButton,
        semanticIds.shell.documentButton,
        semanticIds.layout.separator,
        semanticIds.navigation.undoRedo,
        semanticIds.layout.spacer,
        semanticIds.navigation.title,
        semanticIds.layout.spacer,
        semanticIds.navigation.zoom,
        semanticIds.shell.saveButton
      ]
    },
    dock: {
      customEntries: [semanticIds.shell.variablesDockEntry]
    },
    canvas: {
      barPosition: 'bottom',
      barOrder: [
        semanticIds.layout.spacer,
        semanticIds.canvas.pageAdd,
        semanticIds.layout.spacer
      ],
      transformMenuOrder: [
        semanticIds.canvas.groupEnter,
        semanticIds.canvas.groupSelect,
        semanticIds.canvas.pageMoveUp,
        semanticIds.canvas.pageMoveDown,
        semanticIds.layout.separator,
        semanticIds.canvas.textEdit,
        semanticIds.canvas.replace,
        semanticIds.canvas.flipX,
        semanticIds.canvas.flipY,
        semanticIds.layout.separator,
        semanticIds.canvas.bringForward,
        semanticIds.canvas.sendBackward,
        semanticIds.layout.separator,
        semanticIds.canvas.copy,
        semanticIds.canvas.paste,
        semanticIds.layout.separator,
        semanticIds.canvas.duplicate,
        semanticIds.canvas.delete,
        semanticIds.layout.separator,
        semanticIds.canvas.options
      ],
      textMenuOrder: [
        semanticIds.canvas.textColor,
        semanticIds.layout.separator,
        semanticIds.canvas.textBold,
        semanticIds.canvas.textItalic,
        semanticIds.layout.separator,
        semanticIds.canvas.textVariables
      ]
    },
    inspector: {
      transformBarOrder: [
        semanticIds.layout.spacer,
        semanticIds.inspector.videoCaption,
        semanticIds.inspector.shapeOptions,
        semanticIds.inspector.cutoutType,
        semanticIds.inspector.cutoutOffset,
        semanticIds.inspector.cutoutSmoothing,
        semanticIds.inspector.groupCreate,
        semanticIds.inspector.groupUngroup,
        semanticIds.inspector.audioReplace,
        semanticIds.layout.separator,
        semanticIds.inspector.textTypeFace,
        semanticIds.inspector.textStyle,
        semanticIds.inspector.textBold,
        semanticIds.inspector.textItalic,
        semanticIds.inspector.textFontSize,
        semanticIds.inspector.textAlignHorizontal,
        semanticIds.inspector.textAdvanced,
        semanticIds.inspector.combine,
        semanticIds.layout.separator,
        semanticIds.inspector.fill,
        semanticIds.inspector.trim,
        semanticIds.inspector.volume,
        semanticIds.inspector.crop,
        semanticIds.layout.separator,
        semanticIds.inspector.stroke,
        semanticIds.layout.separator,
        semanticIds.inspector.textBackground,
        semanticIds.layout.separator,
        semanticIds.inspector.animations,
        semanticIds.layout.separator,
        semanticIds.inspector.eject
      ],
      textBarOrder: [
        semanticIds.inspector.textTypeFace,
        semanticIds.inspector.textStyle,
        semanticIds.inspector.textBold,
        semanticIds.inspector.textItalic,
        semanticIds.inspector.textFontSize,
        semanticIds.inspector.textAlignHorizontal,
        semanticIds.layout.separator,
        semanticIds.inspector.textAdvanced
      ],
      trimBarOrder: [semanticIds.layout.separator, semanticIds.inspector.trim],
      cropBarOrder: [semanticIds.layout.separator, semanticIds.inspector.crop]
    },
    panels: {
      placements: [
        {
          id: semanticIds.shell.variablesPanel,
          position: 'right',
          floating: false
        },
        {
          id: semanticIds.panel.localAssets,
          position: 'left',
          floating: false
        },
        {
          id: semanticIds.panel.globalAssets,
          position: 'left',
          floating: false
        },
        {
          id: semanticIds.panel.uploads,
          position: 'left',
          floating: false
        },
        {
          id: semanticIds.panel.templates,
          position: 'left',
          floating: false
        }
      ]
    }
  },
  content: {
    assets: {
      libraries: [
        {
          id: semanticIds.surface.assetLibraryDock,
          key: semanticIds.asset.templates,
          icon: '@imgly/Template',
          label: semanticIds.copy.templatesLabel,
          entries: [semanticIds.asset.templates]
        },
        {
          id: semanticIds.surface.assetLibraryDock,
          key: semanticIds.asset.elements,
          icon: '@imgly/Library',
          label: semanticIds.copy.elementsLabel,
          entries: [
            semanticIds.asset.image,
            semanticIds.asset.text,
            semanticIds.asset.shapes,
            semanticIds.asset.stickers
          ]
        },
        {
          id: semanticIds.surface.assetLibraryDock,
          key: semanticIds.asset.uploads,
          icon: '@imgly/Upload',
          label: semanticIds.copy.uploadsLabel,
          entries: [semanticIds.asset.uploads]
        },
        {
          id: semanticIds.surface.assetLibraryDock,
          key: semanticIds.asset.image,
          icon: '@imgly/Image',
          label: semanticIds.copy.imagesLabel,
          entries: [
            semanticIds.asset.image,
            semanticIds.asset.imageUpload
          ]
        },
        {
          id: semanticIds.surface.assetLibraryDock,
          key: semanticIds.asset.text,
          icon: '@imgly/Text',
          label: semanticIds.copy.textLabel,
          entries: [semanticIds.asset.text]
        },
        {
          id: semanticIds.surface.assetLibraryDock,
          key: semanticIds.asset.shapes,
          icon: '@imgly/Shapes',
          label: semanticIds.copy.shapesLabel,
          entries: [semanticIds.asset.shapes]
        },
        {
          id: semanticIds.surface.assetLibraryDock,
          key: semanticIds.asset.stickers,
          icon: '@imgly/Sticker',
          label: semanticIds.copy.stickersLabel,
          entries: [semanticIds.asset.stickers]
        }
      ]
    }
  },
  behavior: {
    features: {
      enabled: [
        semanticIds.feature.navigation,
        semanticIds.feature.text,
        semanticIds.feature.crop,
        semanticIds.feature.transform,
        semanticIds.feature.effects,
        semanticIds.feature.dock,
        semanticIds.feature.library
      ]
    },
    settings: {
      values: [
        { key: semanticIds.setting.cropDoubleClickAction, value: 'select' },
        { key: semanticIds.setting.cropAspectRatioLock, value: false },
        { key: semanticIds.setting.pageEnable, value: true },
        { key: semanticIds.setting.placeholderOverlayOpacity, value: 0.5 }
      ] satisfies readonly ManifestSettingEntry[]
    },
    translations: {
      en: {
        [semanticIds.copy.templatesLabel]: 'Templates',
        [semanticIds.copy.uploadsLabel]: 'Uploads',
        [semanticIds.copy.imagesLabel]: 'Images',
        [semanticIds.copy.textLabel]: 'Text',
        [semanticIds.copy.shapesLabel]: 'Shapes',
        [semanticIds.copy.stickersLabel]: 'Stickers',
        [semanticIds.copy.elementsLabel]: 'Elements',
        [semanticIds.copy.closeLabel]: 'Close',
        [semanticIds.copy.documentLabel]: 'Document',
        [semanticIds.copy.saveLabel]: 'Save',
        [semanticIds.copy.variablesTitle]: 'Variables',
        [semanticIds.copy.variablesDescription]:
          'Connect template fields to your data model.',
        [semanticIds.copy.variablesEmpty]:
          'No variables are configured for this document.'
      }
    }
  }
} satisfies EditorManifestSpec;

function resolveToken(token: string): string {
  return tokenToResolvedId[token] ?? token;
}

function resolveOrderItem(item: ManifestOrderItem): ManifestOrderItem {
  if (typeof item === 'string') {
    return resolveToken(item);
  }

  return {
    id: resolveToken(item.id),
    children: item.children.map(resolveToken)
  };
}

function resolveSurfaceIds(surfaces: ManifestUiSurfaces): EditorUiSurfaces {
  return {
    navigationBar: resolveToken(surfaces.navigationBar),
    dock: resolveToken(surfaces.dock),
    canvasBar: resolveToken(surfaces.canvasBar),
    canvasMenu: resolveToken(surfaces.canvasMenu),
    inspectorBar: resolveToken(surfaces.inspectorBar),
    assetLibraryDock: resolveToken(surfaces.assetLibraryDock)
  };
}

function resolveSettingEntry(entry: ManifestSettingEntry): EditorSettingEntry {
  return {
    key: resolveToken(entry.key),
    value: entry.value
  };
}

function resolveAssetLibraryEntry(
  entry: ManifestAssetLibraryEntry
): EditorResolvedManifest['content']['assets']['libraries'][number] {
  return {
    id: resolveToken(entry.id),
    key: resolveToken(entry.key),
    icon: entry.icon,
    label: resolveToken(entry.label),
    entries: entry.entries.map(resolveToken)
  };
}

function resolvePanelPlacement(
  placement: ManifestPanelPlacement
): EditorPanelPlacement {
  return {
    id: resolveToken(placement.id),
    position: placement.position,
    floating: placement.floating
  };
}

function resolveTranslations(
  translations: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(translations).map(([key, value]) => [resolveToken(key), value])
  );
}

export function resolveEditorManifest(
  manifest: EditorManifest = editorManifestSpec
): EditorResolvedManifest {
  return {
    ui: {
      surfaces: resolveSurfaceIds(manifest.ui.surfaces),
      navigation: {
        order: manifest.ui.navigation.order.map(resolveOrderItem)
      },
      dock: {
        customEntries: manifest.ui.dock.customEntries.map(resolveToken)
      },
      canvas: {
        barPosition: manifest.ui.canvas.barPosition,
        barOrder: manifest.ui.canvas.barOrder.map(resolveOrderItem),
        transformMenuOrder: manifest.ui.canvas.transformMenuOrder.map(
          resolveOrderItem
        ),
        textMenuOrder: manifest.ui.canvas.textMenuOrder.map(resolveOrderItem)
      },
      inspector: {
        transformBarOrder: manifest.ui.inspector.transformBarOrder.map(
          resolveOrderItem
        ),
        textBarOrder: manifest.ui.inspector.textBarOrder.map(resolveOrderItem),
        trimBarOrder: manifest.ui.inspector.trimBarOrder.map(resolveOrderItem),
        cropBarOrder: manifest.ui.inspector.cropBarOrder.map(resolveOrderItem)
      },
      panels: {
        placements: manifest.ui.panels.placements.map(resolvePanelPlacement)
      }
    },
    content: {
      assets: {
        libraries: manifest.content.assets.libraries.map(resolveAssetLibraryEntry)
      }
    },
    behavior: {
      features: {
        enabled: manifest.behavior.features.enabled.map(resolveToken)
      },
      settings: {
        values: manifest.behavior.settings.values.map(resolveSettingEntry)
      },
      translations: {
        en: resolveTranslations(manifest.behavior.translations.en)
      }
    }
  };
}

export const editorManifest: EditorManifest = editorManifestSpec;
