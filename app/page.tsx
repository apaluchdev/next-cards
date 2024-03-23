"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
//import { useAppContext } from "@/context/app-context";
import { useWebSocket } from "@/hooks/use-websocket";
import LinkInvite from "@/components/ui/link-invite";
import { GameMessage, GameMessageTypes, GameState } from "@/lib/game-manager";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// TODO - implement that card game CHEAT with AI :)

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { state, setState } = useAppContext();
  const [message, setMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    sessionUuid: "",
    gameStarted: false,
  });

  const _gameState: GameState = gameState;

  const idQueryParam = searchParams.get("id");
  //   router.push(`?id=${gameState.sessionUuid}`, {
  //     scroll: false,
  //   });

  const linkURL = gameState?.sessionUuid
    ? `localhost:3000?id=${gameState?.sessionUuid}` // TODO this should be the url param
    : "localhost:3000";

  const handleMessage = (message: any) => {
    console.log("Message received:", message);
    setMessage(message); // Remove this later, make the gamestate function re-render if need be

    setGameState((prevState) => ({
      ...prevState,
    }));

    UpdateGameStateFromMessage(message, gameState, setGameState);
  };

  const { socket, connect, disconnect, reconnect } =
    useWebSocket(handleMessage);

  const handleConnectToWebSocket = () => {
    try {
      var result: boolean;
      if (idQueryParam) {
        result = connect(
          `ws://localhost:8080/session/connect?id=${idQueryParam}`
        );
      } else {
        result = connect("ws://localhost:8080/session/connect");
      }

      if (result) setIsConnected(true);
      else setIsConnected(false);
    } catch (error) {
      console.error("Error connecting to WebSocket", error);
    }
  };

  const handleDisconnect = () => {
    setGameState({
      players: [],
      sessionUuid: "",
      gameStarted: false,
    });
    disconnect();
    setIsConnected(false);
    router.push(`/`, {
      scroll: false,
    });
  };

  //console.log("Session UUID: ", gameState?.sessionUuid);
  const ConnectionInfo: React.FC = () => {
    return (
      <div className="flex flex-col items-center gap-4">
        {gameState?.sessionUuid && <LinkInvite url={linkURL} />}
        <Button variant="destructive" onClick={handleDisconnect}>
          Disconnect
        </Button>
        <PlayerList />
        {/* <div>
          {" "}
          <h1 className="font-semibold tracking-tight">Players:</h1>
          <ul>
            {gameState?.players &&
              gameState.players.map((player) => (
                <li key={player.PlayerId}>{player.PlayerName}</li>
              ))}
          </ul>
        </div> */}
      </div>
    );
  };

  const Title = () => {
    return (
      <div className="mb-12">
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

  const PlayerList = () => {
    if (!gameState?.players) return null;

    // gameState?.players.map((player) => {
    //   console.log(player.PlayerName);
    //   console.log(player.PlayerId);
    // });

    // return (
    //   <ScrollArea className="h-72 w-48 rounded-md border">
    //     <div className="p-4">
    //       <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
    //       {gameState.players.map((player) => (
    //         <li key={player.PlayerId}>{player.PlayerName}</li>
    //       ))}
    //     </div>
    //   </ScrollArea>
    // );
    return (
      <ScrollArea className="h-48 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Players</h4>
          {gameState.players.map((player) => (
            <div key={"div" + player.PlayerId}>
              <p key={player.PlayerId}>{player.PlayerName}</p>
              <Separator key={"separator" + player.PlayerId} className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center flex-start p-12 gap-8">
      <Title />
      <div className="flex flex-col gap-4">
        {!isConnected && (
          <Button variant="default" onClick={handleConnectToWebSocket}>
            {idQueryParam && idQueryParam != "null"
              ? "Join Game"
              : "Create Game"}
          </Button>
        )}
        {isConnected && <ConnectionInfo />}
      </div>
    </main>
  );
}

function UpdateGameStateFromMessage(
  gameMessage: GameMessage,
  currentGameState: GameState | undefined,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  if (!currentGameState) {
    return;
  }

  console.log("Message Type " + gameMessage.messageType);
  console.log(
    "Session id prior to handling message: " + currentGameState.sessionUuid
  );
  switch (gameMessage.messageType) {
    case GameMessageTypes.PLAYER_JOINED:
      console.log("Player joined", gameMessage.message);
      HandlePlayerJoined(gameMessage, currentGameState, setGameState);
      break;
    case GameMessageTypes.PLAYER_LEFT:
      console.log("Player left", gameMessage.message);
      break;
    case GameMessageTypes.SESSION_STARTED:
      console.log("Session Started Message: ", gameMessage.message);

      const playerObjects: Record<string, any> = gameMessage.message.players;
      const players: Player[] = Object.values(playerObjects).map((player) => {
        return { PlayerId: player.playerId, PlayerName: player.playerName };
      });

      console.log("Setting session ID: ", gameMessage.message.sessionId);

      console.log("Players at start: ", players);
      setGameState((prevState) => ({
        ...prevState,
        sessionUuid: gameMessage.message.sessionId,
        gameStarted: true,
        players: players,
      }));

      break;
    case GameMessageTypes.SESSION_ENDED:
      console.log("Game ended");
      break;
  }
}

function HandlePlayerJoined(
  gameMessage: GameMessage,
  currentGameState: GameState | undefined,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  if (!currentGameState?.players) return;

  let players = currentGameState.players;
  players.push({
    PlayerId: gameMessage.message.playerId,
    PlayerName: gameMessage.message.playerName,
  });

  console.log("Setting session ID: ", currentGameState.sessionUuid);

  // This is overwriting players with the old gameMessage
  setGameState((prevState) => {
    const playerExists = prevState.players.some(
      (player) => player.PlayerId === gameMessage.message.playerId
    );
    if (!playerExists) {
      prevState.players.push({
        PlayerId: gameMessage.message.playerId,
        PlayerName: gameMessage.message.playerName,
      });
    }
    return prevState;
  });
}
