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
