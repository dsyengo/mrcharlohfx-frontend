// pages/analysis/hooks/useDerivApi.ts
import { useState, useCallback, useRef, useEffect } from "react";

export function useDerivApi() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const activeSubscriptionRef = useRef<{
    symbol: string;
    callback: (data: any) => void;
  } | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear existing timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (isConnecting) {
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    console.log("🔗 Establishing WebSocket connection to Deriv API...");

    try {
      const app_id = import.meta.env.VITE_APP_ID;
      if (!app_id) {
        throw new Error(
          "VITE_APP_ID is not configured in environment variables"
        );
      }

      const wsUrl = `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`;
      console.log("🔧 WebSocket URL:", wsUrl);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("✅ WebSocket connection successfully established");
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);

        // Start keep-alive ping
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({ ping: 1 }));
            } catch (error) {
              console.error("❌ Ping failed:", error);
            }
          }
        }, 30000); // Ping every 30 seconds

        // Resubscribe if we have an active subscription
        if (activeSubscriptionRef.current) {
          const { symbol, callback } = activeSubscriptionRef.current;
          console.log(`🔄 Auto-resubscribing to ${symbol}`);
          setTimeout(() => subscribe(symbol, callback), 100);
        }
      };

      ws.onclose = (event) => {
        console.log(
          `❌ WebSocket closed: ${event.code} - ${
            event.reason || "No reason provided"
          }`
        );
        setIsConnected(false);
        setIsConnecting(false);

        // Clear intervals
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        // Don't reconnect for normal closures
        if (event.code === 1000) {
          console.log("ℹ️ Normal WebSocket closure");
          return;
        }

        // Auto-reconnect after delay for abnormal closures
        const errorMessage = getWebSocketError(event.code);
        setConnectionError(`${errorMessage}. Reconnecting...`);

        console.log("🔄 Scheduling reconnection in 3 seconds...");
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket error event:", error);
        setConnectionError(
          "Network connection error. Check your internet connection."
        );
        setIsConnecting(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle different message types
          switch (data.msg_type) {
            case "authorize":
              if (data.error) {
                console.error("❌ Authorization error:", data.error);
                setConnectionError(
                  `Authentication failed: ${data.error.message}`
                );
                ws.close(); // Close connection on auth failure
              } else {
                console.log("✅ Authorization successful");
              }
              break;

            case "tick":
              if (data.tick && activeSubscriptionRef.current?.callback) {
                const processedData = {
                  symbol: data.tick.symbol,
                  price: parseFloat(data.tick.quote),
                  timestamp: data.tick.epoch * 1000,
                  ask: data.tick.ask ? parseFloat(data.tick.ask) : undefined,
                  bid: data.tick.bid ? parseFloat(data.tick.bid) : undefined,
                };
                activeSubscriptionRef.current.callback(processedData);
              }
              break;

            case "tick_history":
              if (data.error) {
                console.error("❌ Subscription error:", data.error);
                setConnectionError(
                  `Subscription failed: ${data.error.message}`
                );
              } else {
                console.log("✅ Subscription confirmed for tick data");
              }
              break;

            case "forget":
              console.log("✅ Unsubscribe confirmed");
              break;

            case "pong":
              // Silent handling for pong responses
              break;

            default:
              console.log("📨 Received message:", data.msg_type, data);
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
          console.log("📨 Raw message:", event.data);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("❌ Failed to create WebSocket connection:", error);
      setConnectionError("Failed to initialize WebSocket connection");
      setIsConnecting(false);

      // Retry connection after delay
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    }
  }, [isConnecting]);

  const subscribe = useCallback(
    (symbol: string, onData: (data: any) => void) => {
      console.log(`📡 Requesting subscription to: ${symbol}`);

      // Store subscription info
      activeSubscriptionRef.current = { symbol, callback: onData };

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.log("⏳ WebSocket not ready, will subscribe when connected");
        if (!isConnecting && !isConnected) {
          connect();
        }
        return;
      }

      try {
        const subscribeMessage = {
          ticks: symbol,
          subscribe: 1,
        };

        console.log("📤 Sending subscription message:", subscribeMessage);
        wsRef.current.send(JSON.stringify(subscribeMessage));
        console.log(`✅ Subscription request sent for: ${symbol}`);
      } catch (error) {
        console.error("❌ Failed to send subscription request:", error);
        setConnectionError("Failed to subscribe to market data");
      }
    },
    [isConnected, isConnecting, connect]
  );

  const unsubscribe = useCallback(() => {
    if (
      activeSubscriptionRef.current &&
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      try {
        const unsubscribeMessage = {
          forget: activeSubscriptionRef.current.symbol,
        };
        wsRef.current.send(JSON.stringify(unsubscribeMessage));
        console.log(
          `📡 Unsubscribed from: ${activeSubscriptionRef.current.symbol}`
        );
      } catch (error) {
        console.error("❌ Failed to send unsubscribe request:", error);
      }
    }
    activeSubscriptionRef.current = null;
  }, []);

  const disconnect = useCallback(() => {
    console.log("🔌 Manual disconnect requested");

    // Clear timeouts and intervals
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    // Close WebSocket
    if (wsRef.current) {
      unsubscribe();
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError("Manually disconnected");
  }, [unsubscribe]);

  // Auto-connect on mount
  useEffect(() => {
    console.log("🚀 Initializing Deriv API connection...");
    connect();

    return () => {
      console.log("🧹 Cleaning up Deriv API connection...");
      disconnect();
    };
  }, []);

  return {
    connect,
    subscribe,
    unsubscribe,
    disconnect,
    isConnected,
    isConnecting,
    connectionError,
  };
}

// Helper function to interpret WebSocket error codes
function getWebSocketError(code: number): string {
  const errorMessages: { [key: number]: string } = {
    1000: "Normal closure",
    1001: "Endpoint going away",
    1002: "Protocol error",
    1003: "Unsupported data",
    1005: "No status received",
    1006: "Abnormal closure - Check app_id and network",
    1007: "Invalid frame payload data",
    1008: "Policy violation",
    1009: "Message too big",
    1010: "Missing extension",
    1011: "Internal error",
    1012: "Service restart",
    1013: "Try again later",
    1014: "Bad gateway",
    1015: "TLS handshake failed",
  };

  return errorMessages[code] || `WebSocket error ${code}`;
}
