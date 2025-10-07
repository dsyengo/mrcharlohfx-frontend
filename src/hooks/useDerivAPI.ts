import { useEffect, useRef } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

const APP_ID = import.meta.env.VITE_APP_ID;

export const useDerivAPI = () => {
  const apiRef = useRef<DerivAPIBasic | null>(null);

  useEffect(() => {
    const connection = new WebSocket(
      `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`
    );

    const api = new DerivAPIBasic({ connection });
    apiRef.current = api;

    return () => {
      connection.close();
    };
  }, []);

  return apiRef.current;
};
