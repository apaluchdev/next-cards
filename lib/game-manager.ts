export interface GameMessage {
  messageType: string;
  message: any;
}

export const GameMessageTypes = {
  PLAYER_JOINED: "playerJoined",
  PLAYER_LEFT: "playerLeft",
  SESSION_STARTED: "sessionStarted",
  SESSION_ENDED: "sessionEnded",
  SESSION_INFO: "sessionInfo",
  PLAYER_READY: "playerReady",
};

export type GameState = {
  players: Player[];
  sessionUuid: string;
  gameStarted: boolean;
  ready: boolean;
  playerId: string;
};
