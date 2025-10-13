import { useEffect, useRef, useState } from "react";
import Layout from "@/layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DigitData = { digit: number; frequency: number };

export default function MarketAnalysis() {
  const [data, setData] = useState<DigitData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [market, setMarket] = useState("R_100");
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const ws = useRef<WebSocket | null>(null);

  // Initialize frequency for digits 0–9
  const initializeData = (): DigitData[] =>
    Array.from({ length: 10 }, (_, i) => ({ digit: i, frequency: 0 }));

  useEffect(() => {
    const socket = new WebSocket(
      `wss://ws.derivws.com/websockets/v3?app_id=${import.meta.env.VITE_APP_ID}`
    );
    ws.current = socket;
    setData(initializeData());

    socket.onopen = () => {
      setIsConnected(true);
      console.log("✅ Connected to Deriv WebSocket");
      socket.send(JSON.stringify({ ticks: market, subscribe: 1 }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.tick) {
        const quote = Number(msg.tick.quote);
        const lastDigit = Number(quote.toString().slice(-1));

        setCurrentPrice(quote);
        setCurrentDigit(lastDigit);

        setData((prev) => {
          const updated = [...prev];
          updated[lastDigit].frequency += 1;
          return [...updated];
        });
      }
    };

    socket.onerror = (err) => console.error("❌ WebSocket error:", err);
    socket.onclose = () => {
      console.warn("⚠️ WebSocket closed");
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [market]);

  const totalTicks = data.reduce((a, b) => a + b.frequency, 0);

  const getPercentage = (freq: number) =>
    totalTicks > 0 ? ((freq / totalTicks) * 100).toFixed(1) : "0.0";

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            🎯 Live Market Analysis — {market}
          </h1>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              isConnected
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Current Price Display */}
        <Card>
          <CardHeader>
            <CardTitle>Live Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-blue-600">
              {currentPrice ? currentPrice.toFixed(5) : "---"}
            </p>
            <p className="text-sm text-gray-500">Current tick price</p>
          </CardContent>
        </Card>

        {/* Animated Circles for Digits */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Digit Analysis (Live Movement)</CardTitle>
          </CardHeader>
          <CardContent>
            {totalTicks === 0 ? (
              <div className="flex justify-center items-center h-[200px]">
                <Loader2 className="animate-spin text-green-600 h-6 w-6 mr-2" />
                <p className="text-gray-500 text-sm">
                  Waiting for live market data…
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 md:gap-5 place-items-center">
                {data.map((item) => {
                  const percentage = getPercentage(item.frequency);
                  const isActive = item.digit === currentDigit;

                  return (
                    <motion.div
                      key={item.digit}
                      className={`relative flex flex-col items-center justify-center text-center`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className={`rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-bold text-xl md:text-2xl shadow-lg ${
                          isActive
                            ? "bg-green-500 text-white scale-110"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                        animate={{
                          scale: isActive ? [1, 1.2, 1] : 1,
                          backgroundColor: isActive
                            ? ["#22c55e", "#16a34a", "#22c55e"]
                            : "bg-gray-200",
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: isActive ? 1 : 0,
                        }}
                      >
                        {item.digit}
                      </motion.div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {percentage}%
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
