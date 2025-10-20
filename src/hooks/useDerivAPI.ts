// pages/analysis/hooks/useDerivApi.ts
import { useState, useCallback, useRef, useEffect } from "react";

const app_id = import.meta.env.VITE_APP_ID || "1089"; // Default app_id

export function useDerivApi() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const activeSubscriptionRef = useRef<{
    symbol: string;
    callback: (data: any) => void;
  } | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    // Prevent multiple connection attempts
    if (wsRef.current?.readyState === WebSocket.OPEN || isConnecting) {
      return;
    }

    // Clear any existing reconnect timeout
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    setIsConnecting(true);
    console.log(
      `🔗 Connecting to Deriv API (attempt ${
        reconnectAttemptsRef.current + 1
      })...`
    );

    try {
      const ws = new WebSocket(
        `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
      );

      ws.onopen = () => {
        console.log("✅ Connected to Deriv WS API");
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;

        // Start ping interval to keep connection alive
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ ping: 1 }));
          }
        }, 30000);

        // Resubscribe if there was an active subscription
        if (activeSubscriptionRef.current) {
          const { symbol, callback } = activeSubscriptionRef.current;
          console.log(`🔄 Resubscribing to ${symbol} after reconnect`);
          subscribe(symbol, callback);
        }
      };

      ws.onclose = (event) => {
        console.log("❌ WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);

        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        // Don't reconnect if closed normally
        if (event.code === 1000) {
          console.log("WebSocket closed normally");
          return;
        }

        // Exponential backoff for reconnection
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000
        );
        reconnectAttemptsRef.current++;

        console.log(`🔄 Reconnecting in ${delay}ms...`);
        setTimeout(() => {
          if (reconnectAttemptsRef.current <= maxReconnectAttempts) {
            connect();
          }
        }, delay);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        setIsConnecting(false);
      };

      // Handle incoming messages with proper error handling
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Raw WebSocket message:", data);

          // Handle pong responses
          if (data.msg_type === "pong") {
            return;
          }

          // Handle tick data with proper validation
          if (data.msg_type === "tick") {
            // Validate tick data structure
            if (!data.tick) {
              console.warn("⚠️ Tick data missing tick property:", data);
              return;
            }

            if (!data.tick.symbol || !data.tick.quote) {
              console.warn("⚠️ Incomplete tick data:", data.tick);
              return;
            }

            const processedData = {
              symbol: data.tick.symbol,
              price: parseFloat(data.tick.quote),
              timestamp: data.tick.epoch ? data.tick.epoch * 1000 : Date.now(),
              ask: data.tick.ask ? parseFloat(data.tick.ask) : undefined,
              bid: data.tick.bid ? parseFloat(data.tick.bid) : undefined,
            };

            console.log("✅ Processed tick data:", processedData);

            // Send to active subscription callback
            if (activeSubscriptionRef.current?.callback) {
              activeSubscriptionRef.current.callback(processedData);
            }
          }

          // Handle subscription responses
          if (data.msg_type === "tick_history") {
            console.log("📊 Tick history response received");
            if (data.error) {
              console.error("❌ Subscription error:", data.error);
            }
          }

          // Handle forget responses
          if (data.msg_type === "forget") {
            console.log("📊 Unsubscribe confirmation received");
          }

          // Handle authorization responses
          if (data.msg_type === "authorize") {
            if (data.error) {
              console.error("❌ Authorization error:", data.error);
            } else {
              console.log("✅ Authorization successful");
            }
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
          console.log("📨 Raw message that caused error:", event.data);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to connect to Deriv API:", error);
      setIsConnecting(false);

      // Retry connection after delay
      setTimeout(() => {
        if (reconnectAttemptsRef.current <= maxReconnectAttempts) {
          connect();
        }
      }, 3000);
    }
  }, [isConnecting]);

  const subscribe = useCallback(
    (symbol: string, onData: (data: any) => void) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.log(
          "⏳ WebSocket not ready, storing subscription for later..."
        );
        activeSubscriptionRef.current = { symbol, callback: onData };

        // Trigger connection if not already connecting
        if (!isConnecting && !isConnected) {
          connect();
        }
        return;
      }

      console.log(`📡 Subscribing to ${symbol}`);

      // Store the active subscription
      activeSubscriptionRef.current = { symbol, callback: onData };

      // Subscribe to ticks with proper error handling
      const subscribeMessage = {
        ticks: symbol,
        subscribe: 1,
      };

      try {
        wsRef.current.send(JSON.stringify(subscribeMessage));
        console.log(`✅ Subscription request sent for ${symbol}`);
      } catch (error) {
        console.error("❌ Error sending subscription message:", error);
        // Retry subscription after short delay
        setTimeout(() => subscribe(symbol, onData), 1000);
      }
    },
    [isConnected, isConnecting, connect]
  );

  const unsubscribe = useCallback(() => {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      activeSubscriptionRef.current
    ) {
      const unsubscribeMessage = {
        forget: activeSubscriptionRef.current.symbol,
      };

      try {
        wsRef.current.send(JSON.stringify(unsubscribeMessage));
        console.log(
          `📡 Unsubscribe request sent for ${activeSubscriptionRef.current.symbol}`
        );
      } catch (error) {
        console.error("❌ Error sending unsubscribe message:", error);
      }
    }

    activeSubscriptionRef.current = null;
  }, []);

  const disconnect = useCallback(() => {
    console.log("🔌 Manually disconnecting WebSocket...");

    // Clear intervals
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    // Reset reconnection attempts
    reconnectAttemptsRef.current = maxReconnectAttempts + 1;

    // Close WebSocket
    if (wsRef.current) {
      unsubscribe();
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
  }, [unsubscribe]);

  // Auto-connect on component mount
  useEffect(() => {
    connect();

    return () => {
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
  };
}
