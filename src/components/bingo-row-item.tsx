interface Props {
  value: string;
}
export function BingoRowItem({ value }: Props) {
  return (
    <div
      data-coringa={Number(value) === 0}
      className="w-28 h-28 text-2xl bg-slate-50 data-[coringa=true]:bg-sky-700  data-[coringa=true]:text-white rounded-lg flex justify-center items-center"
    >
      {value}
    </div>
  );
}
