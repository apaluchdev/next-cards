import { User } from "@/lib/game-types/user";
import { useEffect, useState } from "react";
import { useWebSocket } from "./use-websocket";
import {
  UserJoinedMessage,
  UserReadyMessage,
  SessionMessage,
  SessionMessageType,
  SessionStartedMessage,
} from "@/lib/game-types/message";

export type SessionState = {
  users: User[];
  sessionId: string;
  connected: boolean;
  userId: string;
  open: boolean;
  gameStarted: boolean;
  errorMsg: string;
};

export interface Session {
  ConnectSession: (id: string) => string;
  DisconnectSession: () => void;
  UpdateSession: (url: SessionMessage) => void;
  CleanSession: () => void;
  SendMessage: (data: SessionMessage) => void;
  sessionState: SessionState;
}

type OnMessageCallback = (sessionMsg: SessionMessage) => void;
type OnSessionUpdatedCallback = (session: Session) => void;

// Custom hook to manage properties common to all sessions
export const useSession = (
  onMessageCallback: OnMessageCallback,
  onSessionUpdatedCallback: OnSessionUpdatedCallback
): Session => {
  const [sessionState, setSessionState] = useState<SessionState>({
    users: [],
    sessionId: "",
    connected: false,
    userId: "",
    open: false,
    gameStarted: false,
    errorMsg: "",
  });
  const { socket, connect, disconnect, reconnect, sendMessage } = useWebSocket(
    (message: any) => {
      UpdateSession(message);
    },
    (error: any) => {
      setSessionState((prevState) => {
        return { ...prevState, errorMsg: error };
      });
    }
  );

  useEffect(() => {
    onSessionUpdatedCallback({ ...Session, sessionState: sessionState });
  }, [sessionState]);

  const ConnectSession = (id: string) => {
    try {
      var result: boolean = id
        ? connect(
            `${process.env.NEXT_PUBLIC_GO_BACKEND_WS}/session/connect?id=${id}`
          )
        : connect(`${process.env.NEXT_PUBLIC_GO_BACKEND_WS}/session/connect`);

      if (!result) setSessionState({ ...sessionState, connected: false });
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
      open: false,
      gameStarted: false,
      errorMsg: "",
    });
  };

  const UpdateSession = (message: SessionMessage) => {
    console.log("Message Received: ", message);
    onMessageCallback(message);

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
      case SessionMessageType.GAME_STARTED:
        handleGameStarted(message);
        break;
      default:
        setSessionState((prevState) => {
          return { ...prevState };
        });
        break;
    }
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
          Ready: user.userReady,
        };
      });

    setSessionState((prevState) => ({
      ...prevState,
      sessionId: sessionStartedMsg.sessionId,
      gameStarted: false,
      users: users,
      userId: sessionStartedMsg.userId,
      connected: true,
      open: true,
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

  const handleGameStarted = (gameMessage: SessionMessage) => {
    setSessionState((prevState) => {
      return { ...prevState, open: false, gameStarted: true };
    });
  };

  const Session = {
    ConnectSession,
    DisconnectSession,
    UpdateSession,
    CleanSession,
    SendMessage,
    sessionState,
  };

  return Session;
};
