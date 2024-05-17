export type CreateMatch = {
  roomType: "admin" | "user";
  username: string;
  roomName: string;
  numberOfPlayer?: number;
};
