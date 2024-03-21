"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GameCanvas from "@/components/game-components/game-canvas";
import { CopyTextButton } from "@/components/ui/copy-text-button";
import { useAppContext } from "@/context/app-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageReceiver, useWebSocket } from "@/hooks/use-websocket";

// TODO - implement that card game CHEAT with AI :)

export default function Home() {
  const router = useRouter();
  const { state, setState } = useAppContext();
  const [message, setMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const linkURL = state?.session
    ? `ws://localhost:8080/session/connect?id=${state?.session}` // TODO this should be the url param
    : "ws://localhost:8080/session/connect";

  const { socket, connect, disconnect, reconnect } = useWebSocket();

  // Redirect to login if no userId cookie is found - TODO make this middleware
  useEffect(() => {
    const userId = document.cookie.replace(
      /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!userId) {
      router.push("/login");
    }
  }, []);

  const handleMessage = (message: string) => {
    console.log("Message received:", message);
    setMessage(message);
  };

  const handleConnectToWebSocket = () => {
    try {
      connect(linkURL);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to WebSocket", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl">Welcome {state?.name}</h1>
      <div className="flex flex-col gap-4">
        {!isConnected && (
          <Button variant="default" onClick={handleConnectToWebSocket}>
            Create Game
          </Button>
        )}
        {isConnected && (
          <MessageReceiver socket={socket} onMessage={handleMessage} />
        )}
        <div className="flex justify-center items-center gap-2 tracking-tight">
          <div className="grid flex-1 gap-2">
            <div>
              <h1 className="text-xl font-medium">Invite Players</h1>
              <p className="text-sm">
                Other players can join your session with this link
              </p>
            </div>
            <div></div>
            <Label htmlFor="link" className="sr-only">
              {linkURL}
            </Label>
            <div className="flex gap-2 items-center">
              <Input id="link" defaultValue={linkURL || ""} readOnly />
              <CopyTextButton link={linkURL || ""}></CopyTextButton>
            </div>
          </div>
        </div>
      </div>
      <GameCanvas />
    </main>
  );
}
