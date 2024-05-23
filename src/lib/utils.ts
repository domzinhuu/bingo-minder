import { Player } from "@/types/game";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setSession(player: Player) {
  sessionStorage.setItem("player", JSON.stringify(player));
}

export function getSession() {
  const player = sessionStorage.getItem("player");
  return player ? JSON.parse(player) : null;
}

export function clearSession() {
  sessionStorage.removeItem("player");
}

export function updateCheckedNumbers(value: number) {
  const values = sessionStorage.getItem("checkedNumbers");
  const list: number[] = values ? JSON.parse(values) : [];

  if (list.includes(value)) {
    sessionStorage.setItem(
      "checkedNumbers",
      JSON.stringify(list.filter((n) => n !== value))
    );
  } else {
    list.push(value);
    sessionStorage.setItem("checkedNumbers", JSON.stringify(list));
  }
}

export function getCheckedNumbers() {
  const values = sessionStorage.getItem("checkedNumbers");

  return values ? JSON.parse(values) : [];
}
