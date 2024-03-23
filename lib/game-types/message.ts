type StartSession = {
  type: "start-session";
  sessionUuid: string;
  playerIds: string[];
};

type StopSession = {
  type: "stop-session";
  sessionUuid: string;
};

type PlayerJoined = {
  type: "player-joined";
  playerId: string;
};

type PlayerLeft = {
  type: "player-left";
  playerId: string;
};
