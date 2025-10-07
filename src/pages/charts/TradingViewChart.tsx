import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol?: string;
  theme?: "light" | "dark";
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = "R_100",
  theme = "dark",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const scriptId = "tradingview-widget";
    if (document.getElementById(scriptId)) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLoaded || !window.TradingView || !containerRef.current) return;

    const widget = new window.TradingView.widget({
      container_id: containerRef.current,
      symbol,
      interval: "5",
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "en",
      autosize: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
    });

    return () => {
      if (widget?.remove) widget.remove();
    };
  }, [isLoaded, symbol, theme]);

  return (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg">
      {!isLoaded ? (
        <div className="flex justify-center items-center h-full text-gray-400">
          Loading TradingView...
        </div>
      ) : (
        <div ref={containerRef} className="w-full h-full" />
      )}
    </div>
  );
};

export default TradingViewChart;
