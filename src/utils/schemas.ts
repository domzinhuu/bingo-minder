import { z } from "zod";

export const gameSettingsSchema = z.object({
  roomRef: z.string({ required_error: "the room name is required" }),
  playerNumber: z.number({ coerce: true }).optional(),
  username: z
    .string({ required_error: "the username is required" })
    .min(1, { message: "the username should have more than one character" }),
  roomType: z.enum(["admin", "player"], {
    required_error: "select the type of the room",
  }),
});
