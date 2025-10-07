import React, { useState } from "react";
import DerivChartView from "./DerivChartView";
import TradingViewChart from "./TradingViewChart";
import { Button } from "@/components/ui/button";

const ChartSwitcher: React.FC = () => {
  const [view, setView] = useState<"deriv" | "tradingview">("deriv");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          {view === "deriv" ? "Deriv Smart Chart" : "TradingView Chart"}
        </h1>

        <div className="flex gap-3">
          <Button
            variant={view === "deriv" ? "default" : "outline"}
            onClick={() => setView("deriv")}
          >
            Deriv Chart
          </Button>
          <Button
            variant={view === "tradingview" ? "default" : "outline"}
            onClick={() => setView("tradingview")}
          >
            TradingView
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </Button>
        </div>
      </div>

      {view === "deriv" ? (
        <DerivChartView theme={theme} />
      ) : (
        <TradingViewChart theme={theme} />
      )}
    </div>
  );
};

export default ChartSwitcher;
