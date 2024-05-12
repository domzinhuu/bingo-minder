import { BingoRowItem } from "./bingo-row-item";

export function BingoHeaderRow() {
  return (
    <div className="w-full flex items-center gap-2 text-slate-900">
      <BingoRowItem value="B" />
      <BingoRowItem value="I" />
      <BingoRowItem value="N" />
      <BingoRowItem value="G" />
      <BingoRowItem value="O" />
    </div>
  );
}
