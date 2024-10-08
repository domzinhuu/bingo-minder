import { BingoRowItem } from "./bingo-row-item";
import { getCheckedNumbers } from "@/lib/utils";

interface Props {
  rowValues: number[];
}
export function BingoCardRow({ rowValues }: Props) {
  const checkedNumbers: number[] = getCheckedNumbers();

  const verifyIfIsAlreadyChecked = (value: number) => {
    return checkedNumbers.includes(value);
  };

  return (
    <div className="w-full flex items-center gap-2 text-slate-900">
      {rowValues.map((value, idx) => (
        <BingoRowItem key={idx} value={String(value)} isChecked={verifyIfIsAlreadyChecked(value)} />
      ))}
    </div>
  );
}
