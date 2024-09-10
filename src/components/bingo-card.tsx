import { BingoCardRow } from "./bingo-card-row";
import { BingoHeaderRow } from "./bingo-header-row";
interface Props {
  cardNumbers: Record<string, number[]>;
}
export function BingoCard({ cardNumbers }: Props) {
  /** Convert and transpose the object cardNumber to an array of arrays, with each Letter of BINGO as column */
  const rows = [...Array<number>(5).keys()].map((i) => Object.keys(cardNumbers).map((k) => cardNumbers[k][i]));
  return (
    <div className="rounded-lg space-y-2">
      <BingoHeaderRow />
      {rows.map((rowValues, index) => (
        <BingoCardRow key={"row_" + index} rowValues={rowValues} />
      ))}
    </div>
  );
}
