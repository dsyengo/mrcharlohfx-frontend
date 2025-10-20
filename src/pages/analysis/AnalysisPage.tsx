// pages/analysis/AnalysisPage.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@/layouts/Layout";
import MarketSelector from "./components/MarketSelector";
import LivePriceDisplay from "./components/LivePriceDisplay";
import DigitsVisualizer from "./components/DigitsVisualizer";
import MarketAnalysisCard from "./components/MarketAnalysisCard";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { useDerivApi } from "../../hooks/useDerivApi";

export interface MarketData {
  symbol: string;
  price: number;
  digit: number;
  isEven: boolean;
  isOver: boolean;
  timestamp: number;
  trend: "rise" | "fall" | "same";
  ask?: number;
  bid?: number;
}

export interface MarketAnalysis {
  digitDistribution: number[];
  evenOddDistribution: { even: number; odd: number };
  overUnderDistribution: { over: number; under: number };
  trendDistribution: { rise: number; fall: number; same: number };
  patternSequence: string[];
  trendSequence: string[];
  totalTicks: number;
  currentPrediction: string;
  marketInsight: string;
  averageTickInterval: number;
  volatility: number;
  confidence: number;
}

// Deriv Symbol Mapping
const DERIV_SYMBOL_MAP: { [key: string]: string } = {
  // Continuous Indices
  R_10: "Volatility 10 Index",
  R_25: "Volatility 25 Index",
  R_50: "Volatility 50 Index",
  R_75: "Volatility 75 Index",
  R_100: "Volatility 100 Index",
  "1HZ10V": "Volatility 10 (1s) Index",
  "1HZ25V": "Volatility 25 (1s) Index",
  "1HZ50V": "Volatility 50 (1s) Index",
  "1HZ75V": "Volatility 75 (1s) Index",
  "1HZ100V": "Volatility 100 (1s) Index",

  // Crash/Boom
  BOOM300: "Boom 300 Index",
  BOOM500: "Boom 500 Index",
  CRASH300: "Crash 300 Index",
  CRASH500: "Crash 500 Index",

  // Jump Indices
  JD10: "Jump 10 Index",
  JD25: "Jump 25 Index",
  JD50: "Jump 50 Index",
  JD75: "Jump 75 Index",
  JD100: "Jump 100 Index",
};

