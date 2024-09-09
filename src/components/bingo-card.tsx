import { BingoCardRow } from "./bingo-card-row";
import { BingoHeaderRow } from "./bingo-header-row";
interface Props {
  cardNumbers: Record<string, number[]>;
}
export function BingoCard({ cardNumbers }: Props) {
  return (
    <div className="rounded-lg space-y-2">
      <BingoHeaderRow />
      {[...Array<number>(5).keys()].map((index) => (
        <BingoCardRow key={"row" + index} cardNumbers={cardNumbers} rowIndex={index}/>
      ))}
    </div>
  );
}
