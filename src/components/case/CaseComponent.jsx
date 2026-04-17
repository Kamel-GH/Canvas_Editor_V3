'use client';

import CreativeEditor from '@cesdk/cesdk-js/react';

import { DesignEditorConfig } from './lib/design-editor/plugin';

const CaseComponent = () => {
  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        config={{
          licenseKey: process.env.NEXT_PUBLIC_LICENSE ?? '',
          baseURL: process.env.NEXT_PUBLIC_URL ?? ''
        }}
        init={async (cesdk) => {
          await cesdk.addPlugin(new DesignEditorConfig());
          await cesdk.actions.run('scene.create');
        }}
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default CaseComponent;
