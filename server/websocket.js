import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  path: "/ws/",
  cors: {
    origin: "*",
  },
});

export { io, httpServer };
