import { BingoNumbers } from "@/components/bingo-numbers";
import { PageAside, PageContent, PageRoot } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGame } from "@/hooks/game";
import { useCustomToast } from "@/hooks/toaster";
import { getSession } from "@/lib/utils";
import { Player } from "@/types/game";
import { GameEvents } from "@/utils/enums";
import { getBingoCardShortId } from "@/utils/functions";
import { socket } from "@/ws/socket";
import {
  BanIcon,
  CheckIcon,
  CopyIcon,
  LogOutIcon,
  User,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Host() {
  const { toastInfo, toastError } = useCustomToast();
  const { status, game, currentPlayer, getRoomByName } = useGame();
  const [selectedCardId, setSelectedCardId] = useState("");
  const navigate = useNavigate();
  const currentRoom = getRoomByName(currentPlayer.currentRoom);

  const handlePlayerApproval = (playerId: string, socketId: string) => {
    socket.emit(GameEvents.approvePlayer, {
      playerId,
      socketId,
      room: currentRoom,
    });
  };

  const handlePlayerReject = (playerId: string, socketId: string) => {
    socket.emit(GameEvents.rejectPlayer, {
      playerId,
      socketId,
      room: currentRoom,
    });
  };

  const handleCopyId = (cardBingoId: string) => {
    navigator.clipboard.writeText(cardBingoId).then(() => {
      toastInfo("Texto copiado para area de transferência.");
    });
  };

  const validateChampion = () => {
    const cardBingo = game.bingoCards?.find((bg) => bg.id === selectedCardId);
    let bingoNumber: number[] = [];

    Object.keys(cardBingo!.cardNumbers).map((key) => {
      bingoNumber = [...bingoNumber, ...cardBingo!.cardNumbers[key]];
    });
    bingoNumber = bingoNumber.filter((n) => n !== 0);

    const setDrawNumbers = new Set(game.drawnNumbers);
    const isBingo = bingoNumber.every((num) => setDrawNumbers.has(num));

    if (isBingo) {
      alert("parabens vc ganhou");
    } else {
      alert("que pena.. meteu o louco");
    }
    setSelectedCardId("");
  };

  useEffect(() => {
    if (status === "disconnected") {
      console.log("usuario desconectado...");
      navigate("/");
    }
  }, [status]);

  useEffect(() => {
    const player: Player = getSession();

    if (!player || player.role !== "admin") {
      toastError("You are not logged in as admin", "Not Allowed");
      navigate("/");
    }
  }, []);

  return (
    <PageRoot>
      <PageAside>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-number  hidden lg:block">Bingo Minder</h1>
          <Button
            size="sm"
            className="flex items-center gap-2 text-[0.8rem]"
            onClick={() => navigate("/")}
          >
            <LogOutIcon size={16} /> Fechar sala
          </Button>
        </div>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">Room</TableCell>
              <TableCell>{currentPlayer.currentRoom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Capacity:</TableCell>
              <TableCell>
                <span>{`${game.players?.length}/${game.room?.capacity}`}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Separator className="my-4" />
        <ScrollArea className="h-[24rem]">
          <div className="flex flex-col px-4 space-y-4 w-full">
            <span className="font-bold text-lg">Players</span>
            <ul className="space-y-2">
              {game.players?.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center text-sm justify-between gap-2 py-2 border-y"
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

                  {p.role !== "admin" && p.status === "accepted" && (
                    <div className="flex items-center gap-2">
                      {getBingoCardShortId(p.cardBingoId)}
                      <Button
                        size="icon"
                        variant="secondary"
                        className="size-6"
                        onClick={() => handleCopyId(p.cardBingoId)}
                      >
                        <CopyIcon size={12} />
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Validate Card ID"
            value={selectedCardId}
            onChange={(el) => setSelectedCardId(el.target.value)}
          />
          <Button
            disabled={!selectedCardId}
            onClick={validateChampion}
            size="sm"
          >
            Validate
          </Button>
        </div>
      </PageAside>
      <PageContent>
        <BingoNumbers />
      </PageContent>
    </PageRoot>
  );
}
