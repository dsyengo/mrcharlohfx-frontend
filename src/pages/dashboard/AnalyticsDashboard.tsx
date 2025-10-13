// components/dashboard/AnalyticsDashboard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Clock, 
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { useBotStore } from '@/stores/bot-store';

// Mock data - replace with real Deriv API data later
const mockAnalytics = {
  totalTrades: 47,
  profitableTrades: 32,
  totalProfit: 1250.75,
  winRate: 68.1,
  currentBalance: 10500.50,
  dailyPerformance: [
    { date: 'Mon', profit: 150 },
    { date: 'Tue', profit: -50 },
    { date: 'Wed', profit: 300 },
    { date: 'Thu', profit: 200 },
    { date: 'Fri', profit: 400 },
    { date: 'Sat', profit: 100 },
    { date: 'Sun', profit: 150 },
  ],
  recentTrades: [
    { id: 1, symbol: 'R_100', type: 'CALL', amount: 10, profit: 8.50, timestamp: '2024-01-15 10:30:00' },
    { id: 2, symbol: '1HZ100V', type: 'PUT', amount: 15, profit: -5.25, timestamp: '2024-01-15 10:25:00' },
    { id: 3, symbol: 'R_100', type: 'CALL', amount: 10, profit: 12.75, timestamp: '2024-01-15 10:20:00' },
    { id: 4, symbol: '1HZ150V', type: 'CALL', amount: 20, profit: 18.20, timestamp: '2024-01-15 10:15:00' },
  ]
};

const AnalyticsDashboard: React.FC = () => {
  const { currentBot, isRunning } = useBotStore();

  if (!currentBot) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Available</h3>
            <p>Create or load a bot to see performance analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${mockAnalytics.totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.winRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {mockAnalytics.profitableTrades} of {mockAnalytics.totalTrades} trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockAnalytics.currentBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +$1,250.75 all time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isRunning ? (
                <Badge variant="default" className="bg-green-600">Running</Badge>
              ) : (
                <Badge variant="outline">Stopped</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Last active: 2 min ago
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Profit/Loss over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {mockAnalytics.dailyPerformance.map((day, index) => (
                    <div key={day.date} className="flex flex-col items-center space-y-2 flex-1">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          day.profit >= 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ height: `${Math.abs(day.profit) / 10}px` }}
                      />
                      <span className="text-xs font-medium">{day.date}</span>
                      <span className={`text-xs ${day.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${day.profit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategy Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Profit per Trade</span>
                  <span className="text-sm font-bold text-green-600">$26.61</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Max Drawdown</span>
                  <span className="text-sm font-bold text-red-600">-$150.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sharpe Ratio</span>
                  <span className="text-sm font-bold">1.45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Runtime</span>
                  <span className="text-sm font-bold">47 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-sm font-bold">A+</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>Last 50 trades executed by your bot</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Trade ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Symbol</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Profit/Loss</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAnalytics.recentTrades.map((trade) => (
                      <tr key={trade.id} className="border-b">
                        <td className="p-4 align-middle">#{trade.id}</td>
                        <td className="p-4 align-middle font-medium">{trade.symbol}</td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant={trade.type === 'CALL' ? 'default' : 'secondary'}
                            className={trade.type === 'CALL' ? 'bg-blue-600' : 'bg-gray-600'}
                          >
                            {trade.type}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">${trade.amount}</td>
                        <td className="p-4 align-middle">
                          <span className={trade.profit >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                            {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {trade.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit Distribution</CardTitle>
                <CardDescription>Spread of profitable vs losing trades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                      {/* Profit circle */}
                      <div
                        className="absolute inset-0 rounded-full bg-green-500 border-8 border-green-200"
                        style={{
                          clipPath: `circle(50% at 50% 50%)`,
                        }}
                      />
                      {/* Loss circle segment */}
                      <div
                        className="absolute inset-0 rounded-full bg-red-500 border-8 border-red-200"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
                          transform: 'rotate(180deg)',
                        }}
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm">Profitable: {mockAnalytics.profitableTrades}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-sm">Losing: {mockAnalytics.totalTrades - mockAnalytics.profitableTrades}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Monthly performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Advanced charts coming soon</p>
                    <p className="text-sm">Integration with trading view charts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;