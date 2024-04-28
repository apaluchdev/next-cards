import { Card, CardContent } from "@/components/ui/card";
import PlayingCard from "@/lib/game-types/card";
import { GetSuitSymbol } from "@/lib/game-types/card-helper";
import { Ghost } from "lucide-react";
import React from "react";

const CheatCards: React.FC<{
  onCardClick: (playingCard: PlayingCard) => void;
}> = ({ onCardClick }) => {
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  const fakeCards: PlayingCard[] = values.map((value) => ({
    Suit: "Fake",
    Value: value,
  }));

  return (
    <div className="flex flex-wrap gap-2 w-full items-center justify-center">
      {fakeCards.map((fakeCard) => (
        <Card
          key={fakeCard.Suit + fakeCard.Value}
          className={`w-12 h-20 hover:border-red-500 hover:cursor-pointer hover:transform hover:-translate-y-1 transition duration-300 ease-in-out`}
          onClick={() => onCardClick(fakeCard)}
        >
          <CardContent
            key={fakeCard.Suit + fakeCard.Value}
            className="flex text-slate-700 flex-col text-lg font-semibold aspect-square items-center justify-center gap-2 p-2"
          >
            <p key={fakeCard.Suit + fakeCard.Value}>
              <Ghost
                key={fakeCard.Suit + fakeCard.Value}
                className="text-slate-500"
                scale={0.75}
              />
            </p>
            {fakeCard.Value}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CheatCards;
