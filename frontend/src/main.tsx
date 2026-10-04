import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { I18nProvider } from "./i18n";
import { DepthProvider } from "./state/depth";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <DepthProvider>
        <App />
      </DepthProvider>
    </I18nProvider>
  </StrictMode>,
);
