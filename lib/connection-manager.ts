let websocket: WebSocket;
let connecting = false;
let websocketOpen = false;

export async function ConnectToWebSocket(callback: Function) {
    if (connecting || websocketOpen) return;

    connecting = true;

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("id");
    if (sessionId) {
        websocket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_GO_BACKEND}/session/connect?id=${sessionId}`);
    } else {
        websocket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_GO_BACKEND}/session/connect`);
    }

    websocket.onopen = function () {
        console.log("WebSocket connected.");
        websocketOpen = true;
        callback(websocketOpen);
    };

    websocket.onclose = function () {
        console.log("WebSocket disconnected.");
        websocketOpen = false;
        callback(false);
    };

    websocket.onerror = function (event: Event) {
        console.error("WebSocket error:", event);
        websocketOpen = false;
    };

    websocket.onmessage = function (event: MessageEvent) {
        const customEvent = new CustomEvent("gameDataUpdate", {
            detail: JSON.parse(event.data),
        });
        document.dispatchEvent(customEvent);
    };

    connecting = false;
}

export function SendData(data: Object) {
    if (!websocket) return;

    if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify(data));
        console.log("Data sent:", data);
    } else {
        console.error("WebSocket connection is not open.");
    }
}
