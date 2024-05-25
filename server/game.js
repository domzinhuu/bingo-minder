import { GameContext, Player } from "./types.js";

class BingoGame {
  context = {};
  rooms = [];

  constructor() {}

  saveGameContext(roomId, game) {
    this.context[roomId] = new GameContext(game);
  }

  removeGameContext(roomId) {
    delete this.context[roomId];
  }

  getGameContext(roomId) {
    return this.context[roomId];
  }

  addRoom(room) {
    this.rooms.push(room);
  }

  removeRoom(roomId) {
    this.rooms = this.rooms.filter((r) => r.id !== roomId);
    delete this.context[roomId];
  }

  addNewPlayerToContext(player, roomId) {
    const newPlayer = new Player(player);

    this.context[roomId].players = [...this.context[roomId].players, newPlayer];
  }

  deletePlayerFromContext(room, playerId) {
    const context = this.getGameContext(room.id);

    if (context) {
      const players = context.players.filter((p) => p.id !== playerId);
      context.players = players;
      this.context[room.id] = context;
    }
  }

  setDrawNumber(room, value) {
    let drawnNumbers = this.context[room.id].drawnNumbers;

    if (drawnNumbers.includes(value)) {
      const updated = drawnNumbers.filter((n) => n !== value);
      this.context[room.id].drawnNumbers = updated;
    } else {
      drawnNumbers.push(value);
      this.context[room.id].drawnNumbers = drawnNumbers;
    }
  }
}

const game = new BingoGame();

export { game };
