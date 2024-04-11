"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
//import { useAppContext } from "@/context/app-context";
import LinkInvite from "@/components/ui/link-invite";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Check, CircleEllipsis, CircleUser, Delete } from "lucide-react";
import { Card } from "@/lib/game-types/card";
import { useSession } from "@/hooks/use-session";
import {
  CardsPlayedMessage,
  PlayerReadyMessage,
} from "@/lib/game-types/message";
import { useState } from "react";
import CardCarousel from "@/components/game-components/cheat/cheat-game";
import { Player } from "@/lib/game-types/player";

export default function Home() {
  // const { state, setState } = useAppContext();
  const router = useRouter();
  const [renderState, setRenderState] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const {
    ConnectSession,
    DisconnectSession,
    UpdateSession,
    CleanSession,
    SendMessage,
    sessionState,
  } = useSession();

  console.log("Rendering main page");

  function GetSelf(): Player | undefined {
    return sessionState.players.find(
      (p) => p.PlayerId == sessionState.playerId
    );
  }

  const idQueryParam = searchParams.get("id");
  //   router.push(`?id=${gameState.sessionUuid}`, {
  //     scroll: false,
  //   });

  const linkURL = sessionState?.sessionUuid
    ? `localhost:3000?id=${sessionState?.sessionUuid}` // TODO this should be the url param
    : "localhost:3000";

  const handleDisconnect = () => {
    DisconnectSession();
    router.push(`/`, {
      scroll: false,
    });
  };

  const ConnectionInfo: React.FC = () => {
    return (
      <div className="flex flex-row items-center gap-6">
        {sessionState?.sessionUuid && <LinkInvite url={linkURL} />}
        <PlayerList />
      </div>
    );
  };

  const SessionInfo: React.FC = () => {
    return (
      <div className="flex gap-6">
        <Button variant="destructive" onClick={handleDisconnect}>
          Disconnect
        </Button>
        {!sessionState.players.find((p) => p.PlayerId == sessionState.playerId)
          ?.Ready ? (
          <Button
            variant="affirmative"
            onClick={() =>
              SendMessage(new PlayerReadyMessage(sessionState.playerId, true))
            }
          >
            Ready
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={() =>
              SendMessage(new PlayerReadyMessage(sessionState.playerId, false))
            }
          >
            Cancel
          </Button>
        )}
      </div>
    );
  };

  const Title: React.FC = () => {
    return (
      <div className="mb-6">
        <h1 className="text-center text-6xl tracking-tight ">
          <div className="font-extrabold flex justify-center items-center text-8xl gap-4 text-gray-700">
            <Image
              src="/go-logo.png"
              alt="Golang logo"
              width={200}
              height={150}
            ></Image>
            <h1>Cards</h1>
          </div>
        </h1>
      </div>
    );
  };

  const PlayerList: React.FC = () => {
    if (!sessionState?.players) return null;

    return (
      <ScrollArea className="h-28 w-60 rounded-md border">
        <div className="p-4 flex flex-col gap-2">
          <h4 className="font-bold leading-none">Players</h4>
          <Separator />
          <div>
            {sessionState.players
              .filter((player) => player.PlayerId)
              .map((player) => (
                <div
                  className="text-sm font-medium"
                  key={"div" + player.PlayerId}
                >
                  <div className="flex items-center" key={player.PlayerId}>
                    <div className="flex items-center gap-2 min-w-44">
                      <CircleUser className="w-8" />
                      <p>{player.PlayerName}</p>
                    </div>
                    {player.Ready ? <Check /> : <CircleEllipsis />}
                  </div>
                  <Separator
                    key={"separator" + player.PlayerId}
                    className="my-2"
                  />
                </div>
              ))}
          </div>
        </div>
      </ScrollArea>
    );
  };

  const PlayerCards: React.FC = () => {
    var playerCards: Card[] =
      sessionState.players.find((p) => p.PlayerId == sessionState.playerId)
        ?.Cards ?? [];

    if (!playerCards) return null;
    console.log("Player cards: ", playerCards);
    return (
      <div>
        {playerCards
          .filter((card) => card.Suit)
          .map((card: Card) => (
            <div
              className="text-sm font-medium"
              key={"div" + card.Suit + card.Value}
            >
              <p>
                {card.Suit} {card.Value}
              </p>
            </div>
          ))}
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center flex-start p-6">
      <Title />
      <div className="flex flex-col gap-8 items-center w-full">
        {!sessionState.connected && (
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={() => ConnectSession(idQueryParam || "")}
            >
              {idQueryParam && idQueryParam != "null"
                ? "Join Game"
                : "Create Game"}
            </Button>
          </div>
        )}
        {sessionState.connected && <ConnectionInfo />}
        {/* <SessionInfo /> */}
        {sessionState.connected && <SessionInfo />}
        {sessionState.gameStarted && <PlayerCards />}
        <Button variant="default" onClick={() => setRenderState(!renderState)}>
          Re-Render
        </Button>
        <CardCarousel
          playingCards={GetSelf()?.Cards ?? []}
          cardsSelectedCallback={(cards: Card[]) =>
            SendMessage(
              new CardsPlayedMessage(GetSelf()?.PlayerId ?? "", cards, "")
            )
          }
        />
      </div>
    </main>
  );
}
