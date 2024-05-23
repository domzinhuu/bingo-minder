import { GameContext, Player } from "./types.js";

class BingoGame {
  context = {};
  rooms = [];

  constructor() {}

  saveGameContext(roomName, game) {
    this.context[roomName] = new GameContext(game);
  }

  removeGameContext(roomName) {
    delete this.context[roomName];
  }

  getGameContext(roomName) {
    return this.context[roomName];
  }

  addRoom(roomName) {
    this.rooms.push(roomName);
  }

  removeRoom(roomName) {
    this.rooms = this.rooms.filter((r) => r !== roomName);
    delete this.context[roomName];
  }

  addNewPlayerToContext(player) {
    const newPlayer = new Player(player);

    this.context[newPlayer.currentRoom].players = [
      ...this.context[newPlayer.currentRoom].players,
      player,
    ];
  }

  deletePlayerFromContext(roomName, playerId) {
    if (this.context[roomName]) {
      this.context[roomName].players = this.context[roomName].players.filter(
        (p) => p.id !== playerId
      );
    }
  }

  setDrawNumber(roomName, value) {
    let drawnNumbers = this.context[roomName].drawnNumbers;

    if (drawnNumbers.includes(value)) {
      const updated = drawnNumbers.filter((n) => n !== value);
      this.context[roomName].drawnNumbers = updated;
    } else {
      drawnNumbers.push(value);
      this.context[roomName].drawnNumbers = drawnNumbers;
    }
  }
}

const game = new BingoGame();

export { game };
