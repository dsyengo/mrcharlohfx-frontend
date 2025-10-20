// pages/analysis/components/MarketSelector.tsx
import { useState, useEffect } from "react";

interface MarketSelectorProps {
  selectedMarket: string;
  selectedVolatility: string;
  tickCount: number;
  onMarketChange: (market: string) => void;
  onVolatilityChange: (volatility: string) => void;
  onTickCountChange: (count: number) => void;
}

const MARKET_TYPES = [
  {
    value: "even_odd",
    label: "Even/Odd",
    description: "Predict if last digit is even or odd",
  },
  {
    value: "over_under",
    label: "Over/Under",
    description: "Predict if digit is over or under 5",
  },
  {
    value: "match_differs",
    label: "Match/Differs",
    description: "Predict if digits match or differ",
  },
  {
    value: "rise_fall",
    label: "Rise/Fall",
    description: "Predict if price will rise or fall",
  },
];

const VOLATILITY_INDICES = {
  continuous: {
    label: "Continuous Indices",
    indices: [
      { symbol: "1HZ10V", name: "Volatility 10 (1s) Index" },
      { symbol: "R_10", name: "Volatility 10 Index" },
      { symbol: "1HZ15V", name: "Volatility 15 (1s) Index" },
      { symbol: "1HZ25V", name: "Volatility 25 (1s) Index" },
      { symbol: "R_25", name: "Volatility 25 Index" },
      { symbol: "1HZ30V", name: "Volatility 30 (1s) Index" },
      { symbol: "1HZ50V", name: "Volatility 50 (1s) Index" },
      { symbol: "R_50", name: "Volatility 50 Index" },
      { symbol: "1HZ75V", name: "Volatility 75 (1s) Index" },
      { symbol: "R_75", name: "Volatility 75 Index" },
      { symbol: "1HZ90V", name: "Volatility 90 (1s) Index" },
      { symbol: "1HZ100V", name: "Volatility 100 (1s) Index" },
      { symbol: "R_100", name: "Volatility 100 Index" },
    ],
  },
  crashBoom: {
    label: "Crash/Boom Indices",
    indices: [
      { symbol: "BOOM300", name: "Boom 300 Index" },
      { symbol: "BOOM500", name: "Boom 500 Index" },
      { symbol: "BOOM600", name: "Boom 600 Index" },
      { symbol: "BOOM900", name: "Boom 900 Index" },
      { symbol: "BOOM1000", name: "Boom 1000 Index" },
      { symbol: "CRASH300", name: "Crash 300 Index" },
      { symbol: "CRASH500", name: "Crash 500 Index" },
      { symbol: "CRASH600", name: "Crash 600 Index" },
      { symbol: "CRASH900", name: "Crash 900 Index" },
      { symbol: "CRASH1000", name: "Crash 1000 Index" },
    ],
  },
  dailyReset: {
    label: "Daily Reset Indices",
    indices: [
      { symbol: "RDBEAR", name: "Bear Market Index" },
      { symbol: "RDBULL", name: "Bull Market Index" },
    ],
  },
  jump: {
    label: "Jump Indices",
    indices: [
      { symbol: "JD10", name: "Jump 10 Index" },
      { symbol: "JD25", name: "Jump 25 Index" },
      { symbol: "JD50", name: "Jump 50 Index" },
      { symbol: "JD75", name: "Jump 75 Index" },
      { symbol: "JD100", name: "Jump 100 Index" },
    ],
  },
  rangeBreak: {
    label: "Range Break Indices",
    indices: [
      { symbol: "RB100", name: "Range Break 100 Index" },
      { symbol: "RB200", name: "Range Break 200 Index" },
    ],
  },
  step: {
    label: "Step Indices",
    indices: [
      { symbol: "STP100", name: "Step Index 100" },
      { symbol: "STP200", name: "Step Index 200" },
      { symbol: "STP300", name: "Step Index 300" },
      { symbol: "STP400", name: "Step Index 400" },
      { symbol: "STP500", name: "Step Index 500" },
    ],
  },
};

export default function MarketSelector({
  selectedMarket,
  selectedVolatility,
  tickCount,
  onMarketChange,
  onVolatilityChange,
  onTickCountChange,
}: MarketSelectorProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("continuous");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Market Selection
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Market Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Market Type
          </label>
          <select
            value={selectedMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Market Type</option>
            {MARKET_TYPES.map((market) => (
              <option key={market.value} value={market.value}>
                {market.label}
              </option>
            ))}
          </select>
          {selectedMarket && (
            <p className="text-xs text-gray-500 mt-1">
              {
                MARKET_TYPES.find((m) => m.value === selectedMarket)
                  ?.description
              }
            </p>
          )}
        </div>

        {/* Volatility Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Index Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(VOLATILITY_INDICES).map(([key, category]) => (
              <option key={key} value={key}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Volatility Index */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volatility Index
          </label>
          <select
            value={selectedVolatility}
            onChange={(e) => onVolatilityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Index</option>
            {VOLATILITY_INDICES[
              selectedCategory as keyof typeof VOLATILITY_INDICES
            ].indices.map((vol) => (
              <option key={vol.symbol} value={vol.symbol}>
                {vol.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tick Count */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ticks to Analyze
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="10"
            max="500"
            value={tickCount}
            onChange={(e) => onTickCountChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700 min-w-[60px]">
            {tickCount} ticks
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Analyze last 10-500 ticks</p>
      </div>

      {/* Market Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {MARKET_TYPES.map((market) => (
          <button
            key={market.value}
            onClick={() => onMarketChange(market.value)}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              selectedMarket === market.value
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-gray-900">{market.label}</div>
            <div className="text-xs text-gray-600 mt-1">
              {market.description}
            </div>
          </button>
        ))}
      </div>

      {/* Quick Index Selection */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Popular Indices
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { symbol: "R_10", name: "Vol 10" },
            { symbol: "R_25", name: "Vol 25" },
            { symbol: "R_50", name: "Vol 50" },
            { symbol: "R_75", name: "Vol 75" },
            { symbol: "R_100", name: "Vol 100" },
            { symbol: "BOOM300", name: "Boom 300" },
            { symbol: "CRASH300", name: "Crash 300" },
          ].map((index) => (
            <button
              key={index.symbol}
              onClick={() => onVolatilityChange(index.symbol)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedVolatility === index.symbol
                  ? "bg-blue-100 text-blue-800 border-blue-300"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {index.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
