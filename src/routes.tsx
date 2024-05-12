import { createBrowserRouter } from "react-router-dom";
import { Home } from "./App";
import { Player } from "./player";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/player",
    element: <Player />,
  },
]);
