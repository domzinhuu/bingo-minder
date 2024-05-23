import ReactDOM from "react-dom/client";
import "./global.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import { GameProvider } from "./context/game-context.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GameProvider>
    <div className="bg-[#0f0e0c] min-h-screen bg-contain bg-right bg-[url('/images/1.png')] bg-no-repeat">
      <RouterProvider router={routes} />
      <Toaster />
    </div>
  </GameProvider>
);
