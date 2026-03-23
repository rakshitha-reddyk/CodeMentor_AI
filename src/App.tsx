import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LearnPage from "./pages/Learn";
import LessonDetailPage from "./pages/LessonDetail";
import ChatPage from "./pages/Chat";
import PracticePage from "./pages/Practice";
import ProgressPage from "./pages/Progress";
import AnalyticsPage from "./pages/Analytics";
import SettingsPage from "./pages/Settings";
import ChallengePage from "./pages/Challenge";

const App = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/learn" element={<LearnPage />} />
    <Route path="/lesson/:id" element={<LessonDetailPage />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/practice" element={<PracticePage />} />
    <Route path="/progress" element={<ProgressPage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/challenge/:id" element={<ChallengePage />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
