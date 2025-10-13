import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Trade = {
  id: string;
  symbol: string;
  entry_price: number;
  current_price: number;
  profit: number;
  status: string;
};

export default function LiveTradesFeed({ trades }: { trades: Trade[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Trades Feed</CardTitle>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <p className="text-gray-500 text-sm">No active trades yet…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>Symbol</th>
                  <th>Entry</th>
                  <th>Current</th>
                  <th>Profit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td>{t.symbol}</td>
                    <td>{t.entry_price}</td>
                    <td>{t.current_price}</td>
                    <td
                      className={`font-semibold ${
                        t.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.profit.toFixed(2)}
                    </td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