export default function AnalysisPage() {
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedVolatility, setSelectedVolatility] = useState("");
  const [tickCount, setTickCount] = useState(100);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [lastTickTime, setLastTickTime] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { subscribe, unsubscribe, isConnected, isConnecting } = useDerivApi();
  const previousPriceRef = useRef<number | null>(null);

  // Process incoming tick data with validation
  const processTickData = useCallback(
    (data: any) => {
      try {
        console.log("🔄 Processing tick data:", data);

        // Validate data structure
        if (!data || typeof data.price !== "number") {
          console.warn("⚠️ Invalid tick data received:", data);
          return;
        }

        const price = data.price;
        const digit = getLastDigit(price);
        const trend = getTrend(previousPriceRef.current, price);

        const newData: MarketData = {
          symbol: data.symbol || selectedVolatility,
          price: price,
          digit: digit,
          isEven: digit % 2 === 0,
          isOver: digit > 5,
          timestamp: data.timestamp || Date.now(),
          trend: trend,
          ask: data.ask,
          bid: data.bid,
        };

        console.log("✅ Processed market data:", newData);

        setCurrentPrice(price);
        previousPriceRef.current = price;
        setLastTickTime(Date.now());
        setConnectionError(null);

        // Update market data
        setMarketData((prev) => {
          const updated = [...prev, newData];
          return updated.slice(-tickCount);
        });
      } catch (error) {
        console.error("❌ Error processing tick data:", error);
        setConnectionError("Failed to process market data");
      }
    },
    [selectedVolatility, tickCount]
  );

  // Handle market selection and subscription
  useEffect(() => {
    if (selectedMarket && selectedVolatility) {
      console.log(
        `🎯 Starting analysis for ${selectedVolatility} - ${selectedMarket}`
      );

      // Reset data when changing symbols
      setMarketData([]);
      setCurrentPrice(null);
      previousPriceRef.current = null;
      setConnectionError(null);

      // Subscribe to market data
      if (isConnected) {
        subscribe(selectedVolatility, processTickData);
      }
    }

    return () => {
      if (selectedVolatility) {
        console.log(`🧹 Cleaning up subscription for ${selectedVolatility}`);
        unsubscribe();
      }
    };
  }, [
    selectedMarket,
    selectedVolatility,
    isConnected,
    subscribe,
    unsubscribe,
    processTickData,
  ]);

  // Calculate comprehensive analysis data
  const analysisData: MarketAnalysis = calculateMarketAnalysis(
    marketData,
    selectedMarket
  );

  // Get display name for symbol
  const getSymbolDisplayName = (symbol: string): string => {
    return DERIV_SYMBOL_MAP[symbol] || symbol;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Deriv Market Analysis
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time market data analysis and pattern recognition
            </p>
          </div>

          {/* Market Selection */}
          <MarketSelector
            selectedMarket={selectedMarket}
            selectedVolatility={selectedVolatility}
            tickCount={tickCount}
            onMarketChange={setSelectedMarket}
            onVolatilityChange={setSelectedVolatility}
            onTickCountChange={setTickCount}
          />

          {/* Connection Status */}
          <ConnectionStatus
            isConnected={isConnected}
            isConnecting={isConnecting}
            lastTickTime={lastTickTime}
            marketDataLength={marketData.length}
            error={connectionError}
          />

          {/* Error Display */}
          {connectionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Connection Error
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{connectionError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Display */}
          {selectedMarket && selectedVolatility ? (
            <>
              {/* Main Analysis Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Price */}
                <div className="lg:col-span-1">
                  <LivePriceDisplay
                    price={currentPrice}
                    symbol={getSymbolDisplayName(selectedVolatility)}
                    marketType={selectedMarket}
                    currentDigit={marketData[marketData.length - 1]?.digit}
                    isConnected={isConnected}
                    lastTickTime={lastTickTime}
                  />
                </div>

                {/* Digits Visualizer */}
                <div className="lg:col-span-1">
                  <DigitsVisualizer
                    marketData={marketData}
                    currentDigit={marketData[marketData.length - 1]?.digit}
                    marketType={selectedMarket}
                  />
                </div>

                {/* Analysis Card */}
                <div className="lg:col-span-1">
                  <MarketAnalysisCard
                    analysis={analysisData}
                    marketType={selectedMarket}
                    currentPrice={currentPrice}
                    isConnected={isConnected}
                  />
                </div>
              </div>

              {/* Market Statistics */}
              {marketData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Ticks"
                    value={marketData.length}
                    color="blue"
                  />
                  <StatCard
                    title="Even/Odd Ratio"
                    value={`${analysisData.evenOddDistribution.even.toFixed(
                      1
                    )}% / ${analysisData.evenOddDistribution.odd.toFixed(1)}%`}
                    color="green"
                  />
                  <StatCard
                    title="Data Quality"
                    value={`${analysisData.confidence.toFixed(1)}%`}
                    color="purple"
                  />
                  <StatCard
                    title="Last Update"
                    value={
                      lastTickTime
                        ? new Date(lastTickTime).toLocaleTimeString()
                        : "Never"
                    }
                    color="orange"
                  />
                </div>
              )}

              {/* Recent Ticks Table */}
              {marketData.length > 0 && (
                <RecentTicksTable
                  marketData={marketData}
                  tickCount={tickCount}
                />
              )}
            </>
          ) : (
            <WelcomeMessage
              isConnected={isConnected}
              isConnecting={isConnecting}
              hasError={!!connectionError}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

// Supporting Components
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <div className="text-sm font-medium opacity-80">{title}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

function RecentTicksTable({
  marketData,
  tickCount,
}: {
  marketData: MarketData[];
  tickCount: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Ticks ({marketData.length} total)
        </h3>
        <div className="text-sm text-gray-500">
          Analyzing last {tickCount} ticks
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-600">Time</th>
              <th className="text-left py-2 font-medium text-gray-600">
                Price
              </th>
              <th className="text-left py-2 font-medium text-gray-600">
                Digit
              </th>
              <th className="text-left py-2 font-medium text-gray-600">
                Even/Odd
              </th>
              <th className="text-left py-2 font-medium text-gray-600">
                Over/Under
              </th>
              <th className="text-left py-2 font-medium text-gray-600">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {[...marketData]
              .reverse()
              .slice(0, 10)
              .map((data, index) => (
                <TickRow key={`${data.timestamp}-${index}`} data={data} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TickRow({ data }: { data: MarketData }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-2 text-gray-600 font-mono text-xs">
        {new Date(data.timestamp).toLocaleTimeString()}
      </td>
      <td className="py-2 font-mono font-medium">{data.price.toFixed(3)}</td>
      <td className="py-2 text-center">
        <span className="font-mono font-bold text-blue-600 text-sm">
          {data.digit}
        </span>
      </td>
      <td className="py-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            data.isEven
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-orange-100 text-orange-800 border border-orange-200"
          }`}
        >
          {data.isEven ? "EVEN" : "ODD"}
        </span>
      </td>
      <td className="py-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            data.isOver
              ? "bg-purple-100 text-purple-800 border border-purple-200"
              : "bg-pink-100 text-pink-800 border border-pink-200"
          }`}
        >
          {data.isOver ? "OVER" : "UNDER"}
        </span>
      </td>
      <td className="py-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            data.trend === "rise"
              ? "bg-green-100 text-green-800 border border-green-200"
              : data.trend === "fall"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-gray-100 text-gray-800 border border-gray-200"
          }`}
        >
          {data.trend === "rise"
            ? "↑ RISE"
            : data.trend === "fall"
            ? "↓ FALL"
            : "→ SAME"}
        </span>
      </td>
    </tr>
  );
}

function WelcomeMessage({
  isConnected,
  isConnecting,
  hasError,
}: {
  isConnected: boolean;
  isConnecting: boolean;
  hasError: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>

      {hasError ? (
        <>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Connection Issue
          </h3>
          <p className="text-red-600 max-w-md mx-auto">
            There was a problem connecting to the market data feed. Please check
            your connection and try again.
          </p>
        </>
      ) : isConnecting ? (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connecting to Deriv API...
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Establishing secure connection to Deriv WebSocket API. This may take
            a few moments.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </>
      ) : isConnected ? (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select Market to Begin Analysis
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose a market type and volatility index from the options above to
            start real-time market analysis.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Waiting for Connection
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Please wait while we establish connection to the market data feed.
          </p>
        </>
      )}
    </div>
  );
}

// Utility Functions
function getLastDigit(price: number): number {
  const priceStr = price.toFixed(3);
  return parseInt(priceStr[priceStr.length - 1]);
}

function getTrend(
  prevPrice: number | null,
  currentPrice: number
): "rise" | "fall" | "same" {
  if (!prevPrice) return "same";
  if (currentPrice > prevPrice) return "rise";
  if (currentPrice < prevPrice) return "fall";
  return "same";
}

function calculateMarketAnalysis(
  marketData: MarketData[],
  marketType: string
): MarketAnalysis {
  if (marketData.length === 0) {
    return {
      digitDistribution: new Array(10).fill(0),
      evenOddDistribution: { even: 0, odd: 0 },
      overUnderDistribution: { over: 0, under: 0 },
      trendDistribution: { rise: 0, fall: 0, same: 0 },
      patternSequence: [],
      trendSequence: [],
      totalTicks: 0,
      currentPrediction: "Waiting for data...",
      marketInsight: "Collecting market data",
      averageTickInterval: 0,
      volatility: 0,
      confidence: 0,
    };
  }

  // Calculate distributions
  const digitDistribution = calculateDigitDistribution(marketData);
  const evenOddDistribution = calculateEvenOddDistribution(marketData);
  const overUnderDistribution = calculateOverUnderDistribution(marketData);
  const trendDistribution = calculateTrendDistribution(marketData);

  // Calculate advanced metrics
  const averageTickInterval = calculateAverageTickInterval(marketData);
  const volatility = calculateVolatility(marketData);
  const confidence = calculateConfidence(marketData, marketType);

  return {
    digitDistribution,
    evenOddDistribution,
    overUnderDistribution,
    trendDistribution,
    patternSequence: getPatternSequence(marketData),
    trendSequence: getTrendSequence(marketData),
    totalTicks: marketData.length,
    currentPrediction: getCurrentPrediction(marketData, marketType),
    marketInsight: getMarketInsight(marketData, marketType),
    averageTickInterval,
    volatility,
    confidence,
  };
}

function calculateDigitDistribution(marketData: MarketData[]): number[] {
  const distribution = new Array(10).fill(0);
  marketData.forEach((data) => {
    distribution[data.digit]++;
  });
  return distribution.map((count) => (count / marketData.length) * 100);
}

function calculateEvenOddDistribution(marketData: MarketData[]): {
  even: number;
  odd: number;
} {
  const evenCount = marketData.filter((data) => data.isEven).length;
  const oddCount = marketData.length - evenCount;
  return {
    even: (evenCount / marketData.length) * 100,
    odd: (oddCount / marketData.length) * 100,
  };
}

function calculateOverUnderDistribution(marketData: MarketData[]): {
  over: number;
  under: number;
} {
  const overCount = marketData.filter((data) => data.isOver).length;
  const underCount = marketData.length - overCount;
  return {
    over: (overCount / marketData.length) * 100,
    under: (underCount / marketData.length) * 100,
  };
}

function calculateTrendDistribution(marketData: MarketData[]): {
  rise: number;
  fall: number;
  same: number;
} {
  const riseCount = marketData.filter((data) => data.trend === "rise").length;
  const fallCount = marketData.filter((data) => data.trend === "fall").length;
  const sameCount = marketData.filter((data) => data.trend === "same").length;

  return {
    rise: (riseCount / marketData.length) * 100,
    fall: (fallCount / marketData.length) * 100,
    same: (sameCount / marketData.length) * 100,
  };
}

function calculateAverageTickInterval(marketData: MarketData[]): number {
  if (marketData.length < 2) return 0;

  let totalInterval = 0;
  for (let i = 1; i < marketData.length; i++) {
    totalInterval += marketData[i].timestamp - marketData[i - 1].timestamp;
  }

  return totalInterval / (marketData.length - 1);
}

function calculateVolatility(marketData: MarketData[]): number {
  if (marketData.length < 2) return 0;

  const prices = marketData.map((data) => data.price);
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const squaredDiffs = prices.map((price) => Math.pow(price - mean, 2));
  const variance =
    squaredDiffs.reduce((sum, diff) => sum + diff, 0) / prices.length;

  return Math.sqrt(variance);
}

function calculateConfidence(
  marketData: MarketData[],
  marketType: string
): number {
  if (marketData.length < 10)
    return Math.min((marketData.length / 10) * 100, 100);

  const recent = marketData.slice(-20);
  let confidence = 0;

  switch (marketType) {
    case "even_odd":
      const evenCount = recent.filter((data) => data.isEven).length;
      const evenPercentage = Math.abs((evenCount / recent.length) * 100 - 50);
      confidence = Math.min(evenPercentage * 2, 100);
      break;

    case "over_under":
      const overCount = recent.filter((data) => data.isOver).length;
      const overPercentage = Math.abs((overCount / recent.length) * 100 - 50);
      confidence = Math.min(overPercentage * 2, 100);
      break;

    case "rise_fall":
      const riseCount = recent.filter((data) => data.trend === "rise").length;
      const risePercentage = Math.abs((riseCount / recent.length) * 100 - 50);
      confidence = Math.min(risePercentage * 2, 100);
      break;

    default:
      confidence = Math.min(marketData.length, 100);
  }

  return Math.round(confidence);
}

function getPatternSequence(marketData: MarketData[]): string[] {
  return marketData.slice(-20).map((data) => (data.isEven ? "E" : "O"));
}

function getTrendSequence(marketData: MarketData[]): string[] {
  return marketData
    .slice(-10)
    .map((data) =>
      data.trend === "rise" ? "↑" : data.trend === "fall" ? "↓" : "→"
    );
}

function getCurrentPrediction(
  marketData: MarketData[],
  marketType: string
): string {
  if (marketData.length < 10) return "Collecting data...";

  const recent = marketData.slice(-20);

  switch (marketType) {
    case "even_odd":
      const evenCount = recent.filter((data) => data.isEven).length;
      const oddCount = recent.length - evenCount;
      const evenPercentage = (evenCount / recent.length) * 100;
      return evenCount > oddCount
        ? `Even (${evenPercentage.toFixed(1)}%)`
        : `Odd (${(100 - evenPercentage).toFixed(1)}%)`;

    case "over_under":
      const overCount = recent.filter((data) => data.isOver).length;
      const underCount = recent.length - overCount;
      const overPercentage = (overCount / recent.length) * 100;
      return overCount > underCount
        ? `Over (${overPercentage.toFixed(1)}%)`
        : `Under (${(100 - overPercentage).toFixed(1)}%)`;

    case "match_differs":
      const digits = recent.map((data) => data.digit);
      const uniqueDigits = new Set(digits).size;
      const matchProbability =
        ((recent.length - uniqueDigits) / recent.length) * 100;
      return matchProbability > 30 ? "Match likely" : "Differs likely";

    case "rise_fall":
      const rises = recent.filter((data) => data.trend === "rise").length;
      const falls = recent.filter((data) => data.trend === "fall").length;
      const risePercentage = (rises / recent.length) * 100;
      return rises > falls
        ? `Rise (${risePercentage.toFixed(1)}%)`
        : `Fall (${(100 - risePercentage).toFixed(1)}%)`;

    default:
      return "Analyzing...";
  }
}

function getMarketInsight(
  marketData: MarketData[],
  marketType: string
): string {
  if (marketData.length < 5) return "Need more data for insights";

  const recent = marketData.slice(-10);
  const insights = [];

  // Check for streaks
  const evenStreak = calculateStreak(recent.map((d) => d.isEven));
  const overStreak = calculateStreak(recent.map((d) => d.isOver));
  const riseStreak = calculateStreak(recent.map((d) => d.trend === "rise"));

  if (evenStreak >= 3) insights.push(`${evenStreak} even streak`);
  if (overStreak >= 3) insights.push(`${overStreak} over streak`);
  if (riseStreak >= 3) insights.push(`${riseStreak} rise streak`);

  // Check distribution balance
  const distribution = calculateDigitDistribution(recent);
  const balance = getDistributionBalance(distribution);

  if (balance < 30) insights.push("Unbalanced digits");
  if (balance > 70) insights.push("Balanced distribution");

  return insights.length > 0 ? insights.join(", ") : "Normal market conditions";
}

function calculateStreak(values: boolean[]): number {
  if (values.length === 0) return 0;
  let streak = 1;
  for (let i = 1; i < values.length; i++) {
    if (values[i] === values[i - 1]) streak++;
    else break;
  }
  return streak;
}

function getDistributionBalance(distribution: number[]): number {
  if (distribution.length === 0) return 0;
  const expected = 100 / distribution.length;
  const differences = distribution.map((p) => Math.abs(p - expected));
  const totalDiff = differences.reduce((a, b) => a + b, 0);
  return Math.max(
    0,
    100 - (totalDiff / (expected * distribution.length * 2)) * 100
  );
}
