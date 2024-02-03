import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  ThirdwebProvider,
  embeddedWallet,
  en,
  metamaskWallet,
} from "@thirdweb-dev/react";
import "./styles/globals.css";
import { LightlinkPegasusTestnet } from "@thirdweb-dev/chains";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
