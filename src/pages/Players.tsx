import { useGame } from "@/hooks/game";
import { BingoCard } from "../components/bingo-card";
import { PageAside, PageContent, PageRoot } from "../components/page";
import { Table, TableBody, TableCell, TableRow } from "../components/ui/table";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { getBingoCardShortId } from "@/utils/functions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/ws/socket";
import { GameEvents } from "@/utils/enums";
import { useCustomToast } from "@/hooks/toaster";
import { Player } from "@/types/game";
import { getSession } from "@/lib/utils";

export function Players() {
  const { toastInfo, toastError } = useCustomToast();
  const { currentDrawnNumbers, status, currentPlayer, getBingoCard } =
    useGame();
  const bingo = getBingoCard(currentPlayer.cardBingoId!);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "disconnected") {
      navigate("/");
    }
  }, [status]);

  useEffect(() => {
    const player: Player = getSession();
    if (!player) {
      toastError("You are not logged in", "Not Allowed");
      navigate("/");
    }

    socket.on(GameEvents.roomClosed, () => {
      navigate("/");
      toastInfo("This room was closed by the host", "Room closed");
    });
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
            <LogOutIcon size={16} /> Sair
          </Button>
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <span className="font-bold">Id Card:</span>{" "}
                <span>{getBingoCardShortId(currentPlayer.cardBingoId)}</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <span className="font-bold">Player:</span>{" "}
                <span>{currentPlayer.name}</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="">
                <span className="font-bold">Drawn numbers:</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <ScrollArea className="h-[24rem]">
          <div className="flex items-center gap-2 flex-wrap">
            {currentDrawnNumbers?.map((value) => (
              <div
                key={value}
                className="size-12 font-number rounded-full border-2 flex justify-center items-center border-amber-500 shadow-lg"
              >
                {value}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PageAside>
      <PageContent>
        {bingo.cardNumbers && <BingoCard cardNumbers={bingo.cardNumbers} />}
      </PageContent>
    </PageRoot>
  );
}
