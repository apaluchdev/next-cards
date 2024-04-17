import { Session } from "@/hooks/use-session";
import { SessionMessage, SessionMessageType } from "@/lib/game-types/message";
import React, { useEffect, useState } from "react";
import CardSelector from "../card-selector";
import PlayingCard from "@/lib/game-types/card";
import { CheatPlayer } from "@/lib/game-types/cheat/cheat-player";
import {
  CardsDealtMessage,
  CardsPlayedMessage,
  DeclaredCheatMessage,
  PlayerTurnMessage,
} from "@/lib/game-types/cheat/cheat-message";

interface CheatProps {
  Session: Session;
}

export type CheatState = {
  gameStarted: boolean;
  cheatPlayers: CheatPlayer[];
  canDeclareCheat: boolean;
  playerDeclaredCheatId: string | undefined;
  playerTurnId: string | undefined;
};

// Need to register an event handler to a event provided by Session
const Cheat: React.FC<CheatProps> = ({ Session }) => {
  const [cheatState, setCheatState] = useState<CheatState>({
    cheatPlayers: [],
    canDeclareCheat: false,
    playerDeclaredCheatId: undefined,
    playerTurnId: undefined,
    gameStarted: false,
  });

  function GetSelf(): CheatPlayer | undefined {
    return cheatState.cheatPlayers.find(
      (p) => p.User.UserId === Session.sessionState.userId
    );
  }

  const cheatMessageHandler = (message: SessionMessage) => {
    switch (message.messageInfo.messageType) {
      case SessionMessageType.GAME_STARTED:
        handleGameStarted(message);
        break;
      case SessionMessageType.CARDS_DEALT:
        handleCardsDealt(message);
        break;
      case SessionMessageType.CARDS_PLAYED:
        handleCardsPlayed(message);
        break;
      case SessionMessageType.PLAYER_TURN:
        handlePlayerTurn(message);
        break;
      case SessionMessageType.DECLARED_CHEAT:
        handleDeclaredCheat(message);
        break;
    }
  };

  // useEffect(() => {
  //   subscribeSessionMessageEvent((message: SessionMessage) =>
  //     cheatMessageHandler(message)
  //   );
  //   return () => {
  //     unsubscribeSessionMessageEvent((message: SessionMessage) =>
  //       cheatMessageHandler(message)
  //     );
  //   };
  // }, [Session]); // Causes a memory leak but fixes the issue
  // The event handlers are somehow keeping an "old" state of the Session object

  const handleGameStarted = (gameMessage: SessionMessage) => {
    console.log("The current state of session is ", Session.sessionState);
    setCheatState((prevState) => ({
      ...prevState,
      gameStarted: true,
      cheatPlayers: Session.sessionState.users.map((user) => ({
        User: user,
        Cards: [],
        CardsPlayed: [],
      })),
    }));

    Session.sessionState.users.forEach((user) => {
      console.log("we have a user", user);
    });
  };

  const handleCardsDealt = (gameMessage: SessionMessage) => {
    var cardsDealtMsg = gameMessage as CardsDealtMessage;
    setCheatState((prevState) => {
      var player = prevState.cheatPlayers.find(
        (p) => p.User.UserId === cardsDealtMsg.playerId
      );

      if (player) {
        player.Cards = cardsDealtMsg.cards;
      }
      return { ...prevState };
    });
  };

  const handleCardsPlayed = (gameMessage: SessionMessage) => {
    var cardsPlayedMsg = gameMessage as CardsPlayedMessage;
    setCheatState((prevState) => {
      var player = prevState.cheatPlayers.find(
        (p) => p.User.UserId === cardsPlayedMsg.playerId
      );

      if (player) {
        player.CardsPlayed = cardsPlayedMsg.cards;
      }
      return { ...prevState };
    });
  };

  const handlePlayerTurn = (gameMessage: SessionMessage) => {
    setCheatState((prevState) => {
      var playerTurnMsg = gameMessage as PlayerTurnMessage;
      return {
        ...prevState,
        turnPlayerId: playerTurnMsg.playerId,
        playerDeclaredCheatId: undefined,
      };
    });
  };

  const handleDeclaredCheat = (gameMessage: SessionMessage) => {
    var declaredCheatMsg = gameMessage as DeclaredCheatMessage;
    setCheatState((prevState) => {
      return { ...prevState, playerDeclaredCheatId: declaredCheatMsg.playerId };
    });
  };

  if (!cheatState.gameStarted) {
    return <div>Game not started</div>;
  }

  return (
    <div>
      <CardSelector
        Cards={GetSelf()?.Cards ?? []}
        cardsSelectedCallback={(cards: PlayingCard[]) =>
          Session.SendMessage(
            new CardsPlayedMessage(Session.sessionState.userId ?? "", cards, "")
          )
        }
      />
      <div>
        <h1>Declared Cheat: </h1>
        <p>{cheatState.playerDeclaredCheatId ?? "None"}</p>
      </div>
      <div>
        <h1>Player Turn: </h1>
        <p>{cheatState.playerTurnId ?? "None"}</p>
        {cheatState.playerTurnId == Session.sessionState.userId && (
          <h1>YOUR TURN!</h1>
        )}
      </div>
      <div>
        <h1>Played Cards </h1>
        {/* <PlayedCards /> */}
      </div>
    </div>
  );
};

export default Cheat;
