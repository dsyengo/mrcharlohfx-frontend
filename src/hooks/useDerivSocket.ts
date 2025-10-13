// hooks/useDerivSocket.ts
import { useEffect, useRef, useState } from "react";
import { derivApi } from "@/services/derivApi";
import { TickData } from "@/types/deriv";

export const useDerivSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleError = (error: any) =>
      setError(error.message || "WebSocket error");
    const handleTick = (data: any) => {
      if (data.tick) {
        const tickData: TickData = {
          ...data.tick,
          digit: data.tick.quote
            ? parseInt(data.tick.quote.toString().slice(-1))
            : undefined,
        };
        setTicks((prev) => [...prev.slice(-999), tickData]); // Keep last 1000 ticks
      }
    };

    derivApi.on("connected", handleConnected);
    derivApi.on("disconnected", handleDisconnected);
    derivApi.on("error", handleError);
    derivApi.on("tick", handleTick);

    return () => {
      derivApi.off("connected", handleConnected);
      derivApi.off("disconnected", handleDisconnected);
      derivApi.off("error", handleError);
      derivApi.off("tick", handleTick);
    };
  }, []);

  const subscribeToSymbol = async (symbol: string) => {
    try {
      await derivApi.subscribeTicks(symbol);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const unsubscribeFromSymbol = async (symbol: string) => {
    try {
      await derivApi.unsubscribeTicks(symbol);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const authorize = async (token: string) => {
    try {
      const response = await derivApi.authorize(token);
      setError(null);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    isConnected,
    ticks,
    error,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    authorize,
    derivApi,
  };
};

