import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/quick-access.css";
import "./styles/header-overrides.css";

createRoot(document.getElementById("root")!).render(<App />);
