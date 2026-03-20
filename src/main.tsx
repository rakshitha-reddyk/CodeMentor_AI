import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./config/providers";

// Import health check (makes checkSupabaseHealth() available in console)
import "@/utils/supabaseHealthCheck";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>,
);
