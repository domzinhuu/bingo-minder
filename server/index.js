import { Player } from "./types.js";
import {
  addNewPlayer,
  approveNewPlayerInRoom,
  drawNumber,
  getAvailableRooms,
  refreshPlayer,
  rejectPlayerInRoom,
  setSocketPlayer,
  startNewRoom,
  updateAvailableRooms,
  updateRoomGame,
} from "./functions.js";
import { httpServer, io } from "./websocket.js";
import { gameEvents } from "./constants.js";

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

    startNewRoom(socket, player, room);
    setSocketPlayer(socket, player);

    updateRoomGame(room.name);
    updateAvailableRooms();
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

    //TODO: adicionar validaçao aqui para ver se o player é valido, se ja existem alguem com mesmo nome, etc...
    addNewPlayer(socket, player);
    updateRoomGame(roomName);
    setSocketPlayer(socket, player);
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
});

httpServer.listen(8080, () => console.log("Server is running on port 8080"));
