// pages/analysis/components/ConnectionStatus.tsx
interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  lastTickTime: number | null;
  marketDataLength: number;
  error?: string | null;
  onRetry?: () => void;
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
  lastTickTime,
  marketDataLength,
  error,
  onRetry,
}: ConnectionStatusProps) {
  const getStatusColor = () => {
    if (error) return "bg-red-100 text-red-800 border-red-200";
    if (isConnected) return "bg-green-100 text-green-800 border-green-200";
    if (isConnecting) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (isConnected) return "Connected to Market Data";
    if (isConnecting) return "Connecting...";
    return "Disconnected";
  };

  const getStatusIcon = () => {
    if (error) return "🔴";
    if (isConnected) return "🟢";
    if (isConnecting) return "🟡";
    return "⚫";
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main Status */}
      <div
        className={`px-4 py-3 rounded-lg border-2 ${getStatusColor()} transition-all duration-300`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <div className="font-semibold">{getStatusText()}</div>
            {isConnected && lastTickTime && (
              <div className="text-sm opacity-80">
                Last update: {new Date(lastTickTime).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex flex-wrap justify-center gap-3">
        {marketDataLength > 0 && (
          <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200">
            📊 {marketDataLength} ticks received
          </div>
        )}

        {error && onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full border border-orange-200 hover:bg-orange-200 transition-colors"
          >
            🔄 Retry Connection
          </button>
        )}

        {isConnecting && (
          <div className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full border border-purple-200">
            ⏳ Establishing connection...
          </div>
        )}
      </div>

      {/* Connection Tips */}
      {error && (
        <div className="text-center max-w-md">
          <p className="text-sm text-gray-600">💡 Connection tips:</p>
          <ul className="text-xs text-gray-500 mt-1 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Ensure Deriv API is accessible</li>
            <li>• Try refreshing the page</li>
            <li>• Verify your app_id is valid</li>
          </ul>
        </div>
      )}
    </div>
  );
}
