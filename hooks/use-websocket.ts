import React, { useState, useEffect } from "react";

interface WebSocketHook {
  socket: WebSocket | null;
  connect: (url: string) => boolean;
  disconnect: () => boolean;
  reconnect: (newUrl: string) => boolean;
}

// Custom hook to manage WebSocket connection
export const useWebSocket = (onMessageCallback: Function): WebSocketHook => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connect = (url: string) => {
    console.log("Attempting to connect to: ", url);
    var ws: WebSocket;

    try {
      ws = new WebSocket(url);
    } catch {
      console.log("Socket connection failed");
      return false;
    }

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      if (onMessageCallback) {
        onMessageCallback(JSON.parse(event.data));
      }
    };
    setSocket(ws);
    return true;
  };

  const disconnect = () => {
    if (socket) {
      try {
        socket.close();
      } catch {
        console.log("Failed to disconnect");
        return false;
      }
    }
    return true;
  };

  const reconnect = (newUrl: string) => {
    disconnect();
    return connect(newUrl);
  };

  return { socket, connect, disconnect, reconnect };
};

// export const MessageReceiver: React.FC<{
//   socket: WebSocket | null;
//   onMessage: (message: string) => void;
// }> = ({ socket, onMessage }) => {
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event: MessageEvent) => {
//       const message = JSON.parse(event.data);
//       onMessage(message);
//     };

//     socket.addEventListener("message", handleMessage);

//     return () => {
//       if (socket) {
//         socket.removeEventListener("message", handleMessage);
//       }
//     };
//   }, [socket, onMessage]);

//   return null;
// };
