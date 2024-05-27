import { useState } from "react";

interface WebSocketHook {
    socket: WebSocket | null;
    connect: (url: string) => boolean;
    disconnect: () => boolean;
    reconnect: (newUrl: string) => boolean;
    sendMessage: (data: Object) => void;
}

// Custom hook to manage WebSocket connection
export const useWebSocket = (onMessageCallback: Function, onErrorCallback: Function): WebSocketHook => {
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

        ws.onerror = (error: Event) => {
            onErrorCallback("An error occurred");
            console.error("WebSocket error: ", error); // TODO - Show a generic error to the user
        };

        ws.onmessage = (event) => {
            if (onMessageCallback) {
                // TODO - Check if event.data is a Session
                onMessageCallback(JSON.parse(event.data));
            }
        };
        setSocket(ws);
        return true;
    };

    const sendMessage = (data: Object) => {
        if (!socket) return;

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
            console.log("Data sent: ", data, " to destination ", socket.url);
        } else {
            console.error("WebSocket connection is not open.");
        }
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

    return { socket, connect, disconnect, reconnect, sendMessage };
};
