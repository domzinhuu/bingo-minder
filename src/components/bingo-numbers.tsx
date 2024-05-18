import { socket } from "@/ws/socket";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useGame } from "@/hooks/game";
import { GameEvents } from "@/utils/enums";

export function BingoNumbers() {
  const {
    currentPlayer,
    game: { drawnNumbers },
  } = useGame();

  const handleNumberClicked = (value: number) => {
    socket.emit(GameEvents.drawNumber, { value, roomName: currentPlayer.currentRoom });
  };

  return (
    <Card className="bg-gray-900">
      <CardContent className="p-4">
        <div className="grid grid-cols-6 lg:grid-cols-11 gap-2">
        {Array.from({ length: 75 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center bg-white rounded-lg"
            >
              <Button
                variant="ghost"
                data-clicked={drawnNumbers?.includes(i + 1)}
                onClick={() => handleNumberClicked(i + 1)}
                className="rounded-full size-14 lg:size-20 flex justify-center items-center text-2xl data-[clicked=true]:bg-slate-900 data-[clicked=true]:text-white data-[clicked=true]:border-8 data-[clicked=true]:border-red-500"
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
