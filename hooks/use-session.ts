import { User } from "@/lib/game-types/user";
import { useState } from "react";
import { useWebSocket } from "./use-websocket";
import {
  UserJoinedMessage,
  UserReadyMessage,
  SessionMessage,
  SessionMessageType,
  SessionStartedMessage,
} from "@/lib/game-types/message";
import { useAppContext } from "@/context/app-context";

export type SessionState = {
  users: User[];
  sessionId: string;
  connected: boolean;
  userId: string;
};

export interface Session {
  ConnectSession: (id: string) => string;
  DisconnectSession: () => void;
  UpdateSession: (url: SessionMessage) => void;
  CleanSession: () => void;
  SendMessage: (data: SessionMessage) => void;
  sessionState: SessionState;
}

// Custom hook to manage properties common to all sessions
export const useSession = (): Session => {
  const { messageQueue, publishMessage, subscribe } = useAppContext();
  const [sessionState, setSessionState] = useState<SessionState>({
    users: [],
    sessionId: "",
    connected: false,
    userId: "",
  });
  const { socket, connect, disconnect, reconnect, sendMessage } = useWebSocket(
    (message: any) => {
      UpdateSession(message);
    }
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
      users: [],
      sessionId: "",
      connected: false,
      userId: "",
    });
  };

  const UpdateSession = (message: SessionMessage) => {
    console.log("Message Received: ", message);

    switch (message.messageInfo.messageType) {
      case SessionMessageType.USER_JOINED:
        handleUserJoined(message);
        break;
      case SessionMessageType.USER_LEFT:
        handleUserLeft(message);
        break;
      case SessionMessageType.SESSION_STARTED:
        handleSessionStarted(message);
        break;
      case SessionMessageType.SESSION_ENDED:
        handleSessionEnded(message);
        break;
      case SessionMessageType.SESSION_INFO:
        handleSessionInfo(message);
        break;
      case SessionMessageType.USER_READY:
        handleUserReady(message);
        break;
      default:
        setSessionState((prevState) => {
          return { ...prevState };
        });
        break;
    }

    console.log("use-session published message to context");
    publishMessage(message);

    // if (sesState.fruit) {
    //   console.log("Fruit is: ", sesState.fruit);
    // }
  };

  const handleUserJoined = (gameMessage: SessionMessage) => {
    var userJoinedMessage = gameMessage as UserJoinedMessage;

    if (!userJoinedMessage) return;

    setSessionState((prevState) => {
      const userExists = prevState.users.some(
        (user) => user.UserId === userJoinedMessage.userId
      );
      if (!userExists) {
        prevState.users.push({
          UserId: userJoinedMessage.userId,
          UserName: userJoinedMessage.userName,
          Ready: false,
        });
      }
      return { ...prevState };
    });
  };

  const handleUserLeft = (gameMessage: SessionMessage) => {
    console.log("Handling user left");
  };

  const handleSessionStarted = (gameMessage: SessionMessage) => {
    var sessionStartedMsg = gameMessage as SessionStartedMessage;
    console.log("Handling session started", sessionStartedMsg);
    const userObjects: Record<string, any> = sessionStartedMsg.users;
    const users: User[] = Object.values(userObjects)
      .filter((user) => !user.UserId)
      .map((user) => {
        return {
          UserId: user.userId,
          UserName: user.userName,
          Ready: user.ready,
        };
      });

    setSessionState((prevState) => ({
      ...prevState,
      sessionId: sessionStartedMsg.sessionId,
      gameStarted: false,
      users: users,
      userId: sessionStartedMsg.userId,
    }));
  };

  const handleSessionEnded = (gameMessage: SessionMessage) => {
    console.log("Handling session ended", gameMessage);

    CleanSession();
  };

  const handleSessionInfo = (gameMessage: SessionMessage) => {
    console.log("Session Info:", gameMessage);
  };

  const handleUserReady = (gameMessage: SessionMessage) => {
    var userReadyMsg = gameMessage as UserReadyMessage;
    setSessionState((prevState) => {
      let user = prevState.users.find(
        (user) => user.UserId === userReadyMsg.userId
      );

      // Update the user's ready status
      if (user) {
        user.Ready = userReadyMsg.userReady;
      }

      return { ...prevState };
    });
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
