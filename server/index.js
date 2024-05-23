import { Player } from "./types.js";
import {
  addNewPlayer,
  approveNewPlayerInRoom,
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
  socket.on(gameEvents.refreshSession, (player) => {
    socket.join(player.currentRoom);
    socket.currentRoom = player.currentRoom;

    refreshPlayer(player);

    updateRoomGame(player.currentRoom);
  });

  socket.on(gameEvents.startNewRoom, (setting) => {
    const player = new Player({
      id: crypto.randomUUID(),
      socketId: socket.id,
      name: setting.username,
      role: setting.roomType,
      status: "accepted",
      currentRoom: setting.roomName,
    });

    const room = {
      name: setting.roomName,
      capacity: setting.playerNumber,
    };

    const isValid = validateRoomCreate(setting.roomName);

    if (isValid) {
      game.addRoom(setting.roomName);
      startNewRoom(socket, player, room);
      setSocketPlayer(socket, player);
      updateRoomGame(room.name);
      updateAvailableRooms();
      gameRoomCreated(socket);
    } else {
      gameRoomCreateError(socket);
    }
  });

  socket.on(gameEvents.addNewPlayer, ({ playerName, roomName }) => {
    const player = new Player({
      id: crypto.randomUUID(),
      socketId: socket.id,
      name: playerName,
      role: "player",
      status: "waiting",
      currentRoom: roomName,
    });

    const { isValid, error } = validateNewPlayerOnRoom(roomName, playerName);

    if (isValid) {
      addNewPlayer(player);
      updateRoomGame(roomName);
      setSocketPlayer(socket, player);
      newPlayerAdded(socket);
    } else {
      newPlayerError(socket, error);
    }
  });

  socket.on(gameEvents.drawNumber, ({ value, roomName }) => {
    drawNumber(roomName, value);
    updateRoomGame(roomName);
  });

  socket.on(gameEvents.approvePlayer, ({ roomName, playerId, socketId }) => {
    const player = approveNewPlayerInRoom(socketId, roomName, playerId);

    io.to(socketId).emit(gameEvents.socketPlayer, player);
    updateRoomGame(roomName);
  });

  socket.on(gameEvents.rejectPlayer, ({ roomName, playerId, socketId }) => {
    rejectPlayerInRoom(socketId, roomName, playerId);
    updateRoomGame(roomName);
  });

  socket.on(gameEvents.disconnect, () => {
    console.log("chamou disconnect", socket.id);
  });

  socket.on(gameEvents.disconnectPlayer, async ({ playerId, room }) => {
    const closeRoom = playerDisconnected(playerId, room);

    if (closeRoom) {
      const sockets = await io.in(room).fetchSockets();

      sockets.forEach((sct) => {
        getAvailableRooms(sct);
        sct.emit(gameEvents.roomClosed);
        sct.leave(room);
      });
    } else {
      updateRoomGame(socket.currentRoom);
    }
  });
});

httpServer.listen(8080, () => console.log("Server is running on port 8080"));
