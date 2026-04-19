import '@cesdk/cesdk-js';

declare module '@cesdk/cesdk-js' {
  interface UserInterfaceAPI {
    setComponentOrder(
      options: {
        in: string;
        at?: 'top' | 'bottom';
        when?: {
          editMode?: string;
        };
      },
      order: readonly unknown[]
    ): void;
  }
}
