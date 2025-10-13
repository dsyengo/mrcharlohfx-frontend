// utils/calculations.ts
import {
  TickData,
  DigitAnalysis,
  VolatilityMetrics,
  MovingAverage,
} from "@/types/analytics";

export const calculateDigitFrequency = (ticks: TickData[]): DigitAnalysis[] => {
  const digitCount: { [key: number]: number } = {};

  // Initialize digit counts
  for (let i = 0; i <= 9; i++) {
    digitCount[i] = 0;
  }

  // Count digit occurrences
  ticks.forEach((tick) => {
    const digit = tick.quote ? parseInt(tick.quote.toString().slice(-1)) : 0;
    digitCount[digit]++;
  });

  const totalTicks = ticks.length;
  const digitAnalysis: DigitAnalysis[] = [];

  for (let i = 0; i <= 9; i++) {
    const frequency = digitCount[i];
    const percentage = totalTicks > 0 ? (frequency / totalTicks) * 100 : 0;

    // Calculate when this digit was last seen
    let lastSeen = 0;
    for (let j = ticks.length - 1; j >= 0; j--) {
      const tickDigit = ticks[j].quote
        ? parseInt(ticks[j].quote.toString().slice(-1))
        : 0;
      if (tickDigit === i) {
        lastSeen = ticks.length - j;
        break;
      }
    }

    // Calculate current streak
    let streak = 0;
    let currentStreak = 0;
    for (let j = ticks.length - 1; j >= 0; j--) {
      const tickDigit = ticks[j].quote
        ? parseInt(ticks[j].quote.toString().slice(-1))
        : 0;
      if (tickDigit === i) {
        currentStreak++;
      } else {
        break;
      }
    }
    streak = currentStreak;

    digitAnalysis.push({
      digit: i,
      frequency,
      percentage,
      lastSeen,
      streak,
      expectedValue: percentage * 10, // Simplified expected value calculation
    });
  }

  return digitAnalysis.sort((a, b) => b.percentage - a.percentage);
};

export const calculateVolatility = (ticks: TickData[]): VolatilityMetrics => {
  if (ticks.length < 2) {
    return {
      currentVolatility: 0,
      averageVolatility: 0,
      volatilityTrend: "stable",
      tickVariance: 0,
    };
  }

  const quotes = ticks.map((t) => t.quote);
  const changes = [];

  // Calculate absolute changes between consecutive ticks
  for (let i = 1; i < quotes.length; i++) {
    changes.push(Math.abs(quotes[i] - quotes[i - 1]));
  }

  // Current volatility (last 10 changes)
  const recentChanges = changes.slice(-10);
  const currentVolatility =
    recentChanges.reduce((sum, change) => sum + change, 0) /
    recentChanges.length;

  // Average volatility
  const averageVolatility =
    changes.reduce((sum, change) => sum + change, 0) / changes.length;

  // Variance
  const variance =
    changes.reduce(
      (sum, change) => sum + Math.pow(change - averageVolatility, 2),
      0
    ) / changes.length;

  // Determine trend
  let volatilityTrend: "increasing" | "decreasing" | "stable" = "stable";
  if (currentVolatility > averageVolatility * 1.1) {
    volatilityTrend = "increasing";
  } else if (currentVolatility < averageVolatility * 0.9) {
    volatilityTrend = "decreasing";
  }

  return {
    currentVolatility,
    averageVolatility,
    volatilityTrend,
    tickVariance: variance,
  };
};

export const calculateMovingAverages = (
  ticks: TickData[],
  periods: number[]
): MovingAverage[] => {
  const quotes = ticks.map((t) => t.quote);
  const movingAverages: MovingAverage[] = [];

  periods.forEach((period) => {
    if (quotes.length < period) {
      movingAverages.push({
        period,
        value: quotes.length > 0 ? quotes[quotes.length - 1] : 0,
        trend: "neutral",
      });
      return;
    }

    // Calculate MA for the period
    const recentQuotes = quotes.slice(-period);
    const maValue =
      recentQuotes.reduce((sum, quote) => sum + quote, 0) / period;

    // Determine trend
    let trend: "up" | "down" | "neutral" = "neutral";
    if (quotes.length >= period * 2) {
      const previousQuotes = quotes.slice(-period * 2, -period);
      const previousMA =
        previousQuotes.reduce((sum, quote) => sum + quote, 0) / period;

      if (maValue > previousMA * 1.001) {
        trend = "up";
      } else if (maValue < previousMA * 0.999) {
        trend = "down";
      }
    }

    movingAverages.push({
      period,
      value: maValue,
      trend,
    });
  });

  return movingAverages;
};

// Anomaly detection
export const detectAnomalies = (ticks: TickData[]): any[] => {
  const anomalies = [];
  const quotes = ticks.map((t) => t.quote);

  if (quotes.length < 10) return anomalies;

  // Calculate rolling statistics
  const windowSize = 10;
  for (let i = windowSize; i < quotes.length; i++) {
    const window = quotes.slice(i - windowSize, i);
    const mean = window.reduce((sum, q) => sum + q, 0) / windowSize;
    const stdDev = Math.sqrt(
      window.reduce((sum, q) => sum + Math.pow(q - mean, 2), 0) / windowSize
    );

    const currentQuote = quotes[i];
    const zScore = Math.abs((currentQuote - mean) / stdDev);

    if (zScore > 2.5) {
      // Statistical outlier
      anomalies.push({
        index: i,
        timestamp: ticks[i].epoch,
        value: currentQuote,
        zScore,
        type: zScore > 0 ? "spike" : "drop",
        severity: zScore > 3.5 ? "high" : zScore > 2.5 ? "medium" : "low",
      });
    }
  }

  return anomalies;
};
