import { convertToMatrix, transpose } from "@/utils/functions";
import { BingoCardRow } from "./bingo-card-row";
import { BingoHeaderRow } from "./bingo-header-row";
interface Props {
  cardNumbers: Record<string, number[]>;
}
export function BingoCard({ cardNumbers }: Props) {
  const matrix = transpose(convertToMatrix(cardNumbers));
  return (
    <div className="rounded-lg space-y-2">
      <BingoHeaderRow />
      {matrix.map((row, index) => (
        <BingoCardRow key={"row_" + index} rowValues={row} />
      ))}
    </div>
  );
}
