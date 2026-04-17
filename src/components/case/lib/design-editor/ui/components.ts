/**
 * Custom Components - Buttons, Panels, and UI Extensions
 *
 * Register custom UI components using the builder API.
 * Add custom buttons to the dock, navigation bar, or inspector bar.
 *
 * ## Component Registration
 *
 * - `cesdk.ui.registerComponent(id, renderFn)` - Register a custom component
 * - `cesdk.ui.registerPanel(id, renderFn)` - Register a custom panel
 *
 * ## Builder API
 *
 * The builder context provides methods to create UI elements:
 * - `builder.Button(id, options)` - Button
 * - `builder.ButtonGroup(id, options)` - Button group
 * - `builder.Checkbox(id, options)` - Checkbox
 * - `builder.ColorInput(id, options)` - Color picker
 * - `builder.Component(id, options)` - Embed another component
 * - `builder.Dropdown(id, options)` - Dropdown menu
 * - `builder.Heading(id, options)` - Heading text
 * - `builder.Library(id, options)` - Asset library
 * - `builder.MediaPreview(id, options)` - Media preview
 * - `builder.NumberInput(id, options)` - Number input
 * - `builder.Section(id, options)` - Section container
 * - `builder.Select(id, options)` - Dropdown select
 * - `builder.Separator(id)` - Visual separator
 * - `builder.Slider(id, options)` - Slider control
 * - `builder.Text(id, options)` - Text content
 * - `builder.TextArea(id, options)` - Multi-line text input
 * - `builder.TextInput(id, options)` - Single-line text input
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/register-new-component-b04a04/
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/create-custom-panel-d87b83/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

export const SHELL_CLOSE_COMPONENT_ID = 'canvas-editor.close.navigationBar';
export const SHELL_DOCUMENT_COMPONENT_ID =
  'canvas-editor.document.navigationBar';
export const SHELL_SAVE_COMPONENT_ID = 'canvas-editor.save.navigationBar';
export const SHELL_VARIABLES_DOCK_COMPONENT_ID =
  'canvas-editor.variables.dock';
export const SHELL_VARIABLES_PANEL_ID = 'canvas-editor.variables.panel';

function clearSelection(cesdk: CreativeEditorSDK): void {
  cesdk.engine.block.findAllSelected().forEach((blockId) => {
    cesdk.engine.block.setSelected(blockId, false);
  });
}

function toggleVariablesPanel(cesdk: CreativeEditorSDK): void {
  if (cesdk.ui.isPanelOpen(SHELL_VARIABLES_PANEL_ID)) {
    cesdk.ui.closePanel(SHELL_VARIABLES_PANEL_ID);
    return;
  }

  cesdk.ui.closePanel('*assetLibrary*');
  cesdk.ui.openPanel(SHELL_VARIABLES_PANEL_ID);
}

/**
 * Register and configure custom UI components.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupComponents(cesdk: CreativeEditorSDK): void {
  cesdk.ui.registerComponent(SHELL_CLOSE_COMPONENT_ID, ({ builder }) => {
    builder.Button('close-editor', {
      label: 'Close',
      variant: 'plain',
      onClick: () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          window.history.back();
          return;
        }

        cesdk.ui.showNotification('Close action is not wired to an app route yet.');
      }
    });
  });

  cesdk.ui.registerComponent(
    SHELL_DOCUMENT_COMPONENT_ID,
    ({ builder, engine }) => {
      const isDocumentMode = engine.block.findAllSelected().length === 0;

      builder.Button('document-mode', {
        label: 'Document',
        variant: isDocumentMode ? 'regular' : 'plain',
        isSelected: isDocumentMode,
        onClick: () => {
          clearSelection(cesdk);
          cesdk.ui.openPanel('//ly.img.panel/inspector');
        }
      });
    }
  );

  cesdk.ui.registerComponent(SHELL_SAVE_COMPONENT_ID, ({ builder }) => {
    builder.Button('save-scene', {
      label: 'Save',
      color: 'accent',
      variant: 'regular',
      onClick: () => {
        void cesdk.actions.run('saveScene');
      }
    });
  });

  cesdk.ui.registerComponent(
    SHELL_VARIABLES_DOCK_COMPONENT_ID,
    ({ builder }) => {
      const isVariablesPanelOpen = cesdk.ui.isPanelOpen(SHELL_VARIABLES_PANEL_ID);

      builder.Button('variables-dock', {
        label: 'Variables',
        icon: '@imgly/Library',
        variant: isVariablesPanelOpen ? 'regular' : 'plain',
        isSelected: isVariablesPanelOpen,
        onClick: () => {
          toggleVariablesPanel(cesdk);
        }
      });
    }
  );

  cesdk.ui.registerPanel(SHELL_VARIABLES_PANEL_ID, ({ builder }) => {
    builder.Section('variables-shell', {
      title: 'Variables',
      scrollable: true,
      children: () => {
        builder.Heading('variables-shell-heading', {
          content: 'Binding shell placeholder'
        });
        builder.Text('variables-shell-copy', {
          content:
            'This panel reserves the variables and binding surface required by the project framing.'
        });
        builder.Separator('variables-shell-separator');
        builder.Text('variables-shell-next-step', {
          content:
            'Phase 1 keeps this surface structural only. Real text and image bindings land in Phase 6.'
        });
      }
    });
  });
}
