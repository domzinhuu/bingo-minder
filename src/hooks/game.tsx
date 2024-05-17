import { GameContext } from "@/context/game-context";
import { useContext } from "react";
export const useGame = () => {
  const context = useContext(GameContext);
  const { game } = context;

  function getRoomCapacity() {
    return game.room?.capacity || 10;
  }

  return { ...context, getRoomCapacity };
};
