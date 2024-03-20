import React, { useState, useEffect } from "react";

// Custom hook to manage WebSocket connection
export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      "`ws://localhost:8080/session/connect?id=${sessionId}`"
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};
