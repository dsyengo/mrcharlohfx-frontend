// pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useDerivSocket } from "@/hooks/useDerivSocket";
import { useTicks } from "@/hooks/useTicks";
import { useAnalyticsStore } from "@/stores/analytics.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  BarChart,
  Activity,
  TrendingUp,
  Zap,
  AlertTriangle,
  Download,
  Play,
  Square,
} from "lucide-react";
import Layout from "@/layouts/Layout";

const AnalysisPage: React.FC = () => {
  const {
    isConnected,
    ticks,
    error,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    authorize,
  } = useDerivSocket();

  const {
    digitAnalysis,
    volatility,
    movingAverages,
    getRecentDigits,
    detectPatterns,
  } = useTicks(ticks);

  const { selectedMarket, setMarket, addTick, clearTicks, exportData } =
    useAnalyticsStore();

  const [apiToken, setApiToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // Auto-add ticks to store
    ticks.forEach((tick) => {
      addTick(tick);
    });
  }, [ticks, addTick]);

  const handleAuthorize = async () => {
    try {
      await authorize(apiToken);
      setIsAuthorized(true);
    } catch (err) {
      console.error("Authorization failed:", err);
    }
  };

  const handleStartStreaming = async () => {
    try {
      await subscribeToSymbol(selectedMarket);
      setIsStreaming(true);
    } catch (err) {
      console.error("Failed to start streaming:", err);
    }
  };

  const handleStopStreaming = async () => {
    try {
      await unsubscribeFromSymbol(selectedMarket);
      setIsStreaming(false);
    } catch (err) {
      console.error("Failed to stop streaming:", err);
    }
  };

  const recentPatterns = detectPatterns(getRecentDigits(10));

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Deriv Analytics & Strategy Tool
            </h1>
            <p className="text-muted-foreground">
              Professional trading analytics for Digits and volatility indices
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Badge variant={isAuthorized ? "default" : "secondary"}>
              {isAuthorized ? "Authorized" : "Unauthorized"}
            </Badge>
          </div>
        </div>

        {/* Authentication */}
        {!isAuthorized && (
          <Card>
            <CardHeader>
              <CardTitle>API Authentication</CardTitle>
              <CardDescription>
                Enter your Deriv API token to connect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter Deriv API token"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAuthorize}>Authorize</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Controls */}
        {isAuthorized && (
          <Card>
            <CardHeader>
              <CardTitle>Market Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex gap-2">
                  <select
                    value={selectedMarket}
                    onChange={(e) => setMarket(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="R_10">Volatility 10 Index</option>
                    <option value="R_25">Volatility 25 Index</option>
                    <option value="R_50">Volatility 50 Index</option>
                    <option value="R_75">Volatility 75 Index</option>
                    <option value="R_100">Volatility 100 Index</option>
                  </select>

                  {!isStreaming ? (
                    <Button onClick={handleStartStreaming}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Streaming
                    </Button>
                  ) : (
                    <Button onClick={handleStopStreaming} variant="destructive">
                      <Square className="w-4 h-4 mr-2" />
                      Stop Streaming
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 ml-auto">
                  <Button onClick={clearTicks} variant="outline">
                    Clear Data
                  </Button>
                  <Button onClick={() => exportData("csv")} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Analytics */}
        {isAuthorized && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="digits">Digit Analysis</TabsTrigger>
              <TabsTrigger value="volatility">Volatility</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Ticks
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{ticks.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Real-time data points
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Current Volatility
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {volatility.currentVolatility.toFixed(4)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trend: {volatility.volatilityTrend}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Most Frequent Digit
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {digitAnalysis.length > 0
                        ? digitAnalysis.reduce((max, curr) =>
                            curr.percentage > max.percentage ? curr : max
                          ).digit
                        : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on last {ticks.length} ticks
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pattern Alerts
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {recentPatterns.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recent patterns detected
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border rounded-lg">
                      <p className="text-muted-foreground">
                        Real-time chart visualization
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Digit Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border rounded-lg">
                      <p className="text-muted-foreground">
                        Digit frequency chart
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="digits">
              <Card>
                <CardHeader>
                  <CardTitle>Digit Frequency Analysis</CardTitle>
                  <CardDescription>
                    Distribution of last digits from tick data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {digitAnalysis.map((digit) => (
                      <div
                        key={digit.digit}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {digit.digit}
                          </div>
                          <div>
                            <p className="font-medium">Digit {digit.digit}</p>
                            <p className="text-sm text-muted-foreground">
                              Frequency: {digit.frequency} ticks
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {digit.percentage.toFixed(2)}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expected: {digit.expectedValue.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="volatility">
              <Card>
                <CardHeader>
                  <CardTitle>Volatility Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Current Volatility:</span>
                        <span className="font-bold">
                          {volatility.currentVolatility.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Volatility:</span>
                        <span className="font-bold">
                          {volatility.averageVolatility.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variance:</span>
                        <span className="font-bold">
                          {volatility.tickVariance.toFixed(8)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trend:</span>
                        <Badge
                          variant={
                            volatility.volatilityTrend === "increasing"
                              ? "destructive"
                              : volatility.volatilityTrend === "decreasing"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {volatility.volatilityTrend}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Moving Averages</h4>
                      {movingAverages.map((ma) => (
                        <div key={ma.period} className="flex justify-between">
                          <span>MA{ma.period}:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">
                              {ma.value.toFixed(4)}
                            </span>
                            <Badge
                              variant={
                                ma.trend === "up"
                                  ? "default"
                                  : ma.trend === "down"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {ma.trend}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns">
              <Card>
                <CardHeader>
                  <CardTitle>Pattern Detection</CardTitle>
                  <CardDescription>
                    Recent patterns and anomalies in digit sequences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPatterns.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No significant patterns detected in recent ticks</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentPatterns.map((pattern, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg bg-yellow-50 border-yellow-200"
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800">
                              {pattern}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Recent Digits</h4>
                    <div className="flex gap-1 flex-wrap">
                      {getRecentDigits(20).map((digit, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded border flex items-center justify-center text-sm font-medium bg-background"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AnalysisPage;
