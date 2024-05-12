import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="bg-[#0f0e0c] min-h-screen bg-contain bg-right bg-[url('/images/1.png')] bg-no-repeat">
      <RouterProvider router={routes} />
    </div>
  </React.StrictMode>
);
