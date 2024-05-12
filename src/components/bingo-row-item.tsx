import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

interface Props {
  value: string;
  className?: string;
}
export function BingoRowItem({ value, className }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      data-coringa={Number(value) === 0}
      className={cn(
        "w-28 h-28 flex-1 bg-slate-50 rounded-lg flex justify-center items-center",
        className
      )}
    >
      {value === "0" ? (
        <img src="/images/joker.png" className="size-24" />
      ) : (
        <Button
          onClick={() => setChecked((prev) => !prev)}
          data-clicked={checked}
          variant="ghost"
          className={cn(
            "rounded-full size-28 flex justify-center items-center text-2xl data-[clicked=true]:bg-slate-900 data-[clicked=true]:text-white data-[clicked=true]:border-8 data-[clicked=true]:border-red-500",
            className
          )}
        >
          {value}
        </Button>
      )}
    </div>
  );
}
