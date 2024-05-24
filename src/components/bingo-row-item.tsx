import { cn, updateCheckedNumbers } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

interface Props {
  value: string;
  className?: string;
  isChecked?: boolean;
}
export function BingoRowItem({ value, className, isChecked = false }: Props) {
  const [checked, setChecked] = useState(isChecked);

  const handleCheckNumber = () => {
    updateCheckedNumbers(Number(value));
    setChecked((prev) => !prev);
  };
  return (
    <div
      data-coringa={Number(value) === 0}
      className={cn(
        "lg:w-28 lg:h-28 size-16  flex-1 bg-slate-50 rounded-lg flex justify-center items-center",
        className
      )}
    >
      {value === "0" ? (
        <img src="/images/joker.png" className="lg:size-24  size-14" />
      ) : (
        <Button
          onClick={handleCheckNumber}
          data-clicked={checked}
          disabled={["B", "I", "N", "G", "O"].includes(value)}
          variant="ghost"
          className={cn(
            "rounded-full disabled:border-none disabled:opacity-100 lg:size-28 size-16 flex-1 flex justify-center items-center text-2xl data-[clicked=true]:bg-slate-900 data-[clicked=true]:text-white data-[clicked=true]:border-8 data-[clicked=true]:border-red-500",
            className
          )}
        >
          {value}
        </Button>
      )}
    </div>
  );
}
