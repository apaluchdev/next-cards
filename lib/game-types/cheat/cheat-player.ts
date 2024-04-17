import PlayingCard from "../card";
import { User } from "../user";

export type CheatPlayer = {
  User: User;
  Cards: PlayingCard[];
  CardsPlayed: PlayingCard[];
};
