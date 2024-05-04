import { GetSuitSymbol } from "@/lib/game-types/card-helper";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";
import PlayingCard, { sortByCardValue } from "@/lib/game-types/card";
import Image from "next/image";

interface CardViewerProps {
  playingCards: PlayingCard[];
}

const CardViewer: React.FC<CardViewerProps> = ({ playingCards }) => {
  if (!playingCards)
    return (
      <div>
        <h1>No Cards!</h1>
      </div>
    );

  const GetPlayingCardImage: React.FC<{ playingCard: PlayingCard }> = ({ playingCard }) => {
    if (!playingCard) return <div></div>;

    if (playingCard.Suit == "Maybe") return <Image className="pt-6 pb-6" src="/back-card.png" alt="Back of a playing card" width={64} height={96}></Image>;
    else
      return (
        <div className="pt-6 pb-6">
          <Card className={`w-16 h-24  hover:border-red-500 hover:cursor-pointer hover:transform hover:-translate-y-1 transition duration-300 ease-in-out`}>
            <CardContent className="flex flex-col text-2xl font-semibold aspect-square items-center justify-center gap-4 p-2">
              {playingCard.Suit != "Maybe" && (
                <div>
                  <p className={`${playingCard.Suit === "Hearts" || playingCard.Suit === "Diamonds" ? "text-red-600" : "text-black"}`}>
                    {GetSuitSymbol(playingCard.Suit)}
                  </p>
                  {playingCard.Value}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <Carousel className="w-full max-w-xl">
        <CarouselContent>
          {playingCards.sort(sortByCardValue).map((playingCard: PlayingCard, index) => (
            <CarouselItem key={index} className="basis-1/8">
              <GetPlayingCardImage playingCard={playingCard} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CardViewer;
