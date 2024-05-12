import { BingoCard } from "./components/bingo-card";
import { PageAside, PageContent, PageRoot } from "./components/page";
import { Table, TableBody, TableCell, TableRow } from "./components/ui/table";
import { generateBingoCard } from "./utils/functions";

export function Player() {
  const cardNumbers = generateBingoCard();
  return (
    <PageRoot>
      <PageAside>
        <h1 className="font-title">Bingo Minder</h1>
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
                <span>Maique Rosa</span>
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
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="size-12 font-number rounded-full border-2 flex justify-center items-center border-amber-500 shadow-lg"
            >
              {i + 1}
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
