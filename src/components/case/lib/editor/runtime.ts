import type { EditorRuntimeConfig, EditorShell } from './types';

import { bootstrapEditorShell } from './bootstrap';

export interface EditorRuntimeOptions {
  container: HTMLDivElement;
  config: EditorRuntimeConfig;
  onEngineError?: (error: Error) => void;
  onInstanceChange?: (instance: EditorShell | undefined) => void;
}

export interface EditorRuntimeHandle {
  readonly ready: Promise<EditorShell | undefined>;
  dispose(): void;
}

export interface EditorRuntimeControllerOptions {
  container: HTMLDivElement | null;
  config: EditorRuntimeConfig;
  onEngineError?: (error: Error) => void;
  onInstanceChange?: (instance: EditorShell | undefined) => void;
}

export interface EditorRuntimeController {
  sync(options: EditorRuntimeControllerOptions): void;
  dispose(): void;
}

function getEditorRuntimeConfigSignature(config: EditorRuntimeConfig): string {
  return `${config.licenseKey}\u0000${config.baseURL}`;
}

function normalizeEditorRuntimeError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function disposeRuntime(runtime: EditorRuntimeHandle | undefined): void {
  runtime?.dispose();
}

export function createEditorRuntime(
  options: EditorRuntimeOptions
): EditorRuntimeHandle {
  let disposed = false;
  let instance: EditorShell | undefined;

  const ready = (async () => {
    try {
      const shell = await bootstrapEditorShell({
        container: options.container,
        config: options.config
      });

      if (disposed) {
        shell.dispose();
        return undefined;
      }

      instance = shell;

      if (disposed) {
        instance = undefined;
        shell.dispose();
        options.onInstanceChange?.(undefined);
        return undefined;
      }

      options.onInstanceChange?.(shell);
      return shell;
    } catch (error) {
      const normalizedError = normalizeEditorRuntimeError(error);

      if (instance) {
        instance.dispose();
        instance = undefined;
      }

      if (!disposed) {
        options.onEngineError?.(normalizedError);
        options.onInstanceChange?.(undefined);
      }

      return undefined;
    }
  })();

  return {
    ready,
    dispose() {
      disposed = true;
      instance?.dispose();
      instance = undefined;
      options.onInstanceChange?.(undefined);
    }
  };
}

export const mountEditorRuntime = createEditorRuntime;

export function createEditorRuntimeController(): EditorRuntimeController {
  let disposed = false;
  let activeContainer: HTMLDivElement | null = null;
  let activeRuntime: EditorRuntimeHandle | undefined;
  let activeConfigSignature: string | undefined;
  let nextOptions: EditorRuntimeControllerOptions | undefined;

  const clearActiveRuntime = () => {
    activeRuntime = undefined;
    activeContainer = null;
    activeConfigSignature = undefined;
  };

  const startRuntime = (options: EditorRuntimeControllerOptions) => {
    const runtimeOptions = options;
    const runtime = createEditorRuntime({
      container: runtimeOptions.container as HTMLDivElement,
      config: runtimeOptions.config,
      onEngineError: (error) => {
        if (disposed || activeRuntime !== runtime) {
          return;
        }

        disposeRuntime(runtime);
        clearActiveRuntime();
        runtimeOptions.onEngineError?.(error);
      },
      onInstanceChange: (instance) => runtimeOptions.onInstanceChange?.(instance)
    });

    activeRuntime = runtime;
    activeContainer = runtimeOptions.container;
    activeConfigSignature = getEditorRuntimeConfigSignature(runtimeOptions.config);

    void runtime.ready.then((shell) => {
      if (disposed || activeRuntime !== runtime) {
        return;
      }

      if (!shell) {
        clearActiveRuntime();
      }
    });
  };

  const reconcile = () => {
    if (disposed || !nextOptions) {
      return;
    }

    if (!nextOptions.container) {
      disposeRuntime(activeRuntime);
      clearActiveRuntime();
      return;
    }

    const nextConfigSignature = getEditorRuntimeConfigSignature(nextOptions.config);
    const needsRestart =
      !activeRuntime ||
      activeContainer !== nextOptions.container ||
      activeConfigSignature !== nextConfigSignature;

    if (!needsRestart) {
      return;
    }

    disposeRuntime(activeRuntime);
    clearActiveRuntime();

    startRuntime({
      ...nextOptions,
      container: nextOptions.container
    });
  };

  return {
    sync(options) {
      nextOptions = options;
      reconcile();
    },
    dispose() {
      disposed = true;
      disposeRuntime(activeRuntime);
      clearActiveRuntime();
      nextOptions = undefined;
    }
  };
}
