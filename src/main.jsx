import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/Header.css";
import "./styles/Footer.css";
import "./styles/MainScreen.css";
import "./styles/Search.css";
import "./styles/SuggestionsList.css";
import "./styles/Popup.css";
import "./styles/Buttons.css";
import "./styles/Map.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
