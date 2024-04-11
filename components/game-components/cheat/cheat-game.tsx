import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PlayingCard from "@/lib/game-types/card";
import { Button } from "../../ui/button";
import CheatCards from "./cheat-cards";
import { GetSuitSymbol } from "@/lib/game-types/card-helper";

interface CardCarouselProps {
  playingCards: PlayingCard[];
  cardsSelectedCallback: (card: PlayingCard[]) => void;
}

const cardValuesOrder = [
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
  "A",
];

const sortByCardValue = (a: PlayingCard, b: PlayingCard) => {
  const aValueIndex = cardValuesOrder.indexOf(a.Value);
  const bValueIndex = cardValuesOrder.indexOf(b.Value);
  return aValueIndex - bValueIndex;
};

const CardCarousel: React.FC<CardCarouselProps> = ({
  playingCards,
  cardsSelectedCallback,
}) => {
  playingCards = [
    {
      Suit: "Clubs",
      Value: "6",
    },
    {
      Suit: "Spades",
      Value: "3",
    },
    {
      Suit: "Diamonds",
      Value: "5",
    },
    {
      Suit: "Hearts",
      Value: "5",
    },
    {
      Suit: "Diamonds",
      Value: "Q",
    },
    {
      Suit: "Diamonds",
      Value: "4",
    },
    {
      Suit: "Hearts",
      Value: "J",
    },
    {
      Suit: "Diamonds",
      Value: "7",
    },
  ];

  const [selCards, setSelCards] = useState<PlayingCard[]>([]);

  const isCardSelected = (card: PlayingCard) => {
    if (selCards.length < 1) return false;

    console.log("Selected cards: ", selCards);

    return selCards.some(
      (c: PlayingCard) => c.Suit === card.Suit && c.Value === card.Value
    );
  };

  const CardSelected = (card: PlayingCard) => {
    if (isCardSelected(card)) {
      setSelCards([
        ...selCards.filter(
          (c) => c.Suit !== card.Suit || c.Value !== card.Value
        ),
      ]);
    } else {
      setSelCards([...selCards, card]);
    }
  };

  cardsSelectedCallback(selCards);

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <Carousel className="w-full max-w-xl">
        <CarouselContent className="">
          {playingCards
            .sort(sortByCardValue)
            .map((playingCard: PlayingCard, index) => (
              <CarouselItem key={index} className="basis-1/8">
                <div className="pt-6 pb-6">
                  <Card
                    onClick={() => CardSelected(playingCard)}
                    className={`${
                      isCardSelected(playingCard)
                        ? " bg-slate-300 -translate-y-1 shadow-lg"
                        : " bg-slate-100 shadow-sm"
                    } w-16 h-24  hover:border-red-500 hover:cursor-pointer hover:transform hover:-translate-y-1 transition duration-300 ease-in-out`}
                  >
                    <CardContent className="flex flex-col text-2xl font-semibold aspect-square items-center justify-center gap-4 p-2">
                      <p
                        className={`${
                          playingCard.Suit === "Hearts" ||
                          playingCard.Suit === "Diamonds"
                            ? "text-red-600"
                            : "text-black"
                        }`}
                      >
                        {GetSuitSymbol(playingCard.Suit)}
                      </p>
                      {playingCard.Value}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* <CheatCards
        onCardClick={() => GetSelected(playingCard)}
      /> */}
      <Button variant={"default"} onClick={() => setSelCards([])}>
        Play Cards
      </Button>
    </div>
  );
};

export default CardCarousel;
