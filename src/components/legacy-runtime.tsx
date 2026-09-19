"use client";

import { useEffect } from "react";

export function LegacyRuntime({ page }: { page: string }) {
  useEffect(() => {
    document.body.dataset.page = page;

    if (document.querySelector("script[data-hype-site-data]")) return;

    const data = document.createElement("script");
    data.src = "/assets/js/site-data.js";
    data.dataset.hypeSiteData = "";
    data.onload = () => {
      const app = document.createElement("script");
      app.src = "/assets/js/app.js";
      app.dataset.hypeApp = "";
      document.body.appendChild(app);
    };
    document.body.appendChild(data);
  }, [page]);

  return null;
}
