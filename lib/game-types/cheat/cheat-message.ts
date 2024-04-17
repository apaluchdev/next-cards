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
  
    constructor(playerId: string, cards: Card[], targetId: string) {
      super(SessionMessageType.PLAYER_TURN);
      this.playerId = playerId;
    }
  }
  
  export class DeclaredCheatMessage extends SessionMessage {
    playerId: string;
  
    constructor(playerId: string, cards: Card[], targetId: string) {
      super(SessionMessageType.DECLARED_CHEAT);
      this.playerId = playerId;
    }
  }