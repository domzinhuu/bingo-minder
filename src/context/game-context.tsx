import { GameEngine, GameRoom, GameSettings, Player } from "@/types/game";
import { socket } from "@/ws/socket";
import { PropsWithChildren, createContext, useEffect, useState } from "react";

interface ContextProps {
  game: GameEngine;
  currentPlayer: Player;
  currentDrawnNumbers: number[];
  roomList: string[];
  status: "" | "connected" | "disconnected";
  updatePlayers: (player: Player) => void;
  addPlayerInRoom: (playerName: string, roomName: string) => void;
  refreshCurrentPlayer: (player: Player) => void;
  newGame: (settings: GameSettings) => void;
}

const initialState: GameEngine = {
  players: [],
  bingoCards: [],
  drawnNumbers: [],
  room: {} as GameRoom,
};

export const GameContext = createContext<ContextProps>({} as ContextProps);

export function GameProvider({ children }: PropsWithChildren) {
  const [game, setGame] = useState<GameEngine>(initialState);
  const [currentPlayer, setPlayer] = useState<Player>({} as Player);
  const [roomList, setRoomList] = useState<string[]>([]);
  const [status, setStatus] = useState<"" | "connected" | "disconnected">("");

  const handleUpdatePlayers = (player: Player) => {
    const state = { ...game };
    state.players.push(player);
  };

  const refreshCurrentPlayer = (player: Player) => {
    setPlayer(player);
  };
  const addPlayerInRoom = (playerName: string, roomName: string) => {
    socket.emit("add_player_to_room", { playerName, roomName });
  };

  const createANewGame = (setting: GameSettings) => {
    socket.emit("create_game", setting);
  };

  useEffect(() => {
    socket.once("new_player", (data: string[]) => {
      setRoomList(data);
      setStatus("connected");
      console.log("event once - new_player: ", data);
    });

    socket.on("game_updated", (data: GameEngine) => {
      console.log("event - game_updated:", socket.id, data);
      setGame(() => ({ ...data }));
    });

    socket.on("set_current_player", (player: Player) => {
      console.log("event - set_current_player", socket.id, player);
      setPlayer(player);
    });

    socket.on("room_list_updated", (data: string[]) => {
      console.log("event - room_list_updated", socket.id, data);
      setRoomList(data);
    });

    socket.on("disconnected", () => {
      setStatus("disconnected");
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        game,
        status,
        roomList,
        currentPlayer,
        currentDrawnNumbers: game.drawnNumbers,
        addPlayerInRoom,
        updatePlayers: handleUpdatePlayers,
        newGame: createANewGame,
        refreshCurrentPlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
