import { Player } from "@/lib/game-types/player";
import { useState } from "react";
import { useWebSocket } from "./use-websocket";
import {
  CardsDealtMessage,
  CardsPlayedMessage,
  PlayerJoinedMessage,
  PlayerReadyMessage,
  SessionMessage,
  SessionMessageType,
  SessionStartedMessage,
} from "@/lib/game-types/message";

export type SessionState = {
  players: Player[];
  sessionUuid: string;
  gameStarted: boolean;
  connected: boolean;
  playerId: string;
};

interface SessionHook {
  ConnectSession: (id: string) => string;
  DisconnectSession: () => void;
  UpdateSession: (url: SessionMessage) => void;
  CleanSession: () => void;
  SendMessage: (data: SessionMessage) => void;
  sessionState: SessionState;
}

// Custom hook to manage properties common to all sessions
export const useSession = (): SessionHook => {
  const [sessionState, setSessionState] = useState<SessionState>({
    players: [],
    sessionUuid: "",
    gameStarted: false,
    connected: false,
    playerId: "",
  });
  const { socket, connect, disconnect, reconnect, sendMessage } = useWebSocket(
    (message: any) => UpdateSession(message)
  );

  const ConnectSession = (id: string) => {
    try {
      var result: boolean = id
        ? connect(`ws://localhost:8080/session/connect?id=${id}`)
        : connect("ws://localhost:8080/session/connect");

      if (result) setSessionState({ ...sessionState, connected: true });
      else setSessionState({ ...sessionState, connected: false });
    } catch (error) {
      console.error("Error connecting to WebSocket", error);
    }

    return id;
  };

  const DisconnectSession = () => {
    disconnect();
    CleanSession();
  };

  const SendMessage = (data: SessionMessage) => {
    sendMessage(data);
  };

  const CleanSession = () => {
    setSessionState({
      players: [],
      sessionUuid: "",
      gameStarted: false,
      connected: false,
      playerId: "",
    });
  };

  const UpdateSession = (message: SessionMessage) => {
    console.log("Message Received: ", message);

    switch (message.messageInfo.messageType) {
      case SessionMessageType.PLAYER_JOINED:
        handlePlayerJoined(message);
        break;
      case SessionMessageType.PLAYER_LEFT:
        handlePlayerLeft(message);
        break;
      case SessionMessageType.SESSION_STARTED:
        handleSessionStarted(message);
        break;
      case SessionMessageType.GAME_STARTED:
        handleGameStarted(message);
        break;
      case SessionMessageType.SESSION_ENDED:
        handleSessionEnded(message);
        break;
      case SessionMessageType.SESSION_INFO:
        handleSessionInfo(message);
        break;
      case SessionMessageType.PLAYER_READY:
        handlePlayerReady(message);
        break;
      case SessionMessageType.CARDS_DEALT:
        handleCardsDealt(message);
        break;
    }
  };

  const handlePlayerJoined = (gameMessage: SessionMessage) => {
    var playerJoinedMessage = gameMessage as PlayerJoinedMessage;

    if (!playerJoinedMessage) return;

    setSessionState((prevState) => {
      const playerExists = prevState.players.some(
        (player) => player.PlayerId === playerJoinedMessage.playerId
      );
      if (!playerExists) {
        prevState.players.push({
          PlayerId: playerJoinedMessage.playerId,
          PlayerName: playerJoinedMessage.playerName,
          Ready: false,
          Cards: [],
        });
      }
      return { ...prevState };
    });
  };

  const handlePlayerLeft = (gameMessage: SessionMessage) => {
    console.log("Handling player left");
  };

  const handleSessionStarted = (gameMessage: SessionMessage) => {
    var sessionStartedMsg = gameMessage as SessionStartedMessage;
    console.log("Handling session started", sessionStartedMsg);
    const playerObjects: Record<string, any> = sessionStartedMsg.players;
    const players: Player[] = Object.values(playerObjects)
      .filter((player) => !player.PlayerId)
      .map((player) => {
        return {
          PlayerId: player.playerId,
          PlayerName: player.playerName,
          Ready: player.playerReady,
          Cards: [],
        };
      });

    setSessionState((prevState) => ({
      ...prevState,
      sessionUuid: sessionStartedMsg.sessionId,
      gameStarted: false,
      players: players,
      playerId: sessionStartedMsg.playerId,
    }));
  };

  const handleGameStarted = (gameMessage: SessionMessage) => {
    setSessionState((prevState) => ({
      ...prevState,
      gameStarted: true,
    }));
  };

  const handleSessionEnded = (gameMessage: SessionMessage) => {
    console.log("Handling session ended", gameMessage);

    CleanSession();
  };

  const handleSessionInfo = (gameMessage: SessionMessage) => {
    console.log("Session Info:", gameMessage);
  };

  const handlePlayerReady = (gameMessage: SessionMessage) => {
    var playerReadyMsg = gameMessage as PlayerReadyMessage;

    setSessionState((prevState) => {
      let player = prevState.players.find(
        (player) => player.PlayerId === playerReadyMsg.playerId
      );

      // Update the player's ready status
      if (player) {
        player.Ready = playerReadyMsg.playerReady;
      }

      return { ...prevState };
    });
  };

  const handleCardsDealt = (gameMessage: SessionMessage) => {
    var cardsDealtMsg = gameMessage as CardsDealtMessage;
    setSessionState((prevState) => {
      var player = prevState.players.find(
        (p) => p.PlayerId === cardsDealtMsg.playerId
      );

      if (player) {
        player.Cards = cardsDealtMsg.cards;
      }
      return { ...prevState };
    });
  };

  const handleCardsPlayed = (gameMessage: SessionMessage) => {
    var cardsPlayedMsg = gameMessage as CardsPlayedMessage;
    console.log("Handling cards played", cardsPlayedMsg);
  };

  return {
    ConnectSession,
    DisconnectSession,
    UpdateSession,
    CleanSession,
    SendMessage,
    sessionState,
  };
};
