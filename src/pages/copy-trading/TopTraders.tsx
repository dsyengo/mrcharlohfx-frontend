import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Copy } from "lucide-react";

type Trader = {
  trader_id: string;
  name: string;
  roi: number;
  win_rate: number;
  subscribers: number;
};

export default function TopTraders({
  traders,
  onSelectTrader,
}: {
  traders: Trader[];
  onSelectTrader: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-green-600" />
          Top Traders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {traders.length === 0 ? (
          <p className="text-gray-500 text-sm">Loading top traders...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {traders.slice(0, 6).map((t) => (
              <Card
                key={t.trader_id}
                className="p-3 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-semibold text-lg">{t.name}</h3>
                  <p className="text-sm text-gray-500">ID: {t.trader_id}</p>
                  <div className="mt-2 text-sm">
                    <p>
                      ROI:{" "}
                      <span className="text-green-600 font-semibold">
                        {t.roi.toFixed(2)}%
                      </span>
                    </p>
                    <p>
                      Win Rate:{" "}
                      <span className="text-blue-600 font-semibold">
                        {t.win_rate.toFixed(1)}%
                      </span>
                    </p>
                    <p>
                      Subscribers:{" "}
                      <span className="font-semibold">{t.subscribers}</span>
                    </p>
                  </div>
                </div>
                <Button
                  className="mt-3 flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => onSelectTrader(t.trader_id)}
                >
                  <Copy size={16} />
                  Copy Trader
                </Button>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
