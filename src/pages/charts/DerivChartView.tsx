import React, { useEffect, useRef } from "react";
import { SmartChart } from "@deriv/deriv-charts";
import { useDerivAPI } from "@/hooks/useDerivAPI";

interface DerivChartViewProps {
  symbol?: string;
  theme?: "light" | "dark";
}

const DerivChartView: React.FC<DerivChartViewProps> = ({
  symbol = "R_100",
  theme = "dark",
}) => {
  const api = useDerivAPI();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;
  }, [api]);

  return (
    <div
      ref={chartRef}
      className={`w-full h-[600px] ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <SmartChart
        symbol={symbol}
        theme={theme}
        chartType="mountain"
        granularity={60}
        isMobile={false}
        id="smart_chart"
      />
    </div>
  );
};

export default DerivChartView;
