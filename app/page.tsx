"use client";

import { CardHand } from "@/components/game-components/card-hand";
import Cheat from "@/components/game-components/cheat/cheat";
import { Session } from "@/components/session";
import { useSessionContext } from "@/context/session-context";
import { MockCards } from "@/lib/game-types/card-helper";

export default function Home() {
  const { session } = useSessionContext();

  return (
    <main className="flex min-h-screen flex-col items-center flex-start p-8">
      <Session>
        <Cheat />
      </Session>
      {/* <div className="w-96 h-96 shadow-inner bg-slate-50">
        <CardHand playingCards={MockCards} isViewOnly={false} canSelect={true} cardsSelectedCallback={() => console.log("Cards Selected")} />
      </div> */}
    </main>
  );
}
