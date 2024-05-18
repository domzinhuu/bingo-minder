import { BingoNumbers } from "@/components/bingo-numbers";
import { PageAside, PageContent, PageRoot } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGame } from "@/hooks/game";
import { GameEvents } from "@/utils/enums";
import { socket } from "@/ws/socket";
import {
  BanIcon,
  CheckIcon,
  LogOutIcon,
  User,
  UserRoundCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Host() {
  const { status, game, currentPlayer, getRoomCapacity } = useGame();
  const navigate = useNavigate();

  const handlePlayerApproval = (playerId: string, socketId: string) => {
    socket.emit(GameEvents.approvePlayer, {
      playerId,
      socketId,
      roomName: currentPlayer.currentRoom,
    });
  };

  const handlePlayerReject = (playerId: string, socketId: string) => {
    socket.emit(GameEvents.rejectPlayer, {
      playerId,
      socketId,
      roomName: currentPlayer.currentRoom,
    });
  };

  useEffect(() => {
    if (status === "disconnected") {
      console.log("usuario desconectado...");
      navigate("/");
    }
  }, [status]);

  useEffect(() => {}, [game]);

  console.log(game.players);
  return (
    <PageRoot>
      <PageAside>
        <h1 className="font-title  hidden lg:block">Bingo Minder</h1>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">Room</TableCell>
              <TableCell>{currentPlayer.currentRoom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Capacity:</TableCell>
              <TableCell>
                <span>{`${game.players.length}/${getRoomCapacity()}`}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Separator className="my-4" />
        <div className="flex flex-col px-4 space-y-4 w-full">
          <span className="font-bold text-lg">Players</span>
          <ul className="space-y-2">
            {game.players?.map((p) => (
              <li
                key={p.id}
                className="flex items-center text-sm justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  {currentPlayer.name === p.name &&
                  currentPlayer.role === "admin" ? (
                    <UserRoundCheck size={18} className="text-amber-600" />
                  ) : (
                    <User size={18} className="text-emerald-600" />
                  )}

                  {p.name}
                </div>
                {p.role !== "admin" && p.status === "waiting" && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handlePlayerApproval(p.id!, p.socketId!)}
                      className="size-6 bg-emerald-500 hover:bg-emerald-600/90 text-white"
                      size="icon"
                    >
                      <CheckIcon size={16} />
                    </Button>
                    <Button
                      onClick={() => handlePlayerReject(p.id!, p.socketId!)}
                      className="size-6 bg-rose-500 hover:bg-rose-600/90 text-white"
                      size="icon"
                    >
                      <BanIcon size={16} />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <LogOutIcon /> Logout
        </Button>
      </PageAside>
      <PageContent>
        <BingoNumbers />
      </PageContent>
    </PageRoot>
  );
}
