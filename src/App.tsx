import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BotBuilder from "./pages/BotBuilder";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback";

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
         <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
        }
      />
      <Route
        path="/bot-builder"
        element={
          <ProtectedRoute>
            <BotBuilder />
          </ProtectedRoute>
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;


