import { gameEvents } from "./constants.js";
import { game } from "./game.js";
import { generateBingoCard } from "./helper.js";
import { Bingo, GameContext } from "./types.js";
import { io } from "./websocket.js";

export function getAvailableRooms(socket) {
  socket.emit(gameEvents.availableRooms, game.rooms);
}

export function startNewRoom(socket, player, room) {
  socket.currentRoom = room.id;

  const gameContext = new GameContext();
  gameContext.players = [player];
  gameContext.room = room;

  let bingoCards = [];
  Array.from({ length: room.capacity }).forEach(() => {
    const numbers = generateBingoCard();
    bingoCards.push(new Bingo("", numbers));
  });

  gameContext.bingoCards = bingoCards;
  game.saveGameContext(room.id, gameContext);
  socket.join(room.id);
}

export function gameRoomCreated(socket) {
  socket.emit(gameEvents.gameRoomCreated);
}

export function gameRoomCreateError(socket) {
  socket.emit(gameEvents.gameRoomCreateError, {
    message: "This room name already exists",
  });
}

export function setSocketPlayer(socket, player) {
  socket.emit(gameEvents.socketPlayer, player);
}

export function updateRoomGame(room) {
  if (room) {
    io.to(room.id).emit(gameEvents.gameUpdated, game.getGameContext(room.id));
  }
}

export function updateAvailableRooms() {
  io.emit(gameEvents.updateAvailableRooms, game.rooms);
}

export function addNewPlayer(player, roomId) {
  game.addNewPlayerToContext(player, roomId);
}

export function newPlayerAdded(socket) {
  socket.emit(gameEvents.newPlayerAdded);
}

export function newPlayerError(socket, error) {
  socket.emit(gameEvents.newPlayerError, error);
}

export function drawNumber(room, value) {
  game.setDrawNumber(room, value);
}

export function approveNewPlayerInRoom(socketId, room, playerId) {
  io.to(socketId).socketsJoin(room.id);

  const gameContext = new GameContext(game.getGameContext(room.id));
  const bingoCardAvailable = gameContext.bingoCards.find((bc) => !bc.owner);

  if (bingoCardAvailable) {
    bingoCardAvailable.owner = playerId;
  }

  let currentPlayer = {};
  gameContext.players.map((p) => {
    if (p.id === playerId) {
      p.status = "accepted";
      p.cardBingoId = (bingoCardAvailable && bingoCardAvailable.id) || "";
      currentPlayer = p;
    }
    return p;
  });

  game.saveGameContext(room.id, gameContext);
  return currentPlayer;
}

export function rejectPlayerInRoom(socketId, room, playerId) {
  io.to(socketId).socketsLeave(room.id);

  const gameContext = new GameContext(game.getGameContext(room.id));
  gameContext.players = gameContext.players.filter((p) => p.id !== playerId);
  game.saveGameContext(room.id, gameContext);

  io.sockets.sockets
    .get(socketId)
    .emit(gameEvents.socketPlayer, { status: "rejected" });
}

export function clearTable(socket){
  game.clearDrawNumber(socket.currentRoom);
}

export function refreshPlayer(player, roomId) {
  const gameContext = new GameContext(game.getGameContext(roomId));

  if (gameContext) {
    const players = gameContext.players.filter((p) => p.id !== player.id);

    players.push(player);
    gameContext.players = players;

    game.saveGameContext(roomId, gameContext);
  }
}

export function playerDisconnected(playerId, room) {
  if (room) {
    const gameContext = new GameContext(game.getGameContext(room.id));

    const player = gameContext.players.find((p) => p.id === playerId);
    let closeRoom = false;

    if (player && player.role === "admin") {
      closeRoom = true;
      game.removeRoom(room.id);
    } else {
      game.deletePlayerFromContext(room, playerId);
      console.log("Jogador desconectado");
    }

    return closeRoom;
  }
}
