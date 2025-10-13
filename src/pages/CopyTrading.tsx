import Layout from "@/layouts/Layout";
import { useEffect, useRef, useState } from "react";
import TopTraders from "./copy-trading/TopTraders";
import TraderInput from "./copy-trading/TraderInput";
import TraderStats from "./copy-trading/TraderStats";
import PerformanceChart from "./copy-trading/PerformanceChart";
import LiveTradesFeed from "./copy-trading/LiveTradesFeed";
import RiskAllocation from "./copy-trading/RiskAllocation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function CopyTrading() {
  const ws = useRef<WebSocket | null>(null);
  const token = localStorage.getItem("deriv_token");
  const [isConnected, setIsConnected] = useState(false);
  const [traderId, setTraderId] = useState("");
  const [topTraders, setTopTraders] = useState<any[]>([]);
  const [traderInfo, setTraderInfo] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [roiData, setRoiData] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<number[]>([25]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://ws.derivws.com/websockets/v3?app_id=${import.meta.env.VITE_APP_ID}`
    );
    ws.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      if (token) socket.send(JSON.stringify({ authorize: token }));
      setTimeout(
        () => socket.send(JSON.stringify({ copytrading_list: 1 })),
        1000
      );
    };

    socket.onclose = () => setIsConnected(false);
    socket.onerror = (e) => console.error("WS error:", e);

    return () => socket.close();
  }, [token]);

  const fetchTraderData = (id?: string) => {
    const tId = id || traderId;
    if (!ws.current || !tId) return;
    setLoading(true);
    ws.current.send(
      JSON.stringify({
        copytrading_statistics: 1,
        trader_id: tId,
        subscribe: 1,
      })
    );
    ws.current.send(
      JSON.stringify({ copytrading_trades: 1, trader_id: tId, subscribe: 1 })
    );
  };

  const handleMessage = (msg: any) => {
    if (msg.copytrading_list) setTopTraders(msg.copytrading_list.traders || []);
    if (msg.copytrading_statistics) {
      setTraderInfo(msg.copytrading_statistics);
      const time = new Date().toLocaleTimeString();
      const roi = msg.copytrading_statistics.roi || 0;
      setRoiData((prev) => [...prev.slice(-50), { time, roi }]);
      setLoading(false);
    }
    if (msg.copytrading_trades) {
      const t = msg.copytrading_trades;
      setTrades((prev) => {
        const existing = prev.find((x) => x.id === t.id);
        return existing
          ? prev.map((x) => (x.id === t.id ? { ...x, ...t } : x))
          : [...prev, t];
      });
    }
  };

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = (e) => handleMessage(JSON.parse(e.data));
  }, []);

  const startCopying = () =>
    ws.current?.send(
      JSON.stringify({
        copy_start: 1,
        trader_id: traderId,
        max_trade_stake: allocation[0],
      })
    );

  const stopCopying = () =>
    ws.current?.send(JSON.stringify({ copy_stop: 1, trader_id: traderId }));

  return (
    <Layout>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed lg:relative z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                  Trader Overview
                </h2>

                {traderInfo ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>ID:</strong> {traderInfo.trader_id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>ROI:</strong> {traderInfo.roi?.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Followers:</strong>{" "}
                      {traderInfo.followers_count || "—"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Open Trades:</strong> {trades.length}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Select a trader to view details
                  </p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Quick Actions
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={startCopying}
                    disabled={!traderId}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Start Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={stopCopying}
                    disabled={!traderId}
                    variant="outline"
                  >
                    Stop
                  </Button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen((prev) => !prev)}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Copy Trading Dashboard
              </h1>
            </div>
            <span
              className={`text-xs md:text-sm px-3 py-1 rounded-full font-medium ${
                isConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Traders</CardTitle>
              </CardHeader>
              <CardContent>
                <TopTraders
                  traders={topTraders}
                  onSelectTrader={fetchTraderData}
                />
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <TraderInput
                traderId={traderId}
                setTraderId={setTraderId}
                onFetch={() => fetchTraderData()}
                loading={loading}
              />
              <TraderStats info={traderInfo} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <PerformanceChart data={roiData} />
              <LiveTradesFeed trades={trades} />
            </div>

            <RiskAllocation
              allocation={allocation}
              setAllocation={setAllocation}
              onStart={startCopying}
              onStop={stopCopying}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
