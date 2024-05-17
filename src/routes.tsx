import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/App";
import { Players } from "./pages/Players";
import { Host } from "./pages/Host";
import { Waiting } from "./pages/Waiting";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/player",
    element: <Players />,
  },
  {
    path: "/host",
    element: <Host />,
  }, {
    path: "/waiting",
    element: <Waiting />,
  },
]);
