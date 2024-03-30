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
import { useToast } from "@/components/ui/use-toast";
import { Check, CircleEllipsis } from "lucide-react";

// TODO - implement that card game CHEAT with AI :)

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  // const { state, setState } = useAppContext();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    sessionUuid: "",
    gameStarted: false,
    playerId: "",
    ready: false,
  });

  const idQueryParam = searchParams.get("id");
  //   router.push(`?id=${gameState.sessionUuid}`, {
  //     scroll: false,
  //   });

  const linkURL = gameState?.sessionUuid
    ? `localhost:3000?id=${gameState?.sessionUuid}` // TODO this should be the url param
    : "localhost:3000";

  const handleMessage = (message: any) => {
    console.log("Message received from server", message);
    toast({
      title: "Message Received From Server",
      description: message.messageType,
    });

    UpdateGameStateFromMessage(message, gameState, setGameState);
  };

  const { socket, connect, disconnect, reconnect, sendMessage } =
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
      playerId: "",
      ready: false,
    });
    disconnect();
    setIsConnected(false);
    router.push(`/`, {
      scroll: false,
    });
  };

  const ConnectionInfo: React.FC = () => {
    return (
      <div className="flex flex-row items-center gap-6">
        {gameState?.sessionUuid && <LinkInvite url={linkURL} />}
        <PlayerList />
      </div>
    );
  };

  const SessionInfo: React.FC = () => {
    return (
      <div className="">
        <h2>Game State:</h2>
        <p>Session UUID: {gameState.sessionUuid}</p>
        <p>Game Started: {gameState.gameStarted ? "Yes" : "No"}</p>
        <p className="">Players:</p>
        <ul className="font-normal">
          {gameState.players.map((player) => (
            <li key={player.PlayerId}>{player.PlayerName}</li>
          ))}
        </ul>
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
    if (!gameState?.players) return null;

    return (
      <ScrollArea className="h-28 w-48 rounded-md border">
        <div className="p-4 flex flex-col gap-2">
          <h4 className="font-bold leading-none">Players</h4>
          <Separator />
          <div>
            {gameState.players
              .filter((player) => player.PlayerId)
              .map((player) => (
                <div
                  className="text-sm font-medium"
                  key={"div" + player.PlayerId}
                >
                  <div
                    className="flex items-center gap-4"
                    key={player.PlayerId}
                  >
                    {player.PlayerName}
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

  return (
    <main className="flex min-h-screen flex-col items-center flex-start p-6">
      <Title />
      <div className="flex flex-col gap-8 items-center">
        {!isConnected && (
          <div className="flex gap-2">
            <Button variant="default" onClick={handleConnectToWebSocket}>
              {idQueryParam && idQueryParam != "null"
                ? "Join Game"
                : "Create Game"}
            </Button>
          </div>
        )}
        {isConnected && <ConnectionInfo />}
        {/* <SessionInfo /> */}
        {isConnected && (
          <div className="flex gap-6">
            <Button variant="destructive" onClick={handleDisconnect}>
              Disconnect
            </Button>
            {!gameState.ready ? (
              <Button
                variant="affirmative"
                onClick={() =>
                  sendMessage({
                    messageType: "playerReady",
                    messageTimestamp: new Date().toISOString(),
                    message: {
                      playerId: "todo",
                      playerReady: true,
                    },
                  })
                }
              >
                Ready
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() =>
                  sendMessage({
                    messageType: "playerReady",
                    messageTimestamp: new Date().toISOString(),
                    message: {
                      playerId: "todo",
                      playerReady: false,
                    },
                  })
                }
              >
                Cancel
              </Button>
            )}
          </div>
        )}
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

  switch (gameMessage.messageType) {
    case GameMessageTypes.PLAYER_JOINED:
      handlePlayerJoined(gameMessage, currentGameState, setGameState);
      break;
    case GameMessageTypes.PLAYER_LEFT:
      handlePlayerLeft(gameMessage, currentGameState, setGameState);
      break;
    case GameMessageTypes.SESSION_STARTED:
      handleSessionStarted(gameMessage, currentGameState, setGameState);
      break;
    case GameMessageTypes.SESSION_ENDED:
      handleSessionEnded(gameMessage, currentGameState, setGameState);
      break;
    case GameMessageTypes.SESSION_INFO:
      //handleSessionInfo(gameMessage, currentGameState, setGameState);
      break;
    case GameMessageTypes.PLAYER_READY:
      handlePlayerReady(gameMessage, currentGameState, setGameState);
      break;
  }
}

function handlePlayerJoined(
  gameMessage: GameMessage,
  currentGameState: GameState | undefined,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  console.log("Player joined");

  var playerJoinedMessage: PlayerJoined = gameMessage.message as PlayerJoined;

  if (!currentGameState || !playerJoinedMessage) return;

  console.log(playerJoinedMessage);

  // let players = currentGameState.players;
  // players.push({
  //   PlayerId: playerJoinedMessage.playerId,
  //   PlayerName: playerJoinedMessage.playerName,
  //   Ready: false,
  // });

  // This is overwriting players with the old gameMessage
  setGameState((prevState) => {
    const playerExists = prevState.players.some(
      (player) => player.PlayerId === gameMessage.message.playerId
    );
    if (!playerExists) {
      prevState.players.push({
        PlayerId: gameMessage.message.playerId,
        PlayerName: gameMessage.message.playerName,
        Ready: false,
      });
    }
    return prevState;
  });
}

function handlePlayerLeft(
  gameMessage: GameMessage,
  currentGameState: GameState | undefined,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  console.log("Player left", gameMessage.message);
}

function handleSessionStarted(
  gameMessage: GameMessage,
  currentGameState: GameState | undefined,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  console.log("Session Started: ", gameMessage.message);
  const playerObjects: Record<string, any> = gameMessage.message.players;
  const players: Player[] = Object.values(playerObjects)
    .filter((player) => !player.PlayerId)
    .map((player) => {
      return {
        PlayerId: player.playerId,
        PlayerName: player.playerName,
        Ready: false,
      };
    });

  setGameState((prevState) => ({
    ...prevState,
    sessionUuid: gameMessage.message.sessionId,
    gameStarted: true,
    players: players,
  }));
}

function handleSessionEnded(
  gameMessage: GameMessage,
  currentGameState: GameState | undefined,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  console.log("Session Ended: ", gameMessage.message);
}

function handleSessionInfo(
  gameMessage: GameMessage,
  currentGameState: GameState | undefined,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  console.log("Session Info:", gameMessage.message);
}

function handlePlayerReady(
  gameMessage: GameMessage,
  currentGameState: GameState | undefined,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  var playerReady: PlayerReady = gameMessage.message as PlayerReady;
  console.log("Player Ready: ", playerReady);

  setGameState((prevState) => {
    console.log("Setting player as ready");
    let player = prevState.players.find(
      (player) => player.PlayerId === playerReady.playerId
    );
    if (player) {
      console.log("Set player as ready!");
      player.Ready = playerReady.playerReady;
    }
    return prevState;
  });
}
