import { gameEvents } from "./constants.js";
import { context } from "./game.js";
import { GameContext } from "./types.js";
import { io } from "./websocket.js";

export function getAvailableRooms(socket) {
  socket.emit(gameEvents.availableRooms, Object.keys(context));
}

export function startNewRoom(socket, player, room) {
  socket.currentRoom = room.name;

  const gameContext = new GameContext();
  gameContext.players = [player];
  gameContext.room = room;
  context[player.currentRoom] = gameContext;
  socket.join(room.name);
}

export function setSocketPlayer(socket, player) {
  socket.emit(gameEvents.socketPlayer, player);
}

export function updateRoomGame(room) {
  io.to(room).emit(gameEvents.gameUpdated, context[room]);
}

export function connectPlayer(socket) {
  console.log("event - new socket connection:", socket.id);
}

export function updateAvailableRooms() {
  io.emit(gameEvents.updateAvailableRooms, Object.keys(context));
}

export function addNewPlayer(socket, player) {
  const gameContext = new GameContext(context[player.currentRoom]);
  gameContext.players = [...gameContext.players, player];
  context[player.currentRoom] = gameContext;
}

export function drawNumber(room, value) {
  const gameContext = new GameContext(context[room]);

  let drawnNumbers = gameContext.drawnNumbers || [];

  if (drawnNumbers.includes(value)) {
    const updated = drawnNumbers.filter((n) => n !== value);
    gameContext.drawnNumbers = updated;
  } else {
    drawnNumbers.push(value);
    gameContext.drawnNumbers = drawnNumbers;
  }
  context[room] = gameContext;
}

export function approveNewPlayerInRoom(socketId, room, playerId) {
  io.to(socketId).socketsJoin(room);

  const gameContext = new GameContext(context[room]);
  let currentPlayer = {};

  gameContext.players.map((p) => {
    if (p.id === playerId) {
      p.status = "accepted";
      currentPlayer = p;
    }
    return p;
  });
  context[room] = gameContext;

  return currentPlayer;
}

export function rejectPlayerInRoom(socketId, room, playerId) {
  io.to(socketId).socketsLeave(room);

  const gameContext = new GameContext(context[room]);
  gameContext.players = gameContext.players.filter((p) => p.id !== playerId);
  context[room] = gameContext;

  io.sockets.sockets
    .get(socketId)
    .emit(gameEvents.socketPlayer, { status: "rejected" });
}

export function refreshPlayer(player) {
  if (context[player.currentRoom]) {
    const players = context[player.currentRoom].players.filter(
      (p) => p.id !== player.id
    );

    players.push(player);
    context[player.currentRoom].players = players;
  }
}

export function playerDisconnected(socket) {
  const game = new GameContext(context[socket.currentRoom]);
  const player = game.players.filter((p) => (p.socketId = socket.id));
  console.log(player);
}
