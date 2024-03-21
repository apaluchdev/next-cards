import React, { useState, useEffect } from "react";

interface WebSocketHook {
  socket: WebSocket | null;
  connect: (url: string) => void;
  disconnect: () => void;
  reconnect: (newUrl: string) => void;
}

// Custom hook to manage WebSocket connection
export const useWebSocket = (): WebSocketHook => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connect = (url: string) => {
    console.log("Attempting to connect to: ", url);
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    setSocket(ws);
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
    }
  };

  const reconnect = (newUrl: string) => {
    disconnect();
    connect(newUrl);
  };

  return { socket, connect, disconnect, reconnect };
};

export const MessageReceiver: React.FC<{
  socket: WebSocket | null;
  onMessage: (message: string) => void;
}> = ({ socket, onMessage }) => {
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      if (socket) {
        socket.removeEventListener("message", handleMessage);
      }
    };
  }, [socket, onMessage]);

  return null;
};
