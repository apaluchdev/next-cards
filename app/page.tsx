"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConnectToWebSocket } from "@/lib/connection-manager";
import GameCanvas from "@/components/game-components/game-canvas";
import { CopyTextButton } from "@/components/ui/copy-text-button";
import { useAppContext } from "@/context/app-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const router = useRouter();
  const { state, setState } = useAppContext();

  const linkURL = `localhost:3000/${state?.session}`;
  // Redirect to login if no userId cookie is found
  useEffect(() => {
    const userId = document.cookie.replace(
      /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!userId) {
      router.push("/login");
    }
  }, []);

  const handleClick = async (callback: Function) => {
    try {
      await ConnectToWebSocket(callback);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl">Welcome {state?.name}</h1>
      <div className="flex flex-col gap-4">
        {!state?.session && (
          <Button variant="default" onClick={() => handleClick(() => {})}>
            Create Game
          </Button>
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
              <Input id="link" defaultValue={linkURL} readOnly />
              <CopyTextButton link={linkURL}></CopyTextButton>
            </div>
          </div>
        </div>
      </div>
      <GameCanvas />
    </main>
  );
}
