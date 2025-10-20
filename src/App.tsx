// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BotBuilder from "./pages/BotBuilder";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback";
import DTraderPage from "./pages/DTraderPage";
import AnalysisPage from "./pages/analysis/AnalysisPage";
import FreeBots from "./pages/FreeBots";
import MarketAnalysis from "./pages/MarketAnalysis";
import CopyTrading from "./pages/CopyTrading";
import ChartPage from "./pages/ChartPage";
import TradingView from "./pages/TradingView";

function App(): ReactElement {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard - Shows different content based on auth state */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Public Tools that work without authentication */}
      <Route path="/bots" element={<FreeBots />} />

      {/* Protected Trading Routes - Require authentication */}
      <Route
        path="/bot-builder"
        element={
          <ProtectedRoute>
            <BotBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dtrader"
        element={
          <ProtectedRoute>
            <DTraderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <MarketAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/copy-trading"
        element={
          <ProtectedRoute>
            <CopyTrading />
          </ProtectedRoute>
        }
      />
      <Route
        path="/charts"
        element={
          <ProtectedRoute>
            <ChartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trading-view"
        element={
          <ProtectedRoute>
            <TradingView />
          </ProtectedRoute>
        }
      />

      <Route path="/auth/callback" element={<AuthCallback />} />
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
