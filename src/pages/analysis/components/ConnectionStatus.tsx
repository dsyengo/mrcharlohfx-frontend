// components/ConnectionStatus.tsx
interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  lastTickTime: number | null;
  marketDataLength: number;
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
  lastTickTime,
  marketDataLength,
}: ConnectionStatusProps) {
  const getConnectionStatus = () => {
    if (isConnected)
      return {
        text: "Live",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    if (isConnecting)
      return {
        text: "Connecting...",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    return {
      text: "Disconnected",
      color: "bg-red-100 text-red-800 border-red-200",
    };
  };

  const status = getConnectionStatus();

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium border ${status.color}`}
      >
        {isConnected ? "🔵" : isConnecting ? "🟡" : "🔴"} {status.text}
      </div>

      {lastTickTime && isConnected && (
        <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
          Last: {new Date(lastTickTime).toLocaleTimeString()}
        </div>
      )}

      {marketDataLength > 0 && (
        <div className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full border border-purple-200">
          Ticks: {marketDataLength}
        </div>
      )}

      {!isConnected && !isConnecting && (
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full border border-gray-300 hover:bg-gray-200 transition-colors"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
