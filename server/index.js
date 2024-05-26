import { Player } from "./types.js";
import {
  addNewPlayer,
  approveNewPlayerInRoom,
  clearTable,
  drawNumber,
  gameRoomCreateError,
  gameRoomCreated,
  getAvailableRooms,
  newPlayerAdded,
  newPlayerError,
  playerDisconnected,
  refreshPlayer,
  rejectPlayerInRoom,
  setSocketPlayer,
  startNewRoom,
  updateAvailableRooms,
  updateRoomGame,
} from "./functions.js";
import { httpServer, io } from "./websocket.js";
import { gameEvents } from "./constants.js";
import { validateNewPlayerOnRoom, validateRoomCreate } from "./validations.js";
import { game } from "./game.js";

io.on("connection", (socket) => {
  // Sending room list to new socket connected
  getAvailableRooms(socket);

  //Listening
  socket.on(gameEvents.refreshSession, ({ currentPlayer }) => {
    const room = game.rooms.find((r) => r.name === currentPlayer.currentRoom);

    socket.join(room.id);
    socket.currentRoom = room.id;
    refreshPlayer(currentPlayer, room.id);

    updateRoomGame(room);
  });

  socket.on(gameEvents.startNewRoom, (setting) => {
    const player = new Player({
      id: crypto.randomUUID(),
      socketId: socket.id,
      name: setting.username,
      role: setting.roomType,
      status: "accepted",
      currentRoom: setting.roomRef,
    });

    const room = {
      id: crypto.randomUUID(),
      name: setting.roomRef,
      capacity: setting.playerNumber,
    };

    const isValid = validateRoomCreate(setting.roomRef);

    if (isValid) {
      game.addRoom(room);
      startNewRoom(socket, player, room);
      setSocketPlayer(socket, player);
      updateRoomGame(room);
      updateAvailableRooms();
      gameRoomCreated(socket);
    } else {
      gameRoomCreateError(socket);
    }
  });

  socket.on(gameEvents.addNewPlayer, ({ playerName, room }) => {
    const player = new Player({
      id: crypto.randomUUID(),
      socketId: socket.id,
      name: playerName,
      role: "player",
      status: "waiting",
      currentRoom: room.name,
    });

    const { isValid, error } = validateNewPlayerOnRoom(room.id, playerName);

    if (isValid) {
      addNewPlayer(player, room.id);
      updateRoomGame(room);
      setSocketPlayer(socket, player);
      newPlayerAdded(socket);
    } else {
      newPlayerError(socket, error);
    }
  });

  socket.on(gameEvents.drawNumber, ({ value, room }) => {
    drawNumber(room, value);
    updateRoomGame(room);
  });

  socket.on(gameEvents.approvePlayer, ({ room, playerId, socketId }) => {
    const player = approveNewPlayerInRoom(socketId, room, playerId);

    io.to(socketId).emit(gameEvents.socketPlayer, player);
    updateRoomGame(room);
  });

  socket.on(gameEvents.rejectPlayer, ({ room, playerId, socketId }) => {
    rejectPlayerInRoom(socketId, room, playerId);
    updateRoomGame(room);
  });

  socket.on(gameEvents.clearTable, () => {
    clearTable(socket);
    updateRoomGame({ id: socket.currentRoom });
  });

  socket.on(gameEvents.disconnect, () => {
    console.log("chamou disconnect", socket.id);
  });

  socket.on(gameEvents.disconnectPlayer, async ({ playerId, room }) => {
    const closeRoom = playerDisconnected(playerId, room);

    if (closeRoom) {
      const sockets = await io.in(room.id).fetchSockets();
      sockets.forEach((sct) => {
        getAvailableRooms(sct);
        sct.emit(gameEvents.roomClosed);
        sct.leave(room);
      });
    } else {
      updateRoomGame(room);
    }
  });
});

httpServer.listen(8080, () => console.log("Server is running on port 8080"));
