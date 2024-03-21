interface SessionInfo {
  sessionUuid: string;
  playerIds: string[];
}

const sessionInfo: SessionInfo = {
  sessionUuid: "your-session-uuid",
  playerIds: ["player1", "player2", "player3"],
};

function Update(event: any) {
  console.log("Updated game state", event.detail);

  switch (event.detail.type) {
    case "player-joined":
      console.log("Player joined", event.detail.playerId);
      break;
    case "player-left":
      console.log("Player left", event.detail.playerId);
      break;
    case "game-started":
      console.log("Game started");

      break;
    case "game-ended":
      console.log("Game ended");
      break;
  }
}

export { Update };
