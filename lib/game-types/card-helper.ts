import Card from "./card";

export function GetSuitSymbol(suit: string): string {
  switch (suit) {
    case "Hearts":
      return "♥";
    case "Diamonds":
      return "♦";
    case "Clubs":
      return "♣";
    case "Spades":
      return "♠";
    default:
      return "";
  }
}

export function GetSuitCSSColor(suit: string): string {
  switch (suit) {
    case "Hearts":
    case "Diamonds":
      return "text-red-600";
    case "Clubs":
    case "Spades":
      return "text-black";
    default:
      return "";
  }
}

export const MockCards: Card[] = [
  { Suit: "Hearts", Value: "A" },
  { Suit: "Diamonds", Value: "8" },
  { Suit: "Hearts", Value: "3" },
  { Suit: "Clubs", Value: "K" },
  { Suit: "Spades", Value: "Q" },
  { Suit: "Hearts", Value: "J" },
  { Suit: "Spades", Value: "6" },
  { Suit: "Diamonds", Value: "6" },
  { Suit: "Clubs", Value: "10" },
  { Suit: "Hearts", Value: "5" },
  { Suit: "Spades", Value: "2" },
  { Suit: "Diamonds", Value: "9" },
  { Suit: "Clubs", Value: "7" },
  { Suit: "Hearts", Value: "4" },
  { Suit: "Spades", Value: "3" },
  { Suit: "Diamonds", Value: "J" },
  // { Suit: "Clubs", Value: "A" },
  // { Suit: "Hearts", Value: "9" },
  // { Suit: "Spades", Value: "7" },
  // { Suit: "Diamonds", Value: "K" },
  // { Suit: "Clubs", Value: "Q" },
  // { Suit: "Hearts", Value: "2" },
  // { Suit: "Spades", Value: "5" },
  // { Suit: "Diamonds", Value: "4" },
  // { Suit: "Clubs", Value: "3" },
  // { Suit: "Hearts", Value: "Q" },
  // { Suit: "Spades", Value: "10" },
  // { Suit: "Diamonds", Value: "2" },
  // { Suit: "Clubs", Value: "9" },
  // { Suit: "Hearts", Value: "7" },
  // { Suit: "Spades", Value: "K" },
  // { Suit: "Diamonds", Value: "A" },
  // { Suit: "Clubs", Value: "6" },
  // { Suit: "Hearts", Value: "10" },
  // { Suit: "Spades", Value: "4" },
  // { Suit: "Diamonds", Value: "Q" },
  // { Suit: "Clubs", Value: "5" },
  // { Suit: "Hearts", Value: "6" },
  // { Suit: "Spades", Value: "9" },
  // { Suit: "Diamonds", Value: "7" },
  // { Suit: "Clubs", Value: "2" },
  // { Suit: "Hearts", Value: "K" },
  // { Suit: "Spades", Value: "8" },
  // { Suit: "Diamonds", Value: "3" },
  // { Suit: "Clubs", Value: "J" },
];
