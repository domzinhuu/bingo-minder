import { useGame } from "@/hooks/game";
import { BingoCard } from "../components/bingo-card";
import { PageAside, PageContent, PageRoot } from "../components/page";
import { Table, TableBody, TableCell, TableRow } from "../components/ui/table";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export function Players() {
  const { currentDrawnNumbers, status, currentPlayer, getBingoCard } =
    useGame();
  const bingo = getBingoCard(currentPlayer.cardBingoId!);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "disconnected") {
      navigate("/");
    }
  }, [status]);

  return (
    <PageRoot>
      <PageAside>
        <h1 className="font-title hidden lg:block">Bingo Minder</h1>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <span className="font-bold">Id Card:</span>{" "}
                <span>#0908127273</span>
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

        <Button
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <LogOutIcon /> Logout
        </Button>
      </PageAside>
      <PageContent>
        {bingo.cardNumbers && <BingoCard cardNumbers={bingo.cardNumbers} />}
      </PageContent>
    </PageRoot>
  );
}
