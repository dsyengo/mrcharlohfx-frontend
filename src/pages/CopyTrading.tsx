import { useEffect, useRef, useState } from "react";
import Layout from "@/layouts/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Trader = {
  trader_id: string;
  name: string;
  roi: number;
  win_rate: number;
  risk_level: string;
  subscribers: number;
};

export default function CopyTrading() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://ws.derivws.com/websockets/v3?app_id=${import.meta.env.VITE_APP_ID}`
    );
    ws.current = socket;

    socket.onopen = () => {
      console.log("Connected to Deriv WebSocket");
      setIsConnected(true);

      // authorize first (site already has token)
      socket.send(
        JSON.stringify({ authorize: localStorage.getItem("deriv_token") })
      );

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.msg_type === "authorize") {
          // Fetch available copytrading strategies
          socket.send(JSON.stringify({ copytrading_list: 1 }));
        }

        if (msg.msg_type === "copytrading_list") {
          setTraders(msg.copytrading_list?.strategies || []);
          setLoading(false);
        }
      };
    };

    socket.onclose = () => setIsConnected(false);
    socket.onerror = (e) => console.error("WebSocket error", e);

    return () => socket.close();
  }, []);

  const handleCopy = (trader_id: string) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify({ copy_start: 1, trader_id }));
  };

  const handleStopCopy = (trader_id: string) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify({ copy_stop: 1, trader_id }));
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Copy Trading Dashboard
          </h1>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              isConnected
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-6 w-6 mr-2 text-green-500" />
            <p className="text-gray-500">Fetching live traders...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {traders.map((t) => (
              <Card key={t.trader_id}>
                <CardHeader>
                  <CardTitle>{t.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    ROI:{" "}
                    <span className="font-semibold text-green-600">
                      {t.roi}%
                    </span>
                  </p>
                  <p>
                    Win Rate:{" "}
                    <span className="font-semibold text-blue-600">
                      {t.win_rate}%
                    </span>
                  </p>
                  <p>
                    Risk Level:{" "}
                    <span className="font-semibold text-yellow-600">
                      {t.risk_level}
                    </span>
                  </p>
                  <p>
                    Subscribers:{" "}
                    <span className="font-semibold">{t.subscribers}</span>
                  </p>

                  <div className="flex gap-3 mt-3">
                    <Button
                      onClick={() => handleCopy(t.trader_id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Copy Trader
                    </Button>
                    <Button
                      onClick={() => handleStopCopy(t.trader_id)}
                      variant="outline"
                      className="w-full"
                    >
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
