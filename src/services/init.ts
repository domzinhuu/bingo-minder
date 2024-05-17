import { CreateMatch } from "@/types/create-match";
import { socket } from "@/ws/socket";

export function createAMatch(data: CreateMatch) {
  if (data.roomType === "admin") {
    socket.emit("create_room", data);
  }
}
