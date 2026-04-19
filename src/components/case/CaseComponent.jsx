"use client";

import { useCallback, useMemo, useState } from "react";

import CreativeEditor from "./lib/CreativeEditor";
import { createEditorRuntimeConfig, getEditorShellConfig } from "./lib/editor";

const CaseComponent = ({
  wrapperClassName = "editorShellWrapperStyle",
  surfaceClassName = "editorShellSurfaceStyle",
} = {}) => {
  const [engineError, setEngineError] = useState("");
  const { licenseKey, baseUrl } = getEditorShellConfig();
  const handleEngineError = useCallback((error) => {
    setEngineError(error.message);
  }, []);

  const config = useMemo(
    () => createEditorRuntimeConfig({ licenseKey, baseUrl }),
    [baseUrl, licenseKey],
  );

  if (!licenseKey) {
    return (
      <div className={`${wrapperClassName} items-center justify-center p-6`}>
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Editor license is missing
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Add a valid <code>NEXT_PUBLIC_LICENSE</code> value to{" "}
            <code>.env</code>, restart the dev server, then refresh this page.
          </p>
        </div>
      </div>
    );
  }

  if (engineError) {
    return (
      <div className={`${wrapperClassName} items-center justify-center p-6`}>
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-rose-700">
            Editor engine could not be loaded
          </p>
          <p className="mt-2 text-sm text-slate-600">{engineError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <CreativeEditor
        className={surfaceClassName}
        config={config}
        onEngineError={handleEngineError}
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default CaseComponent;
