import { socket } from "@/ws/socket";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useGame } from "@/hooks/game";
import { GameEvents } from "@/utils/enums";
import { useEffect, useState } from "react";
import { getRandomNumber } from "@/utils/functions";

export function BingoNumbers() {
  const {
    currentPlayer,
    getRoomByName,
    game: { drawnNumbers },
  } = useGame();
  const [sortedNumber, setSortNumber] = useState<number>();
  const [runRandom, setRunRandom] = useState<NodeJS.Timeout>();
  const { currentDrawnNumbers } = useGame();

  const room = getRoomByName(currentPlayer.currentRoom);

  const startGame = () => {
    const randomizeInteval = setInterval(() => {
      const random = getRandomNumber(currentDrawnNumbers);
      setSortNumber(random);
    }, 75);

    setRunRandom(randomizeInteval);
  };

  const getARandom = () => {
    clearInterval(runRandom);
    setRunRandom(undefined);
    socket.emit(GameEvents.drawNumber, { value: sortedNumber, room });
  };
  const handleNumberClicked = (value: number) => {
    socket.emit(GameEvents.drawNumber, { value, room });
  };

  const clearTable = () => {
    setSortNumber(undefined);
    socket.emit(GameEvents.clearTable);
  };

  useEffect(() => {
    if (currentDrawnNumbers.length === 75) {
      clearInterval(runRandom);
    }
  }, [currentDrawnNumbers]);
  return (
    <Card className="bg-gray-900">
      <CardContent className="p-4 space-y-2">
        <div className="w-full flex justify-between items-center">
          {currentDrawnNumbers.length < 75 && (
            <Button onClick={startGame}>
              {runRandom ? "Stop Shuffling" : "Start Shuffling"}
            </Button>
          )}

          <div className="flex items-center gap-2">
            {runRandom && (
              <Button onClick={getARandom} variant="destructive">
                Get a number
              </Button>
            )}

            {currentDrawnNumbers.length > 0 && (
              <Button onClick={clearTable} variant="primary">
                Clear table
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-6 lg:grid-cols-11 gap-2">
          {Array.from({ length: 75 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center bg-white rounded-lg"
            >
              <Button
                variant="ghost"
                data-random={sortedNumber === i + 1}
                data-clicked={drawnNumbers?.includes(i + 1)}
                onClick={() => handleNumberClicked(i + 1)}
                className="rounded-full size-14 lg:size-22 flex justify-center items-center text-2xl data-[clicked=true]:bg-slate-900 data-[clicked=true]:text-white data-[clicked=true]:border-8 data-[clicked=true]:border-red-500 data-[random=true]:bg-amber-500"
              >
                {i + 1}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
