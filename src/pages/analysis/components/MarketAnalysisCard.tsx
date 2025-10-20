// pages/analysis/components/MarketAnalysisCard.tsx
import { MarketAnalysis } from "../AnalysisPage";

interface MarketAnalysisCardProps {
  analysis: MarketAnalysis;
  marketType: string;
  currentPrice: number | null;
}

export default function MarketAnalysisCard({
  analysis,
  marketType,
  currentPrice,
}: MarketAnalysisCardProps) {
  const getMarketTypeLabel = (type: string) => {
    switch (type) {
      case "even_odd":
        return "Even/Odd Analysis";
      case "over_under":
        return "Over/Under Analysis";
      case "match_differs":
        return "Match/Differs Analysis";
      case "rise_fall":
        return "Rise/Fall Analysis";
      default:
        return "Market Analysis";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {getMarketTypeLabel(marketType)}
      </h3>

      {/* Even/Odd Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Even/Odd Distribution
        </h4>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Even</span>
          <span className="font-medium text-green-600">
            {analysis.evenOddDistribution.even.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${analysis.evenOddDistribution.even}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between mt-3 mb-2">
          <span className="text-sm text-gray-600">Odd</span>
          <span className="font-medium text-orange-600">
            {analysis.evenOddDistribution.odd.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${analysis.evenOddDistribution.odd}%` }}
          ></div>
        </div>
      </div>

      {/* Pattern Sequence */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Recent Pattern
        </h4>
        <div className="flex flex-wrap gap-1">
          {analysis.patternSequence.map((pattern, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded text-xs font-medium ${
                pattern === "E"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-orange-100 text-orange-800 border border-orange-200"
              }`}
            >
              {pattern}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          E = Even, O = Odd (Last {analysis.patternSequence.length} ticks)
        </p>
      </div>

      {/* Current Prediction */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Current Analysis
        </h4>
        <p className="text-sm text-blue-800 font-medium">
          {analysis.currentPrediction}
        </p>
        <div className="flex justify-between text-xs text-blue-600 mt-2">
          <span>Total Ticks: {analysis.totalTicks}</span>
          <span>
            Last Digit: {currentPrice ? currentPrice.toString().slice(-1) : "-"}
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-600">Even Count</div>
          <div className="font-bold text-green-600">
            {Math.round(
              (analysis.evenOddDistribution.even / 100) * analysis.totalTicks
            )}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-600">Odd Count</div>
          <div className="font-bold text-orange-600">
            {Math.round(
              (analysis.evenOddDistribution.odd / 100) * analysis.totalTicks
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
