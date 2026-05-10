import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layouts/AppLayout";
import { ProtectedRoute } from "./components/layouts/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LearnPage from "./pages/Learn";
import LessonDetailPage from "./pages/LessonDetail";
import PracticePage from "./pages/Practice";
import SettingsPage from "./pages/Settings";
import ChallengePage from "./pages/Challenge";

const App = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Index />} />

    {/* App Shell Routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/learn"
      element={
        <ProtectedRoute>
          <AppLayout>
            <LearnPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/practice"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PracticePage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />

    {/* Full Screen / Focus Routes */}
    <Route
      path="/lesson/:id"
      element={
        <ProtectedRoute>
          <LessonDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/challenge/:id"
      element={
        <ProtectedRoute>
          <ChallengePage />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
