// pages/analysis/components/DigitsVisualizer.tsx
import { MarketData } from "../AnalysisPage";

interface DigitsVisualizerProps {
  marketData: MarketData[];
  currentDigit?: number;
  marketType: string;
}

export default function DigitsVisualizer({
  marketData,
  currentDigit,
  marketType,
}: DigitsVisualizerProps) {
  const digitDistribution = calculateDigitDistribution(marketData);

  const getVisualizerTitle = () => {
    switch (marketType) {
      case "even_odd":
        return "Digit Distribution (Even/Odd)";
      case "over_under":
        return "Digit Distribution (Over/Under 5)";
      case "match_differs":
        return "Digit Frequency Analysis";
      case "rise_fall":
        return "Price Digit Patterns";
      default:
        return "Digit Distribution";
    }
  };

  const getMarketSpecificStats = () => {
    if (marketType === "over_under") {
      const overTicks = Math.round(
        (digitDistribution.slice(6).reduce((a, b) => a + b, 0) / 100) *
          marketData.length
      );
      const underTicks = Math.round(
        (digitDistribution.slice(0, 6).reduce((a, b) => a + b, 0) / 100) *
          marketData.length
      );
      return { overTicks, underTicks };
    }
    return null;
  };

  const stats = getMarketSpecificStats();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {getVisualizerTitle()}
      </h3>

      {/* Digits Grid */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {digitDistribution.map((percentage, digit) => (
          <DigitCircle
            key={digit}
            digit={digit}
            percentage={percentage}
            isActive={currentDigit === digit}
            count={Math.round((percentage / 100) * marketData.length)}
            marketType={marketType}
          />
        ))}
      </div>

      {/* Market-specific Analysis */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Current Analysis
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Most Common:</span>
            <div className="font-medium text-green-600">
              {getMostCommonDigit(digitDistribution)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Least Common:</span>
            <div className="font-medium text-red-600">
              {getLeastCommonDigit(digitDistribution)}
            </div>
          </div>
        </div>

        {marketType === "over_under" && stats && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Over 5:</span>
              <span className="font-medium text-purple-600">
                {stats.overTicks} ticks (
                {((stats.overTicks / marketData.length) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Under 5:</span>
              <span className="font-medium text-pink-600">
                {stats.underTicks} ticks (
                {((stats.underTicks / marketData.length) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        )}

        {marketType === "even_odd" && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Even Digits:</span>
              <span className="font-medium text-green-600">
                {Math.round(
                  (digitDistribution
                    .filter((_, digit) => digit % 2 === 0)
                    .reduce((a, b) => a + b, 0) /
                    100) *
                    marketData.length
                )}{" "}
                ticks
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Odd Digits:</span>
              <span className="font-medium text-orange-600">
                {Math.round(
                  (digitDistribution
                    .filter((_, digit) => digit % 2 === 1)
                    .reduce((a, b) => a + b, 0) /
                    100) *
                    marketData.length
                )}{" "}
                ticks
              </span>
            </div>
          </div>
        )}

        {/* Distribution Balance Indicator */}
        <div className="mt-3 pt-3 border-t border-gray-300">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Distribution Balance:</span>
            <span
              className={`font-medium ${
                getDistributionBalance(digitDistribution) > 70
                  ? "text-green-600"
                  : getDistributionBalance(digitDistribution) > 40
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {getDistributionBalance(digitDistribution).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getDistributionBalance(digitDistribution)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Higher percentage indicates more balanced digit distribution
          </p>
        </div>
      </div>

      {/* Digit Statistics Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
          <div className="text-blue-700 font-medium">Total Ticks</div>
          <div className="text-gray-900 font-bold">{marketData.length}</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded border border-green-200">
          <div className="text-green-700 font-medium">Even Count</div>
          <div className="text-gray-900 font-bold">
            {Math.round(
              (digitDistribution
                .filter((_, digit) => digit % 2 === 0)
                .reduce((a, b) => a + b, 0) /
                100) *
                marketData.length
            )}
          </div>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
          <div className="text-orange-700 font-medium">Odd Count</div>
          <div className="text-gray-900 font-bold">
            {Math.round(
              (digitDistribution
                .filter((_, digit) => digit % 2 === 1)
                .reduce((a, b) => a + b, 0) /
                100) *
                marketData.length
            )}
          </div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
          <div className="text-purple-700 font-medium">Unique Digits</div>
          <div className="text-gray-900 font-bold">
            {digitDistribution.filter((percent) => percent > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}

function DigitCircle({
  digit,
  percentage,
  isActive,
  count,
  marketType,
}: {
  digit: number;
  percentage: number;
  isActive: boolean;
  count: number;
  marketType: string;
}) {
  const getColor = (digit: number) => {
    if (marketType === "over_under") {
      return digit > 5
        ? "text-purple-600 border-purple-200"
        : "text-pink-600 border-pink-200";
    }
    return digit % 2 === 0
      ? "text-green-600 border-green-200"
      : "text-orange-600 border-orange-200";
  };

  const getBackgroundColor = (digit: number) => {
    if (marketType === "over_under") {
      return digit > 5 ? "bg-purple-50" : "bg-pink-50";
    }
    return digit % 2 === 0 ? "bg-green-50" : "bg-orange-50";
  };

  const getActiveClass = (isActive: boolean) => {
    return isActive ? "ring-4 ring-blue-400 scale-110 shadow-lg" : "";
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage > 15) return "text-green-600";
    if (percentage > 8) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="text-center group">
      <div
        className={`relative inline-flex items-center justify-center w-12 h-12 border-2 rounded-full transition-all duration-300 ${getColor(
          digit
        )} ${getActiveClass(isActive)} ${
          isActive ? "bg-blue-50 border-blue-300" : getBackgroundColor(digit)
        } group-hover:scale-105 group-hover:shadow-md`}
      >
        <span
          className={`font-bold text-lg ${isActive ? "text-blue-700" : ""}`}
        >
          {digit}
        </span>
        {isActive && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        )}
        {/* Percentage bar inside circle */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-blue-200 rounded-b-full transition-all duration-1000"
          style={{
            height: `${percentage * 0.3}%`,
            opacity: 0.3,
          }}
        ></div>
      </div>
      <div className="mt-2 text-xs">
        <div className={`font-medium ${getPercentageColor(percentage)}`}>
          {percentage.toFixed(1)}%
        </div>
        <div className="text-gray-500">({count})</div>
      </div>
    </div>
  );
}

// Utility Functions

/**
 * Calculate digit distribution percentage for digits 0-9
 */
function calculateDigitDistribution(marketData: MarketData[]): number[] {
  const distribution = new Array(10).fill(0);
  if (marketData.length === 0) return distribution;

  marketData.forEach((data) => {
    if (data.digit >= 0 && data.digit <= 9) {
      distribution[data.digit]++;
    }
  });

  return distribution.map((count) => (count / marketData.length) * 100);
}

/**
 * Get the most common digit with its percentage
 */
function getMostCommonDigit(distribution: number[]): string {
  if (distribution.length === 0 || Math.max(...distribution) === 0)
    return "N/A";

  const maxPercentage = Math.max(...distribution);
  const digit = distribution.indexOf(maxPercentage);
  return `${digit} (${maxPercentage.toFixed(1)}%)`;
}

/**
 * Get the least common digit with its percentage (excluding zeros)
 */
function getLeastCommonDigit(distribution: number[]): string {
  if (distribution.length === 0) return "N/A";

  // Filter out digits that haven't appeared
  const nonZeroDistribution = distribution.map((val, idx) =>
    val > 0 ? val : Infinity
  );
  const minValue = Math.min(...nonZeroDistribution);

  if (minValue === Infinity) return "N/A";

  const digit = nonZeroDistribution.indexOf(minValue);
  return `${digit} (${minValue.toFixed(1)}%)`;
}

/**
 * Calculate distribution balance (how evenly digits are distributed)
 * Returns percentage where 100% means perfect balance
 */
function getDistributionBalance(distribution: number[]): number {
  if (distribution.length === 0) return 0;

  const expectedPercentage = 100 / distribution.length; // 10% for each digit
  const differences = distribution.map((percent) =>
    Math.abs(percent - expectedPercentage)
  );
  const totalDifference = differences.reduce((sum, diff) => sum + diff, 0);
  const maxPossibleDifference = expectedPercentage * distribution.length * 2; // Theoretical maximum

  return Math.max(0, 100 - (totalDifference / maxPossibleDifference) * 100);
}

/**
 * Calculate streak for a sequence of boolean values
 */
function calculateStreak(values: boolean[]): number {
  if (values.length === 0) return 0;

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < values.length; i++) {
    if (values[i] === values[i - 1]) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Get digit pattern insights
 */
function getDigitPatternInsights(marketData: MarketData[]): {
  mostFrequentDigit: number;
  leastFrequentDigit: number;
  evenOddRatio: number;
  overUnderRatio: number;
  streakInfo: { type: string; length: number };
} {
  if (marketData.length === 0) {
    return {
      mostFrequentDigit: -1,
      leastFrequentDigit: -1,
      evenOddRatio: 0,
      overUnderRatio: 0,
      streakInfo: { type: "none", length: 0 },
    };
  }

  const distribution = calculateDigitDistribution(marketData);
  const mostFrequentDigit = distribution.indexOf(Math.max(...distribution));
  const leastFrequentDigit = distribution.indexOf(
    Math.min(...distribution.filter((p) => p > 0))
  );

  const evenCount = marketData.filter((data) => data.isEven).length;
  const evenOddRatio = (evenCount / marketData.length) * 100;

  const overCount = marketData.filter((data) => data.isOver).length;
  const overUnderRatio = (overCount / marketData.length) * 100;

  // Calculate current streak
  const recentData = marketData.slice(-10);
  let currentStreak = 1;
  const currentType = recentData[0]?.isEven ? "even" : "odd";

  for (let i = 1; i < recentData.length; i++) {
    if (
      (recentData[i]?.isEven && currentType === "even") ||
      (!recentData[i]?.isEven && currentType === "odd")
    ) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    mostFrequentDigit,
    leastFrequentDigit,
    evenOddRatio,
    overUnderRatio,
    streakInfo: { type: currentType, length: currentStreak },
  };
}

export {
  calculateDigitDistribution,
  getMostCommonDigit,
  getLeastCommonDigit,
  getDistributionBalance,
  calculateStreak,
  getDigitPatternInsights,
};
