import { getSession, setSession } from "@/lib/utils";
import { GameEngine, GameRoom, GameSettings, Player } from "@/types/game";
import { GameEvents } from "@/utils/enums";
import { socket } from "@/ws/socket";
import { PropsWithChildren, createContext, useEffect, useState } from "react";

interface ContextProps {
  game: GameEngine;
  currentPlayer: Player;
  currentDrawnNumbers: number[];
  roomList: GameRoom[];
  status: "" | "connected" | "disconnected";
  updatePlayers: (player: Player) => void;
  addPlayerInRoom: (playerName: string, roomRef: string) => void;
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
  const [roomList, setRoomList] = useState<GameRoom[]>([]);
  const [status, setStatus] = useState<"" | "connected" | "disconnected">("");

  const handleUpdatePlayers = (player: Player) => {
    const state = { ...game };
    state.players.push(player);
  };

  const refreshCurrentPlayer = (player: Player) => {
    setPlayer(player);
  };

  const addPlayerInRoom = (playerName: string, roomRef: string) => {
    const room = roomList.find((r) => r.id === roomRef);

    socket.emit(GameEvents.addNewPlayer, { playerName, room });
  };

  const createANewGame = (setting: GameSettings) => {
    socket.emit(GameEvents.startNewRoom, setting);
  };

  useEffect(() => {
    socket.on(GameEvents.connect, () => {
      const currentPlayer: Player = getSession();

      if (currentPlayer && currentPlayer.status === "accepted") {
        currentPlayer.socketId = socket.id;

        socket.emit(GameEvents.refreshSession, { currentPlayer });
      }
    });

    socket.on(GameEvents.availableRooms, (data: GameRoom[]) => {
      setRoomList(data);
      setStatus("connected");
      const player = getSession();

      if (player) {
        setPlayer(player);
      }
    });

    socket.on(GameEvents.gameUpdated, (data: GameEngine) => {
      setGame(() => ({ ...data }));
    });

    socket.on(GameEvents.socketPlayer, (player: Player) => {
      setPlayer(player);
      setSession(player);
    });

    socket.on(GameEvents.updateAvailableRooms, (data: GameRoom[]) => {
      setRoomList(data);
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
