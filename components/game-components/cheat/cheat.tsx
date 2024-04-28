import { Session } from "@/hooks/use-session";
import { SessionMessage, SessionMessageType } from "@/lib/game-types/message";
import React, { useEffect, useState } from "react";
import CardSelector from "../card-selector";
import PlayingCard from "@/lib/game-types/card";
import { CheatPlayer } from "@/lib/game-types/cheat/cheat-player";
import {
  CardsDealtMessage,
  CardsPlayedMessage,
  CheatResultMessage,
  DeclaredCheatMessage,
  PlayerTurnMessage,
} from "@/lib/game-types/cheat/cheat-message";
import { useSessionContext } from "@/context/session-context";
import { Button } from "@/components/ui/button";
import CardViewer from "../card-viewer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WaitingForCheatTimer } from "./cheat-timer";

export type CheatState = {
  gameStarted: boolean;
  cheatPlayers: CheatPlayer[];
  selfId: string;
  playerDeclaredCheatId: string | undefined;
  playerTurnId: string | undefined;
  waitingForCheat: boolean;
  playerInstruction: string;
  cheatWinner: string | undefined;
  cheatLoser: string | undefined;
  discardPileSize: number;
};

// Need to register an event handler to a event provided by Session
const Cheat = () => {
  const { session, subscribe, unsubscribe } = useSessionContext();
  const [cheatState, setCheatState] = useState<CheatState>({
    discardPileSize: 0,
  } as CheatState);

  const GetCheatPlayerById = (playerId: string) => {
    if (!cheatState.cheatPlayers) {
      return undefined;
    }
    return cheatState.cheatPlayers.find((p) => p.User.UserId === playerId);
  };

  const playerSelf = cheatState?.cheatPlayers?.find(
    (p) => p.User.UserId === cheatState.selfId
  );
  const myTurn = cheatState.playerTurnId === cheatState.selfId;
  const turnName = GetCheatPlayerById(cheatState.playerTurnId ?? "")?.User
    .UserName;

  const cheatMessageHandler = (message: SessionMessage, session: Session) => {
    switch (message.messageInfo.messageType) {
      case SessionMessageType.GAME_STARTED:
        handleGameStarted(message, session);
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
      case SessionMessageType.CHEAT_RESULT:
        handleCheatResult(message);
        break;
    }
  };

  useEffect(() => {
    subscribe(cheatMessageHandler);
    return () => {
      unsubscribe(cheatMessageHandler);
    };
  }, []);

  const handleGameStarted = (gameMessage: SessionMessage, session: Session) => {
    setCheatState((prevState) => ({
      ...prevState,
      gameStarted: true,
      selfId: session.sessionState.userId,
      cheatPlayers: session.sessionState.users.map((user) => ({
        User: user,
        Cards: [],
        CardsPlayed: [],
      })),
    }));
  };

  const handleCardsDealt = (gameMessage: SessionMessage) => {
    var cardsDealtMsg = gameMessage as CardsDealtMessage;
    setCheatState((prevState) => {
      let newState = { ...prevState };

      // State updates must be idempotent
      let player = newState.cheatPlayers.find(
        (p) => p.User.UserId === cardsDealtMsg.playerId
      );

      if (!player) return prevState;

      // Add the card if not found in the player's hand
      cardsDealtMsg.cards.forEach((dealtCard) => {
        if (
          !player?.Cards.find(
            (c) => c.Suit === dealtCard.Suit && c.Value === dealtCard.Value
          )
        )
          player.Cards.push(dealtCard);
      });

      return newState;
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
      return { ...prevState, waitingForCheat: true };
    });
  };

  const handlePlayerTurn = (gameMessage: SessionMessage) => {
    setCheatState((prevState) => {
      var playerTurnMsg = gameMessage as PlayerTurnMessage;
      return {
        ...prevState,
        playerTurnId: playerTurnMsg.playerId,
        playerInstruction: playerTurnMsg.playerInstruction,
        playerDeclaredCheatId: undefined,
        waitingForCheat: false,
        discardPileSize: playerTurnMsg.discardPileSize,
      };
    });
  };

  const handleDeclaredCheat = (gameMessage: SessionMessage) => {
    var declaredCheatMsg = gameMessage as DeclaredCheatMessage;
    setCheatState((prevState) => {
      return {
        ...prevState,
        waitingForCheat: false,
        playerDeclaredCheatId: declaredCheatMsg.playerId,
      };
    });
  };

  const handleCheatResult = (gameMessage: SessionMessage) => {
    var cheatResultMsg = gameMessage as CheatResultMessage;

    setCheatState((prevState) => {
      return {
        ...prevState,
        cheatWinner: cheatResultMsg.winnerId,
        cheatLoser: cheatResultMsg.loserId,
      };
    });
  };

  if (!cheatState.gameStarted) {
    return <div>Game not started</div>;
  }

  const CardPicker: React.FC = () => {
    return (
      <CardSelector
        playingCards={playerSelf?.Cards ?? []}
        cardsSelectedCallback={(cards: PlayingCard[]) => {
          session.SendMessage(
            new CardsPlayedMessage(session.sessionState.userId ?? "", cards, "")
          );
          // Take away the cards from the player
          setCheatState((prevState) => {
            var player = prevState.cheatPlayers.find(
              (p) => p.User.UserId === session.sessionState.userId
            );

            if (player) {
              player.Cards = player.Cards.filter(
                (c) =>
                  !cards.some(
                    (card) => card.Suit === c.Suit && card.Value === c.Value
                  )
              );
            }
            return { ...prevState, waitingForCheat: true };
          });
        }}
        isViewOnly={!myTurn || cheatState.waitingForCheat}
      />
    );
  };

  const CheatDeclaration: React.FC = () => {
    if (!myTurn)
      return (
        <div className="w-full flex flex-col items-center">
          <h1>{turnName} supposedly played:</h1>
          <CardViewer
            playingCards={
              GetCheatPlayerById(cheatState.playerTurnId ?? "")?.CardsPlayed ??
              []
            }
          />

          <Button
            onClick={() => {
              session.SendMessage(
                new DeclaredCheatMessage(session.sessionState.userId ?? "")
              );
            }}
          >
            Declare Cheat
          </Button>
        </div>
      );
    else
      return (
        <div className="w-full flex items-center text-2xl font-bold justify-center mt-6">
          Waiting for possible cheat declarations...
        </div>
      );
  };

  const GetCurrentCheatView = () => {
    // Win State
    if (
      !myTurn &&
      !cheatState.waitingForCheat &&
      (playerSelf?.Cards.length ?? 0) < 1
    ) {
      return (
        <div className="w-full flex item-center justify-center mt-6">
          <h1 className="font-bold text-4xl">YOU WIN</h1>
        </div>
      );
    }

    // Picking cards to play
    if (
      myTurn &&
      !cheatState.waitingForCheat &&
      !cheatState.playerDeclaredCheatId
    ) {
      return (
        <div className="mt-6">
          <CardPicker />
        </div>
      );
    }

    // Waiting for a player to declare cheat
    if (cheatState.waitingForCheat) {
      return (
        <div className="flex flex-col gap-4">
          <CheatDeclaration />
          <WaitingForCheatTimer />
        </div>
      );
    }

    if (cheatState.playerDeclaredCheatId) {
      return (
        <div>
          <h2 className="font-bold text-2xl">Cheat Results:</h2>

          <h3 className=" text-green-700 font-semibold text-xl">
            {"Winner: "}
            {GetCheatPlayerById(cheatState.cheatWinner ?? "Winner UserName")
              ?.User.UserName ?? "Winner Username"}
          </h3>
          <h3 className="text-red-700 font-semibold text-xl">
            {"Loser: "}
            {GetCheatPlayerById(cheatState.cheatLoser ?? "Loser Username")?.User
              .UserName ?? "Loser Username"}
          </h3>
        </div>
      );
    }

    // Waiting for other player to play cards
    if (!myTurn && !cheatState.waitingForCheat) {
      return (
        <div className="w-full mt-16 flex flex-col items-center gap-4">
          <h1 className="font-bold text-2xl">Waiting for {turnName}</h1>
          <LoadingSpinner size={64} />
          <CardViewer playingCards={playerSelf?.Cards ?? []} />
        </div>
      );
    }
  };

  return (
    <div className="min-w-full p-8 min-h-96 rounded-3xl bg-slate-100 flex flex-col gap-2 @apply shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
      <div>
        <h1 className="font-bold text-xl">
          {turnName}
          {"'s Turn"}
        </h1>
      </div>
      {cheatState.playerInstruction && (
        <div>
          <h1 className="font-semibold">Instruction:</h1>
          <p>{cheatState.playerInstruction}</p>
        </div>
      )}
      {GetCurrentCheatView()}
      {cheatState.gameStarted && (
        <div className="w-full flex items-center flex-col mt-2">
          <h1>Discard pile has {cheatState.discardPileSize} cards remaining</h1>
        </div>
      )}
    </div>
  );
};

export default Cheat;
