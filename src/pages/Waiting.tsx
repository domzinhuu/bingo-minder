import { PageRoot } from "@/components/page";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/game";
import { useCustomToast } from "@/hooks/toaster";
import { Player } from "@/types/game";
import { GameEvents } from "@/utils/enums";
import { socket } from "@/ws/socket";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Waiting() {
  const { currentPlayer, refreshCurrentPlayer } = useGame();
  const { toastInfo } = useCustomToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentPlayer.status === "accepted") {
      navigate("/player");
    }

    if (currentPlayer.status === "rejected") {
      refreshCurrentPlayer({} as Player);
      navigate("/");
    }
  }, [currentPlayer]);

  useEffect(() => {
    socket.on(GameEvents.roomClosed, () => {
      navigate("/");
      toastInfo("This room was closed by the host", "Room closed");
    });
  }, []);

  return (
    <PageRoot>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div>
              <Loader2Icon size={36} className="animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="font-medium">Waiting for approval</h2>
              <span>In a moment you will be redirected to the room...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageRoot>
  );
}
