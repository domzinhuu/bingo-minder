import { useGame } from "@/hooks/game";
import { BingoCard } from "../components/bingo-card";
import { PageAside, PageContent, PageRoot } from "../components/page";
import { Table, TableBody, TableCell, TableRow } from "../components/ui/table";
import { generateBingoCard } from "../utils/functions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Players() {
  const { currentDrawnNumbers, status, currentPlayer } = useGame();
  const cardNumbers = generateBingoCard();
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
          {currentDrawnNumbers.map((value) => (
            <div
              key={value}
              className="size-12 font-number rounded-full border-2 flex justify-center items-center border-amber-500 shadow-lg"
            >
              {value}
            </div>
          ))}
        </div>
      </PageAside>
      <PageContent>
        <BingoCard cardNumbers={cardNumbers} />
      </PageContent>
    </PageRoot>
  );
}
