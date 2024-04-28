import Card from "../card";
import { SessionMessage, SessionMessageType } from "../message";

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

export class PlayerTurnMessage extends SessionMessage {
  playerId: string;
  playerInstruction: string;
  discardPileSize: number;

  constructor(
    playerId: string,
    playerInstruction: string,
    discardPileSize: number
  ) {
    super(SessionMessageType.PLAYER_TURN);
    this.playerId = playerId;
    this.playerInstruction = playerInstruction;
    this.discardPileSize = discardPileSize;
  }
}

export class DeclaredCheatMessage extends SessionMessage {
  playerId: string;

  constructor(playerId: string) {
    super(SessionMessageType.DECLARED_CHEAT);
    this.playerId = playerId;
  }
}

export class CheatResultMessage extends SessionMessage {
  winnerId: string;
  loserId: string;

  constructor(winnerId: string, loserId: string) {
    super(SessionMessageType.CHEAT_RESULT);
    this.winnerId = winnerId;
    this.loserId = loserId;
  }
}
