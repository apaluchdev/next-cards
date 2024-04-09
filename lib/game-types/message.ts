import { Card } from "./card";
import { Player } from "./player";

// export interface SessionMessage {
//   messageType: GameMessageType;
//   message: any;
// }

export enum SessionMessageType {
  PLAYER_JOINED = "playerJoined",
  PLAYER_LEFT = "playerLeft",
  SESSION_STARTED = "sessionStarted",
  GAME_STARTED = "gameStarted",
  SESSION_ENDED = "sessionEnded",
  SESSION_INFO = "sessionInfo",
  PLAYER_READY = "playerReady",
  CARDS_DEALT = "cardsDealt",
  CARDS_PLAYED = "cardsPlayed",
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
  sessionUuid: string;
  players: Player[];
  playerId: string;

  constructor(sessionUuid: string, players: Player[], playerId: string) {
    super(SessionMessageType.SESSION_STARTED);
    this.sessionUuid = sessionUuid;
    this.players = players;
    this.playerId = playerId;
  }
}

export class SessionEndedMessage extends SessionMessage {
  sessionUuid: string;

  constructor(sessionUuid: string) {
    super(SessionMessageType.SESSION_ENDED);
    this.sessionUuid = sessionUuid;
  }
}

export class PlayerJoinedMessage extends SessionMessage {
  playerId: string;
  playerName: string;

  constructor(playerId: string, playerName: string) {
    super(SessionMessageType.PLAYER_JOINED);
    this.playerId = playerId;
    this.playerName = playerName;
  }
}

export class GameStartedMessage extends SessionMessage {
  playerId: string;
  playerName: string;

  constructor(playerId: string, playerName: string) {
    super(SessionMessageType.GAME_STARTED);
    this.playerId = playerId;
    this.playerName = playerName;
  }
}

export class PlayerLeftMessage extends SessionMessage {
  playerId: string;

  constructor(playerId: string) {
    super(SessionMessageType.PLAYER_LEFT);
    this.playerId = playerId;
  }
}

export class PlayerReadyMessage extends SessionMessage {
  playerId: string;
  playerReady: boolean;

  constructor(playerId: string, playerReady: boolean) {
    super(SessionMessageType.PLAYER_READY);
    this.playerId = playerId;
    this.playerReady = playerReady;
  }
}

export class CardsDealtMessage extends SessionMessage {
  playerId: string;
  cards: Card[];

  constructor(playerId: string, cards: Card[]) {
    super(SessionMessageType.CARDS_DEALT);
    this.playerId = playerId;
    this.cards = cards;
  }
}

export class CardsPlayedMessage extends SessionMessage {
  playerId: string;
  cards: Card[];
  targetId: string;

  constructor(playerId: string, cards: Card[], targetId: string) {
    super(SessionMessageType.CARDS_PLAYED);
    this.playerId = playerId;
    this.cards = cards;
    this.targetId = targetId;
  }
}
