import { game } from "./game.js";
import { GameContext } from "./types.js";

export function validateRoomCreate(roomName) {
  const rooms = game.rooms;

  const alreadyExist = rooms.some((r) => r.name === roomName);
  return !alreadyExist;
}

export function validateNewPlayerOnRoom(roomId, playerName) {
  const gameContext = new GameContext(game.getGameContext(roomId));
  const players = gameContext.players;
  const roomCapacity = gameContext.room.capacity;

  if (!players) return true;

  const alreadyExist = players.some((p) => p.name === playerName);

  if (alreadyExist) {
    return {
      isValid: false,
      error: {
        message: "This player already exists on this room.",
        title: "Already in room",
      },
    };
  }

  const fullRoom = players.length >= roomCapacity;

  return {
    isValid: !fullRoom,
    error: {
      message: "This room is already full, choose another or waiting.",
      title: "Full room",
    },
  };
}
