type StartSession = {
  type: "startSession";
  sessionUuid: string;
  playerIds: string[];
};

type StopSession = {
  type: "stopSession";
  sessionUuid: string;
};

type PlayerJoined = {
  type: "playerJoined";
  playerId: string;
  playerName: string;
};

type PlayerLeft = {
  type: "playerLeft";
  playerId: string;
};

type PlayerReady = {
  type: "playerReady";
  playerId: string;
  playerReady: boolean;
};
