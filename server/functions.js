import { gameEvents } from "./constants.js";
import { game } from "./game.js";
import { generateBingoCard } from "./helper.js";
import { Bingo, GameContext } from "./types.js";
import { io } from "./websocket.js";

export function getAvailableRooms(socket) {
  socket.emit(gameEvents.availableRooms, game.rooms);
}

export function startNewRoom(socket, player, room) {
  socket.currentRoom = room.name;

  const gameContext = new GameContext();
  gameContext.players = [player];
  gameContext.room = room;

  let bingoCards = [];
  Array.from({ length: room.capacity }).forEach(() => {
    const numbers = generateBingoCard();
    bingoCards.push(new Bingo("", numbers));
  });

  gameContext.bingoCards = bingoCards;
  game.saveGameContext(room.name, gameContext);
  socket.join(room.name);
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
  io.to(room).emit(gameEvents.gameUpdated, game.getGameContext(room));
}

export function updateAvailableRooms() {
  io.emit(gameEvents.updateAvailableRooms, game.rooms);
}

export function addNewPlayer(player) {
  game.addNewPlayerToContext(player);
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
  io.to(socketId).socketsJoin(room);

  const gameContext = new GameContext(game.getGameContext(room));
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

  game.saveGameContext(gameContext);
  return currentPlayer;
}

export function rejectPlayerInRoom(socketId, room, playerId) {
  io.to(socketId).socketsLeave(room);

  const gameContext = new GameContext(game.getGameContext(room));
  gameContext.players = gameContext.players.filter((p) => p.id !== playerId);
  game.saveGameContext(gameContext);

  io.sockets.sockets
    .get(socketId)
    .emit(gameEvents.socketPlayer, { status: "rejected" });
}

export function refreshPlayer(player) {
  const gameContext = new GameContext(game.getGameContext(player.currentRoom));

  if (gameContext) {
    const players = gameContext.players.filter((p) => p.id !== player.id);

    players.push(player);
    gameContext.players = players;

    game.saveGameContext(gameContext);
  }
}

export function playerDisconnected(playerId, room) {
  const gameContext = new GameContext(game.getGameContext(room))

  const player = gameContext.players.find((p) => p.id === playerId);
  let closeRoom = false;

  if (player && player.role === "admin") {
    closeRoom = true;
    game.removeRoom(room);
  } else {
    game.deletePlayerFromContext(room, playerId);
    console.log("Jogador desconectado");
  }

  return closeRoom;
}
