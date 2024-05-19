export class Player {
  id = "";
  socketId = "";
  cardBingoId = "";
  name = "";
  role = "";
  status = "";
  currentRoom = "";

  constructor(data) {
    this.id = (data && data.id) || "";
    this.socketId = (data && data.socketId) || "";
    this.cardBingoId = (data && data.cardBingoId) || "";
    this.name = (data && data.name) || "";
    this.role = (data && data.role) || "";
    this.currentRoom = (data && data.currentRoom) || "";
    this.status = (data && data.status) || "";
  }
}

export class GameRoom {
  name = "";
  capacity = "";

  constructor(data) {
    this.name = (data && data.name) || "";
    this.capacity = (data && data.capacity) || "";
  }
}

export class Bingo {
  id = "";
  owner = "";
  cardNumbers = {};

  constructor(owner, cardNumbers, id) {
    this.id = id || crypto.randomUUID();
    this.owner = owner;
    this.cardNumbers = cardNumbers;
  }
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

export class Settings {
  roomName;
  playerNumber;
  username;
  roomType;

  constructor(data) {
    this.roomName = data.roomName;
    this.playerNumber = data.playerNumber;
    (this.username = data.username), (this.roomType = data.roomType);
  }
}
