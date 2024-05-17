import { zodResolver } from "@hookform/resolvers/zod";
import { PageAside, PageContent, PageRoot } from "../components/page";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { CirclePowerIcon } from "lucide-react";
import { useGame } from "../hooks/game";
import { GameSettings } from "../types/game";
import { gameSettingsSchema } from "../utils/schemas";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  const form = useForm<GameSettings>({
    resolver: zodResolver(gameSettingsSchema),
    defaultValues: {
      username: "",
      roomName: "",
      roomType: "admin",
      playerNumber: 2,
    },
  });
  const { roomList, newGame, addPlayerInRoom } = useGame();

  const handleNewMatch = (setting: GameSettings) => {
    if (setting.roomType === "admin") {
      newGame(setting);
      navigate("/host");
    } else {
      addPlayerInRoom(setting.username, setting.roomName);
      navigate("/waiting");
    }
  };


  

  const roomType = form.watch("roomType");
  return (
    <PageRoot>
      <PageAside>
        <div className="flex flex-col justify-between h-full">
          <div className="flex-1">
            <h1 className="font-title">Bingo Minder</h1>
            <p>This is a bingo app for Minder plays during the happy hour.</p>
          </div>

          <span className="text-[0.856rem]">&copy; 2024 Msr Software</span>
        </div>
      </PageAside>
      <PageContent>
        <div className="w-[500px] ">
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleNewMatch)}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-number">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-white font-number">
                      Enter as...
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-12"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="admin" />
                          </FormControl>
                          <FormLabel className="font-light text-white cursor-pointer">
                            Enter as admin
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="player" />
                          </FormControl>
                          <FormLabel className="font-light text-white cursor-pointer">
                            Enter as player
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {roomType === "admin" && (
                <div className="flex items-center gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="roomName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-white font-number">
                          Room name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Room" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="playerNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-white font-number">
                          Number of players
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Player number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {roomType === "player" && (
                <FormField
                  control={form.control}
                  name="roomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-number text-white">
                        Select a room
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room to enter..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!roomList.length ? (
                            <SelectItem value="label" disabled={true}>
                              No rooms available
                            </SelectItem>
                          ) : (
                            roomList.map((room) => (
                              <SelectItem key={room} value={room}>
                                {room}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex w-full justify-end">
                <Button
                  size="lg"
                  type="submit"
                  variant="primary"
                  className="flex items-center gap-4 font-number"
                >
                  {roomType === "admin" ? "Create" : "Enter"}
                  <CirclePowerIcon />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </PageContent>
    </PageRoot>
  );
}