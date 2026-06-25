"use client";

import Script from "next/script";

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown };
    __taskflowVlibras?: boolean;
  }
}

export function VLibras() {
  function initialize() {
    if (window.VLibras && !window.__taskflowVlibras) {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
      window.__taskflowVlibras = true;
    }
  }

  return (
    <>
      <div {...{ vw: "true" }} className="enabled" aria-label="Tradutor VLibras">
        <div {...{ "vw-access-button": "true" }} className="active" />
        <div {...{ "vw-plugin-wrapper": "true" }}>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        id="vlibras-plugin"
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={initialize}
      />
    </>
  );
}
