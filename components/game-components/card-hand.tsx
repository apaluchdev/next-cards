import PlayingCard from "@/lib/game-types/card";
import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { GetSuitCSSColor, GetSuitSymbol } from "@/lib/game-types/card-helper";
import { Button } from "../ui/button";

interface CardHandProps {
  playingCards: PlayingCard[];
  canSelect: boolean;
  isViewOnly: boolean;
  cardsSelectedCallback: (card: PlayingCard[]) => void;
}

export const CardHand: React.FC<CardHandProps> = ({ playingCards, canSelect, isViewOnly, cardsSelectedCallback }) => {
  const [selCards, setSelCards] = useState<PlayingCard[]>([]);

  const isCardSelected = (card: PlayingCard) => {
    if (selCards.length < 1) return false;

    return selCards.some((c: PlayingCard) => c.Suit === card.Suit && c.Value === card.Value);
  };

  const onCardSelected = (card: PlayingCard) => {
    if (!canSelect) {
      setSelCards([]);
      return;
    }

    if (isCardSelected(card)) {
      setSelCards([...selCards.filter((c) => c.Suit !== card.Suit || c.Value !== card.Value)]);
      return;
    }

    if (selCards.length >= 4) {
      return;
    }

    setSelCards([...selCards, card]);
  };

  const onCardsPlayed = () => {
    cardsSelectedCallback(selCards);
    setSelCards([]);
  };

  if (playingCards.length < 1)
    return (
      <div>
        <h1 className="text-4xl tracking-tighter font-bold">No Cards</h1>
      </div>
    );

  return (
    <div className="flex flex-col sm:w-[12rem] md:w-[24rem] lg:w-[36rem] xl:w-[58rem] w-[12rem]">
      <Carousel>
        <CarouselContent className="-ml-1 justify-center p-4">
          {playingCards.map((card, index) => (
            <CarouselItem key={index} className="pl-1 basis-1/8">
              <div className="p-1">
                <Card
                  className={`${
                    isCardSelected(card) ? " bg-slate-200 -translate-y-1 shadow-lg" : " bg-slate-50 shadow-sm"
                  } hover:cursor-pointer hover:transform hover:-translate-y-2 transition duration-300 ease-in-out`}
                  onClick={() => onCardSelected(card)}
                >
                  <CardContent className={`flex flex-col aspect-square items-center justify-center p-6 w-20 h-28 text-2xl `}>
                    <p className={`${GetSuitCSSColor(card.Suit)}`}>{GetSuitSymbol(card.Suit)}</p>
                    <p>{card.Value}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {!isViewOnly && (
        <Button className="max-w-36 self-center" disabled={!canSelect || selCards.length < 1} variant={"default"} onClick={onCardsPlayed}>
          Play Cards
        </Button>
      )}
    </div>
  );
};
