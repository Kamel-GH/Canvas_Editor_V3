"use client";

import { useEffect, useRef } from "react";

import type {
  EditorRuntimeConfig,
  EditorRuntimeController,
  EditorShell,
} from "./editor";
import { createEditorRuntimeController } from "./editor";
import { useLatestRef } from "./editor/useLatestRef";

interface CreativeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  config: EditorRuntimeConfig;
  onEngineError?: (error: Error) => void;
  onInstanceChange?: (instance: EditorShell | undefined) => void;
}

export default function CreativeEditor({
  config,
  onEngineError,
  onInstanceChange,
  ...rest
}: CreativeEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const runtimeRef = useRef<EditorRuntimeController | null>(null);
  const onEngineErrorRef = useLatestRef(onEngineError);
  const onInstanceChangeRef = useLatestRef(onInstanceChange);

  if (!runtimeRef.current) {
    runtimeRef.current = createEditorRuntimeController();
  }

  useEffect(() => {
    const controller = runtimeRef.current;
    const container = containerRef.current;

    if (!controller || !container) return;

    controller.sync({
      container,
      config,
      onEngineError: (error) => onEngineErrorRef.current?.(error),
      onInstanceChange: (instance) => onInstanceChangeRef.current?.(instance),
    });
  }, [config, onEngineErrorRef, onInstanceChangeRef]);

  useEffect(() => {
    const controller = runtimeRef.current;

    return () => {
      controller?.dispose();
    };
  }, []);

  return <div ref={containerRef} {...rest} />;
}
