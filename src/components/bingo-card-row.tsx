import { BingoRowItem } from "./bingo-row-item";

interface Props {
  rowValues: number[];
}
export function BingoCardRow({ rowValues }: Props) {
  return (
    <div className="w-full flex items-center gap-2 text-slate-900">
      {Array.from({ length: 5 }).map((_, index) => (
        <BingoRowItem key={index} value={String(rowValues[index])} />
      ))}
    </div>
  );
}
