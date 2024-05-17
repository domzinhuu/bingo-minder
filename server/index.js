import { createServer } from "node:http";
import { Server } from "socket.io";
import { GameContext, Player } from "./types.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "*",
});

let roomList = {};
io.on("connection", (socket) => {
  console.log("connected: ", socket.id);
  //Sending

  socket.emit("new_player", Object.keys(roomList));

  //Listening
  socket.on("create_game", (setting) => {
    const player = new Player({
      id: crypto.randomUUID(),
      socketId: socket.id,
      name: setting.username,
      role: setting.roomType,
      status: "",
      currentRoom: setting.roomName,
    });

    const room = {
      name: setting.roomName,
      capacity: setting.playerNumber || 5,
    };
    socket.join(player.currentRoom);
    const gameContext = new GameContext();
    gameContext.players = [...gameContext.players, player];
    gameContext.room = room;
    roomList[player.currentRoom] = gameContext;

    socket.currentRoom = room.name;

    socket.emit("set_current_player", player);
    io.to(player.currentRoom).emit("game_updated", gameContext);
    io.emit("room_list_updated", Object.keys(roomList));
  });

  socket.on("add_player_to_room", ({ playerName, roomName }) => {
    const player = new Player();
    player.currentRoom = roomName;
    player.name = playerName;
    player.id = crypto.randomUUID();
    player.socketId = socket.id;
    player.role = "player";
    player.status = "waiting"

    const gameContext = new GameContext(roomList[roomName]);

    gameContext.players = [...gameContext.players, player];

    roomList[roomName] = gameContext;
    io.to(roomName).emit("game_updated", gameContext);
  });

  socket.on("draw_number", ({ value, roomName }) => {
    const gameContext = new GameContext(roomList[roomName]);

    let drawnNumbers = gameContext.drawnNumbers || [];

    if (drawnNumbers.includes(value)) {
      const updated = drawnNumbers.filter((n) => n !== value);
      gameContext.drawnNumbers = updated;
    } else {
      drawnNumbers.push(value);
      gameContext.drawnNumbers = drawnNumbers;
    }
    roomList[roomName] = gameContext;

    io.to(roomName).emit("game_updated", gameContext);
  });

  socket.on("approve_player", ({ roomName, playerId, socketId }) => {
    io.to(socketId).socketsJoin(roomName);
    const gameContext = new GameContext(roomList[roomName]);
    let currentPlayer = {};

    gameContext.players.map((p) => {
      if (p.id === playerId) {
        p.status = "accepted";
        currentPlayer = p;
      }
      return p;
    });

    roomList[roomName] = gameContext
    io.to(roomName).emit("game_updated", gameContext);
    io.sockets.sockets.get(socketId).emit("set_current_player", currentPlayer);
  });

  socket.on("reject_player", ({ roomName, playerId, socketId }) => {
    io.to(socketId).socketsLeave(roomName);
    const gameContext = new GameContext(roomList[roomName]);

    gameContext.players = gameContext.players.filter((p) => p.id !== playerId);


    roomList[roomName] = gameContext
    io.to(roomName).emit("game_updated", gameContext);
    io.sockets.sockets
      .get(socketId)
      .emit("set_current_player", { status: "rejected" });
  });

  socket.on("disconnect", () => {
    console.log("disconected", socket.id);
    const context = roomList[socket.currentRoom];
    const gameContext = new GameContext(context);

    const player = new Player(
      gameContext.players.find((p) => p.id === socket.id)
    );

    gameContext.players = gameContext.players.filter((p) => p.id !== socket.id);

    if (player && player.role === "admin") {
      io.to(player.currentRoom).disconnectSockets();
      delete roomList[socket.currentRoom];
      io.emit("room_list_updated", Object.keys(roomList));
      return;
    }

    io.to(player.currentRoom).emit("game_updated", gameContext);
  });
});

httpServer.listen(8080, () => console.log("Server is running on port 8080"));
