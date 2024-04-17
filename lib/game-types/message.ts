import { User } from "./user";

// export interface SessionMessage {
//   messageType: GameMessageType;
//   message: any;
// }

export enum SessionMessageType {
  USER_JOINED = "userJoined",
  USER_LEFT = "userLeft",
  SESSION_STARTED = "sessionStarted",
  GAME_STARTED = "gameStarted",
  SESSION_ENDED = "sessionEnded",
  SESSION_INFO = "sessionInfo",
  USER_READY = "userReady",
  CARDS_DEALT = "cardsDealt",
  CARDS_PLAYED = "cardsPlayed",
  PLAYER_TURN = "userTurn",
  DECLARED_CHEAT = "declaredCheat",
}

export class SessionMessage {
  messageInfo: {
    messageType: SessionMessageType;
    messageTimestamp: string;
  };

  constructor(messageType: SessionMessageType) {
    this.messageInfo = {
      messageType: messageType,
      messageTimestamp: new Date().toISOString(),
    };
  }
}

export class SessionStartedMessage extends SessionMessage {
  sessionId: string;
  users: User[];
  userId: string;

  constructor(sessionId: string, users: User[], userId: string) {
    super(SessionMessageType.SESSION_STARTED);
    this.sessionId = sessionId;
    this.users = users;
    this.userId = userId;
  }
}

export class SessionEndedMessage extends SessionMessage {
  sessionUuid: string;

  constructor(sessionUuid: string) {
    super(SessionMessageType.SESSION_ENDED);
    this.sessionUuid = sessionUuid;
  }
}

export class UserJoinedMessage extends SessionMessage {
  userId: string;
  userName: string;

  constructor(userId: string, userName: string) {
    super(SessionMessageType.USER_JOINED);
    this.userId = userId;
    this.userName = userName;
  }
}

export class GameStartedMessage extends SessionMessage {
  userId: string;
  userName: string;

  constructor(userId: string, userName: string) {
    super(SessionMessageType.GAME_STARTED);
    this.userId = userId;
    this.userName = userName;
  }
}

export class UserLeftMessage extends SessionMessage {
  userId: string;

  constructor(userId: string) {
    super(SessionMessageType.USER_LEFT);
    this.userId = userId;
  }
}

export class UserReadyMessage extends SessionMessage {
  userId: string;
  userReady: boolean;

  constructor(userId: string, userReady: boolean) {
    super(SessionMessageType.USER_READY);
    this.userId = userId;
    this.userReady = userReady;
  }
}
