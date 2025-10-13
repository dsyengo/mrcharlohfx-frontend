import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TraderStats({ info }: { info: any }) {
  if (!info) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trader Performance Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">ROI</p>
          <p className="text-2xl font-semibold text-green-600">
            {info.roi?.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-gray-500">Win Rate</p>
          <p className="text-2xl font-semibold text-blue-600">
            {info.win_rate?.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-gray-500">Total Trades</p>
          <p className="text-2xl font-semibold text-purple-600">
            {info.total_trades}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
