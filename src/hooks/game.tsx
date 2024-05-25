import { GameContext } from "@/context/game-context";
import { Bingo } from "@/types/game";
import { useContext } from "react";
export const useGame = () => {
  const context = useContext(GameContext);
  const { game } = context;

  const getBingoCard = (cardBingoId: string) => {
    const bingo = game.bingoCards?.find((bg) => bg.id === cardBingoId);
    return bingo || ({} as Bingo);
  };

  const getRoomByName = (roomName: string) => {
    return context.roomList.find((room) => room.name === roomName);
  };

  return { ...context, getBingoCard, getRoomByName };
};
