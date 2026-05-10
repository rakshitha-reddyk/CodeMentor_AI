import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./config/providers";

// Import health check (makes checkSupabaseHealth() available in console)
import "@/utils/supabaseHealthCheck";

// Initialize theme from localStorage on app startup
(() => {
  try {
    const savedTheme = localStorage.getItem("codementor_theme") as
      | "dark"
      | "light"
      | "system"
      | null;
    const theme = savedTheme || "dark";
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else if (theme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      // system mode
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        html.classList.add("dark");
        html.classList.remove("light");
      } else {
        html.classList.remove("dark");
        html.classList.add("light");
      }
    }
  } catch (e) {
    // ignore
  }
})();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>,
);
