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
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Layout>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || !sidebarCollapsed) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`fixed lg:relative z-30 ${
                sidebarCollapsed ? "w-20" : "w-80"
              } bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl flex flex-col transition-all duration-300`}
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Trader Hub
                      </h2>
                    </motion.div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8 rounded-lg"
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Trader Overview */}
                <div>
                  {!sidebarCollapsed && (
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
                    >
                      Trader Overview
                    </motion.h3>
                  )}

                  {traderInfo ? (
                    <div className="space-y-4">
                      {[
                        {
                          icon: Users,
                          label: "ID",
                          value: traderInfo.trader_id,
                        },
                        {
                          icon: BarChart3,
                          label: "ROI",
                          value: `${traderInfo.roi?.toFixed(2)}%`,
                          color:
                            traderInfo.roi >= 0
                              ? "text-green-600"
                              : "text-red-600",
                        },
                        {
                          icon: Activity,
                          label: "Followers",
                          value: traderInfo.followers_count || "—",
                        },
                        {
                          icon: Settings,
                          label: "Open Trades",
                          value: trades.length,
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <item.icon
                              className={`h-4 w-4 ${
                                item.color || "text-gray-600 dark:text-gray-300"
                              }`}
                            />
                          </div>
                          {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.label}
                              </p>
                              <p
                                className={`text-sm font-medium truncate ${
                                  item.color ||
                                  "text-gray-900 dark:text-gray-100"
                                }`}
                              >
                                {item.value}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    !sidebarCollapsed && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400 dark:text-gray-500 text-sm text-center py-8"
                      >
                        Select a trader to view details
                      </motion.p>
                    )
                  )}
                </div>

                {/* Quick Actions */}
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/30"
                  >
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Quick Actions
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={startCopying}
                        disabled={!traderId}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25"
                      >
                        Start Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={stopCopying}
                        disabled={!traderId}
                        variant="outline"
                        className="flex-1 border-gray-300 dark:border-gray-600"
                      >
                        Stop
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-20"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-lg"
                onClick={() => setSidebarOpen((prev) => !prev)}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    Copy Trading
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Real-time trading dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.span
                animate={{
                  scale: isConnected ? [1, 1.1, 1] : 1,
                  backgroundColor: isConnected ? "#10B981" : "#EF4444",
                }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 text-xs md:text-sm px-3 py-1.5 rounded-full font-medium text-white shadow-lg"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {isConnected ? "Live Connected" : "Disconnected"}
              </motion.span>
            </div>
          </motion.header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Top Traders Section */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-blue-500" />
                    Top Performing Traders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TopTraders
                    traders={topTraders}
                    onSelectTrader={fetchTraderData}
                  />
                </CardContent>
              </Card>
            </motion.section>

            {/* Trader Input & Stats */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <TraderInput
                traderId={traderId}
                setTraderId={setTraderId}
                onFetch={() => fetchTraderData()}
                loading={loading}
              />
              <TraderStats info={traderInfo} />
            </motion.section>

            {/* Charts & Live Feed */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <PerformanceChart data={roiData} />
              <LiveTradesFeed trades={trades} />
            </motion.section>

            {/* Risk Allocation */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <RiskAllocation
                allocation={allocation}
                setAllocation={setAllocation}
                onStart={startCopying}
                onStop={stopCopying}
              />
            </motion.section>
          </main>
        </div>
      </div>
    </Layout>
  );
}
