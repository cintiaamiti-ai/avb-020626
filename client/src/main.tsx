import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from "@/contexts/AppContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AccessibilityProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </AccessibilityProvider>
);
