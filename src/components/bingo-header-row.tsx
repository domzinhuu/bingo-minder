import { BingoRowItem } from "./bingo-row-item";

export function BingoHeaderRow() {
  return (
    <div className="w-full flex items-center gap-2 text-slate-900 font-title">
      <BingoRowItem className="rounded-full border-amber-500 border-4 lg:text-5xl" value="B" />
      <BingoRowItem className="rounded-full border-amber-500 border-4 lg:text-5xl" value="I" />
      <BingoRowItem className="rounded-full border-amber-500 border-4 lg:text-5xl" value="N" />
      <BingoRowItem className="rounded-full border-amber-500 border-4 lg:text-5xl" value="G" />
      <BingoRowItem className="rounded-full border-amber-500 border-4 lg:text-5xl" value="O" />
    </div>
  );
}
