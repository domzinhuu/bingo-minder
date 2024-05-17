export class Player {
  id = "";
  socketId = "";
  name = "";
  role = "";
  status = "";
  currentRoom = "";

  constructor(data) {
    this.id = (data && data.id) || "";
    this.socketId = (data && data.socketId) || "";
    this.name = (data && data.name) || "";
    this.role = (data && data.role) || "";
    this.currentRoom = (data && data.currentRoom) || "";
    this.status = (data && data.status) || "";
  }
}

export class GameRoom {
  name = "";
  capacity = "";
}

export class Bingo {
  id = "";
  owner = "";
  cardNumbers = {};
}

export class GameContext {
  players;
  roomOwner;
  room;
  drawnNumbers;
  bingoCards;
  availableRoom;

  constructor(data) {
    this.players = (data && data.players) || [];
    this.roomOwner = (data && data.roomOwner) || new Player();
    this.room = (data && data.room) || new GameRoom();
    this.drawnNumbers = (data && data.drawnNumbers) || [];
    this.bingoCards = (data && data.bingoCards) || [];
  }
}
