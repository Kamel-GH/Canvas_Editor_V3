'use client';

import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';

interface CreativeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Partial<Configuration>;
  configure?: (instance: CreativeEditorSDK) => Promise<void>;
  onInstanceChange?: (instance: CreativeEditorSDK | undefined) => void;
}

export default function CreativeEditor({
  config = undefined,
  configure = undefined,
  onInstanceChange = undefined,
  ...rest
}: CreativeEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let instance: CreativeEditorSDK | null = null;
    let cancelled = false;
    CreativeEditorSDK.create(container, config ?? {})
      .then(async (_instance) => {
        if (cancelled) {
          _instance.dispose();
          return;
        }

        instance = _instance;
        if (configure) {
          await configure(instance);
        }
        if (onInstanceChange) {
          onInstanceChange(instance);
        }
      })
      .catch((error) => {
        console.error('CreativeEditorSDK.create failed', error);
        if (onInstanceChange) {
          onInstanceChange(undefined);
        }
      });

    return () => {
      cancelled = true;
      instance?.dispose();
      instance = null;
      if (onInstanceChange) {
        onInstanceChange(undefined);
      }
    };
  }, [config, configure, onInstanceChange]);

  return <div ref={containerRef} {...rest} />;
}
