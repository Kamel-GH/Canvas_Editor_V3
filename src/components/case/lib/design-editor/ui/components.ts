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

import type { EditorManifest } from '../../editor/types';
import type { EditorActionController } from '../../editor';
import { createShellComponentCommands } from './commands';

export const SHELL_CLOSE_COMPONENT_ID = 'canvas-editor.close.navigationBar';
export const SHELL_DOCUMENT_COMPONENT_ID =
  'canvas-editor.document.navigationBar';
export const SHELL_SAVE_COMPONENT_ID = 'canvas-editor.save.navigationBar';
export const SHELL_VARIABLES_DOCK_COMPONENT_ID =
  'canvas-editor.variables.dock';
export const SHELL_VARIABLES_PANEL_ID = 'canvas-editor.variables.panel';

type ShellTranslations = EditorManifest['behavior']['translations']['en'];
type RegisterComponentHandler = Parameters<
  CreativeEditorSDK['ui']['registerComponent']
>[1];
type RegisterComponentContext = Parameters<RegisterComponentHandler>[0];
type RegisterComponentBuilder = RegisterComponentContext['builder'];

type ShellCopy = {
  close: string;
  document: string;
  save: string;
  variablesTitle: string;
  variablesDescription: string;
  variablesEmpty: string;
};

type ShellCopyKey = keyof ShellCopy;

const shellCopyMap: Record<ShellCopyKey, string> = {
  close: 'component.button.close',
  document: 'component.button.document',
  save: 'component.button.save',
  variablesTitle: 'component.panel.variables.title',
  variablesDescription: 'component.panel.variables.description',
  variablesEmpty: 'component.panel.variables.empty'
};

type ShellComponentRegistration = {
  id: string;
  register: (
    builder: RegisterComponentBuilder,
    commands: ReturnType<typeof createShellComponentCommands>,
    copy: ShellCopy
  ) => void;
};

function resolveShellCopy(translations: ShellTranslations): ShellCopy {
  return {
    close: translations[shellCopyMap.close] ?? 'Close',
    document: translations[shellCopyMap.document] ?? 'Document',
    save: translations[shellCopyMap.save] ?? 'Save',
    variablesTitle: translations[shellCopyMap.variablesTitle] ?? 'Variables',
    variablesDescription:
      translations[shellCopyMap.variablesDescription] ??
      'Connect template fields to your data model.',
    variablesEmpty:
      translations[shellCopyMap.variablesEmpty] ??
      'No variables are configured for this document.'
  };
}

/**
 * Register and configure custom UI components.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupComponents(
  cesdk: CreativeEditorSDK,
  translations: ShellTranslations,
  editorActions?: EditorActionController
): void {
  const commands = createShellComponentCommands(cesdk, editorActions);
  const copy = resolveShellCopy(translations);

  const registrations: readonly ShellComponentRegistration[] = [
    {
      id: SHELL_CLOSE_COMPONENT_ID,
      register(builder, shellCommands, shellCopy): void {
        builder.Button('close-editor', {
          label: shellCopy.close,
          variant: 'plain',
          onClick: shellCommands.closeEditor
        });
      }
    },
    {
      id: SHELL_DOCUMENT_COMPONENT_ID,
      register(builder, shellCommands, shellCopy): void {
        const isDocumentMode = shellCommands.isDocumentMode();

        builder.Button('document-mode', {
          label: shellCopy.document,
          variant: isDocumentMode ? 'regular' : 'plain',
          isSelected: isDocumentMode,
          onClick: shellCommands.openDocumentPanel
        });
      }
    },
    {
      id: SHELL_SAVE_COMPONENT_ID,
      register(builder, shellCommands, shellCopy): void {
        builder.Button('save-scene', {
          label: shellCopy.save,
          color: 'accent',
          variant: 'regular',
          onClick: () => {
            void shellCommands.saveDocument();
          }
        });
      }
    },
    {
      id: SHELL_VARIABLES_DOCK_COMPONENT_ID,
      register(builder, shellCommands, shellCopy): void {
        const isVariablesPanelOpen = shellCommands.isVariablesPanelOpen();

        builder.Button('variables-dock', {
          label: shellCopy.variablesTitle,
          icon: '@imgly/Library',
          variant: isVariablesPanelOpen ? 'regular' : 'plain',
          isSelected: isVariablesPanelOpen,
          onClick: shellCommands.toggleVariablesPanel
        });
      }
    }
  ];

  for (const registration of registrations) {
    cesdk.ui.registerComponent(registration.id, ({ builder }) => {
      registration.register(builder, commands, copy);
    });
  }

  cesdk.ui.registerPanel(SHELL_VARIABLES_PANEL_ID, ({ builder }) => {
    builder.Section('variables-shell', {
      title: copy.variablesTitle,
      scrollable: true,
      children: () => {
        builder.Heading('variables-shell-heading', {
          content: copy.variablesTitle
        });
        builder.Text('variables-shell-copy', {
          content: copy.variablesDescription
        });
        builder.Separator('variables-shell-separator');
        builder.Text('variables-shell-next-step', {
          content: copy.variablesEmpty
        });
      }
    });
  });
}
