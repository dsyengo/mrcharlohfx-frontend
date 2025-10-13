// stores/analytics.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TickData, DigitAnalysis, VolatilityMetrics } from "@/types/analytics";

interface AnalyticsState {
  // State
  ticks: TickData[];
  digitAnalysis: DigitAnalysis[];
  volatility: VolatilityMetrics;
  selectedMarket: string;
  selectedTradeType: string;

  // Actions
  addTick: (tick: TickData) => void;
  clearTicks: () => void;
  setMarket: (market: string) => void;
  setTradeType: (tradeType: string) => void;
  calculateAnalytics: () => void;
  exportData: (format: "csv" | "json") => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      // Initial state
      ticks: [],
      digitAnalysis: [],
      volatility: {
        currentVolatility: 0,
        averageVolatility: 0,
        volatilityTrend: "stable",
        tickVariance: 0,
      },
      selectedMarket: "R_100",
      selectedTradeType: "digits",

      // Add new tick and recalculate analytics
      addTick: (tick) => {
        set((state) => {
          const newTicks = [...state.ticks.slice(-999), tick]; // Keep last 1000 ticks
          return { ticks: newTicks };
        });
        get().calculateAnalytics();
      },

      clearTicks: () => set({ ticks: [], digitAnalysis: [] }),

      setMarket: (market) => set({ selectedMarket: market }),

      setTradeType: (tradeType) => set({ selectedTradeType: tradeType }),

      calculateAnalytics: () => {
        const { ticks } = get();

        if (ticks.length === 0) return;

        // Calculate digit frequency
        const digitCount: { [key: number]: number } = {};
        for (let i = 0; i <= 9; i++) {
          digitCount[i] = 0;
        }

        ticks.forEach((tick) => {
          const digit = tick.quote
            ? parseInt(tick.quote.toString().slice(-1))
            : 0;
          digitCount[digit]++;
        });

        const totalTicks = ticks.length;
        const digitAnalysis: DigitAnalysis[] = [];

        for (let i = 0; i <= 9; i++) {
          const frequency = digitCount[i];
          const percentage = (frequency / totalTicks) * 100;

          digitAnalysis.push({
            digit: i,
            frequency,
            percentage,
            lastSeen: 0, // Would calculate this
            streak: 0, // Would calculate this
            expectedValue: percentage * 10, // Simplified expected value
          });
        }

        // Calculate volatility (simplified)
        const quotes = ticks.map((t) => t.quote);
        const changes = [];
        for (let i = 1; i < quotes.length; i++) {
          changes.push(Math.abs(quotes[i] - quotes[i - 1]));
        }

        const currentVolatility =
          changes.length > 0
            ? changes.slice(-10).reduce((a, b) => a + b, 0) /
              Math.min(10, changes.length)
            : 0;

        const averageVolatility =
          changes.length > 0
            ? changes.reduce((a, b) => a + b, 0) / changes.length
            : 0;

        const volatility: VolatilityMetrics = {
          currentVolatility,
          averageVolatility,
          volatilityTrend:
            currentVolatility > averageVolatility
              ? "increasing"
              : currentVolatility < averageVolatility
              ? "decreasing"
              : "stable",
          tickVariance:
            changes.length > 0
              ? changes.reduce(
                  (a, b) => a + Math.pow(b - averageVolatility, 2),
                  0
                ) / changes.length
              : 0,
        };

        set({ digitAnalysis, volatility });
      },

      exportData: (format: "csv" | "json") => {
        const { ticks, digitAnalysis } = get();

        if (format === "csv") {
          // Generate CSV content
          let csvContent = "Timestamp,Quote,Digit\n";
          ticks.forEach((tick) => {
            const digit = tick.quote ? tick.quote.toString().slice(-1) : "";
            csvContent += `${new Date(tick.epoch * 1000).toISOString()},${
              tick.quote
            },${digit}\n`;
          });

          // Download CSV
          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `deriv-analytics-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          link.click();
        } else {
          // Generate JSON content
          const exportData = {
            metadata: {
              exportedAt: new Date().toISOString(),
              totalTicks: ticks.length,
              market: get().selectedMarket,
            },
            ticks: ticks,
            analytics: {
              digitAnalysis,
              volatility: get().volatility,
            },
          };

          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `deriv-analytics-${
            new Date().toISOString().split("T")[0]
          }.json`;
          link.click();
        }
      },
    }),
    {
      name: "deriv-analytics-storage",
      partialize: (state) => ({
        selectedMarket: state.selectedMarket,
        selectedTradeType: state.selectedTradeType,
      }),
    }
  )
);
