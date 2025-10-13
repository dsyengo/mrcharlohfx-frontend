import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BotBuilder from "./pages/BotBuilder";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback";
// import ChartsTradingView from "../ChartsTradingView";
import DTraderPage from "./pages/DTraderPage";
import AnalysisPage from "./pages/analysis/AnalysisPage";
import FreeBots from "./pages/FreeBots";
import MarketAnalysis from "./pages/MarketAnalysis";
import CopyTrading from "./pages/CopyTrading";

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
      {/* <Route
        path="/charts"
        element={
         // <ProtectedRoute>
            <ChartsTradingView />
         // </ProtectedRoute>
        }
      /> */}
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
      <Route path="/bots" element={<FreeBots />} />

      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
