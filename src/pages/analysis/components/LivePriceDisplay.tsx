// pages/analysis/components/LivePriceDisplay.tsx
import { useEffect, useState } from "react";

interface LivePriceDisplayProps {
  price: number | null;
  symbol: string;
  marketType?: string;
  currentDigit?: number;
  isConnected: boolean;
  lastTickTime?: number | null;
}

export default function LivePriceDisplay({
  price,
  symbol,
  marketType,
  currentDigit,
  isConnected,
  lastTickTime,
}: LivePriceDisplayProps) {
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (price !== null && price !== prevPrice) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      setPrevPrice(price);
      return () => clearTimeout(timer);
    }
  }, [price, prevPrice]);

  // Get the last digit from 3 decimal places
  const getLastDigit = (price: number): number => {
    // Convert to string with 3 decimal places
    const priceStr = price.toFixed(3);
    // Get the last character (3rd decimal digit)
    return parseInt(priceStr[priceStr.length - 1]);
  };

  // Determine if the digit is even
  const isEvenDigit = (digit: number): boolean => {
    return digit % 2 === 0;
  };

  // Determine if the digit is over 5
  const isOverFive = (digit: number): boolean => {
    return digit > 5;
  };

  const getMarketColor = () => {
    switch (marketType) {
      case "even_odd":
        return "from-purple-500 to-pink-500";
      case "over_under":
        return "from-green-500 to-teal-500";
      case "match_differs":
        return "from-orange-500 to-red-500";
      case "rise_fall":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  const getMarketTypeLabel = () => {
    switch (marketType) {
      case "even_odd":
        return "Even/Odd";
      case "over_under":
        return "Over/Under";
      case "match_differs":
        return "Match/Differs";
      case "rise_fall":
        return "Rise/Fall";
      default:
        return "Market Analysis";
    }
  };

  const currentDigitValue =
    currentDigit !== undefined
      ? currentDigit
      : price !== null
      ? getLastDigit(price)
      : undefined;
  const isEven =
    currentDigitValue !== undefined ? isEvenDigit(currentDigitValue) : false;
  const isOver =
    currentDigitValue !== undefined ? isOverFive(currentDigitValue) : false;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Price</h3>
        {marketType && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {getMarketTypeLabel()}
          </span>
        )}
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2 font-medium">
          {symbol || "Select Market"}
        </div>

        {/* Main Price Display */}
        <div
          className={`text-4xl md:text-5xl font-bold font-mono mb-2 transition-all duration-300 ${
            pulse ? "scale-110" : "scale-100"
          } bg-gradient-to-r ${getMarketColor()} bg-clip-text text-transparent`}
        >
          {price !== null ? price.toFixed(3) : "---.---"}
        </div>

        {/* Last Digit Analysis */}
        <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Last Digit Analysis
          </h4>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500 mb-1">Current Digit</div>
              <div className="text-2xl font-bold font-mono text-blue-600">
                {currentDigitValue !== undefined ? currentDigitValue : "-"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Type</div>
              <div
                className={`text-lg font-bold ${
                  isEven ? "text-green-600" : "text-orange-600"
                }`}
              >
                {currentDigitValue !== undefined
                  ? isEven
                    ? "EVEN"
                    : "ODD"
                  : "-"}
              </div>
            </div>
          </div>

          {/* Over/Under Indicator */}
          {marketType === "over_under" && currentDigitValue !== undefined && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Position:</span>
                <span
                  className={`font-bold ${
                    isOver ? "text-purple-600" : "text-pink-600"
                  }`}
                >
                  {isOver ? "OVER 5" : "UNDER 5"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Market Status */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Connection:</span>
            <span
              className={`font-medium ${
                isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {isConnected ? "CONNECTED" : "DISCONNECTED"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Data Status:</span>
            <span
              className={`font-medium ${
                price !== null ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {price !== null ? "LIVE" : "WAITING"}
            </span>
          </div>

          {lastTickTime && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Last Update:</span>
              <span className="font-medium text-gray-900 text-xs">
                {new Date(lastTickTime).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Analysis */}
      {currentDigitValue !== undefined && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-800">
            <div className="font-medium mb-1">Quick Analysis:</div>
            <div className="space-y-1">
              <div>
                • Digit {currentDigitValue} is {isEven ? "even" : "odd"}
              </div>
              {marketType === "over_under" && (
                <div>• Position is {isOver ? "over 5" : "under 5"}</div>
              )}
              {marketType === "even_odd" && (
                <div>• {isEven ? "Even" : "Odd"} prediction suggested</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
