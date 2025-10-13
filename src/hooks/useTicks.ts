// hooks/useTicks.ts
import { useState, useEffect } from "react";
import {
  TickData,
  DigitAnalysis,
  VolatilityMetrics,
  MovingAverage,
} from "@/types/analytics";
import {
  calculateDigitFrequency,
  calculateVolatility,
  calculateMovingAverages,
} from "@/utils/calculations";

export const useTicks = (ticks: TickData[]) => {
  const [digitAnalysis, setDigitAnalysis] = useState<DigitAnalysis[]>([]);
  const [volatility, setVolatility] = useState<VolatilityMetrics>({
    currentVolatility: 0,
    averageVolatility: 0,
    volatilityTrend: "stable",
    tickVariance: 0,
  });
  const [movingAverages, setMovingAverages] = useState<MovingAverage[]>([]);

  useEffect(() => {
    if (ticks.length === 0) return;

    // Calculate digit frequency
    const digitFreq = calculateDigitFrequency(ticks);
    setDigitAnalysis(digitFreq);

    // Calculate volatility
    const volMetrics = calculateVolatility(ticks);
    setVolatility(volMetrics);

    // Calculate moving averages
    const averages = calculateMovingAverages(ticks, [5, 10, 20, 50]);
    setMovingAverages(averages);
  }, [ticks]);

  const getLastDigit = (tick: TickData): number => {
    if (tick.digit !== undefined) return tick.digit;
    return tick.quote ? parseInt(tick.quote.toString().slice(-1)) : 0;
  };

  const getRecentDigits = (count: number): number[] => {
    return ticks.slice(-count).map((tick) => getLastDigit(tick));
  };

  const detectPatterns = (digits: number[]): string[] => {
    const patterns: string[] = [];

    // Check for repeating digits
    const lastThree = digits.slice(-3);
    if (lastThree.length === 3 && new Set(lastThree).size === 1) {
      patterns.push(`Triple ${lastThree[0]} detected`);
    }

    // Check for sequences
    if (digits.length >= 3) {
      const sorted = [...lastThree].sort((a, b) => a - b);
      if (sorted[2] - sorted[1] === 1 && sorted[1] - sorted[0] === 1) {
        patterns.push("Sequential pattern detected");
      }
    }

    return patterns;
  };

  return {
    digitAnalysis,
    volatility,
    movingAverages,
    getLastDigit,
    getRecentDigits,
    detectPatterns,
    totalTicks: ticks.length,
  };
};
