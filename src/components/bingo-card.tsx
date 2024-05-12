import { BingoCardRow } from "./bingo-card-row";
import { BingoHeaderRow } from "./bingo-header-row";
interface Props {
  cardNumbers: Record<string, number[]>;
}
export function BingoCard({ cardNumbers }: Props) {
  return (
    <div className="rounded-lg space-y-2">
      <BingoHeaderRow />
      {["B", "I", "N", "G", "O"].map((letter) => (
        <BingoCardRow key={letter} rowValues={cardNumbers[letter]} />
      ))}
    </div>
  );
}
