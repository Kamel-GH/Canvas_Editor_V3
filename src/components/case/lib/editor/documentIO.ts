export interface EditorDocumentIO {
  download(value: Blob | string, mimeType: string, filename: string): void;
  pickFile(accept: string): Promise<File | undefined>;
}

export function filenameForMimeType(
  mimeType: string,
  fallbackName: string
): string {
  const normalizedMimeType = mimeType.toLowerCase();
  const extensionByMimeType: Record<string, string> = {
    'application/zip': 'zip',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'text/plain': 'scene',
    'text/plain;charset=utf-8': 'scene'
  };

  return `${fallbackName}.${extensionByMimeType[normalizedMimeType] ?? 'bin'}`;
}

function downloadValue(
  value: Blob | string,
  mimeType: string,
  filename: string
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const blob =
    typeof value === 'string' ? new Blob([value], { type: mimeType }) : value;
  const objectURL = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectURL;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectURL);
  }, 0);
}

function pickFile(accept: string): Promise<File | undefined> {
  if (typeof document === 'undefined') {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = false;
    input.style.display = 'none';

    const cleanup = (): void => {
      window.removeEventListener('focus', handleFocus);
      input.remove();
    };

    const resolveWithFile = (): void => {
      const file = input.files?.[0];
      cleanup();
      resolve(file);
    };

    const handleFocus = (): void => {
      window.setTimeout(resolveWithFile, 0);
    };

    input.addEventListener('change', resolveWithFile, { once: true });
    window.addEventListener('focus', handleFocus, { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

export function createBrowserEditorDocumentIO(): EditorDocumentIO {
  return {
    download: downloadValue,
    pickFile
  };
}
