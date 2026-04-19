export type EditorShellConfig = {
  licenseKey: string;
  baseUrl: string;
};

export type EditorRuntimeConfig = {
  licenseKey: string;
  baseURL: string;
};

export function createEditorRuntimeConfig({
  licenseKey,
  baseUrl
}: EditorShellConfig): EditorRuntimeConfig {
  return {
    licenseKey,
    baseURL: baseUrl
  };
}

export function getEditorShellConfig(): EditorShellConfig {
  return {
    licenseKey: process.env.NEXT_PUBLIC_LICENSE ?? '',
    baseUrl: process.env.NEXT_PUBLIC_URL ?? ''
  };
}
