import { Card } from "./card";

export type Player = {
  PlayerId: string;
  PlayerName: string;
  Ready: boolean;
  Cards: Card[];
};
