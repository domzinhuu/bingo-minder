import { gameSettingsSchema } from "@/utils/schemas";
import { z } from "zod";

export type GameStatus = "accepted" | "rejected" | "waiting" | "";
export interface GameEngine {
  players: Player[];
  drawnNumbers: number[];
  bingoCards?: Bingo[];
  room: GameRoom;
}

export interface Player {
  id?: string;
  socketId?: string;
  cardBingoId: string;
  name: string;
  role: "admin" | "player";
  status: GameStatus;
  currentRoom: string;
}

export interface GameRoom {
  name: string;
  capacity: number;
}

export interface Bingo {
  id: string;
  owner: string;
  cardNumbers: Record<string, number[]>;
}

export type GameSettings = z.infer<typeof gameSettingsSchema>;
