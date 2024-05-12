import PlayingCard, { sortByCardValue } from "@/lib/game-types/card";
import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { GetSuitCSSColor, GetSuitSymbol } from "@/lib/game-types/card-helper";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface CardHandProps {
    playingCards: PlayingCard[];
    canSelect: boolean;
    isViewOnly: boolean;
    cardsSelectedCallback: (card: PlayingCard[]) => void;
}

export const CardHand: React.FC<CardHandProps> = ({ playingCards, canSelect, isViewOnly, cardsSelectedCallback }) => {
    const [selCards, setSelCards] = useState<PlayingCard[]>([]);
    const [cards, setCards] = useState<PlayingCard[]>(playingCards);

    useEffect(() => {
        setCards([...playingCards.sort(sortByCardValue)]);
    }, [playingCards]);

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

    if (cards.length < 1)
        return (
            <div>
                <h1 className="text-4xl tracking-tighter font-bold">No Cards</h1>
            </div>
        );

    const CardFlexDiplay: React.FC<{ cards: PlayingCard[] }> = ({ cards }) => {
        return (
            <div className="flex flex-wrap p-4 justify-center">
                {cards.map((card, index) => (
                    <div key={index} className="p-1">
                        <Card
                            className={`${
                                isCardSelected(card) ? " bg-slate-200 -translate-y-1 shadow-lg" : " bg-slate-50 shadow-sm"
                            } hover:cursor-pointer hover:transform hover:-translate-y-2 transition duration-300 ease-in-out p-1 `}
                            onClick={() => onCardSelected(card)}
                        >
                            <CardContent className={`flex flex-col aspect-square items-center justify-center p-6 w-16 h-24 text-2xl rounded`}>
                                <p className={`text-${GetSuitCSSColor(card.Suit)}-500`}>{GetSuitSymbol(card.Suit)}</p>
                                <p>{GetSuitSymbol(card.Suit) == "?" ? "" : card.Value}</p>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col justify-center gap-4 p-2">
            {!isViewOnly && (
                <Button className="w-52 self-center shadow-md" disabled={!canSelect || selCards.length < 1} variant={"default"} onClick={onCardsPlayed}>
                    Play Cards
                </Button>
            )}
            <ScrollArea className="">
                <div className="flex flex-col sm:w-[24rem] md:w-[32rem] lg:w-[40rem] xl:w-[72rem] w-[16rem]">
                    <CardFlexDiplay cards={cards} />
                </div>
            </ScrollArea>
        </div>
    );
};
