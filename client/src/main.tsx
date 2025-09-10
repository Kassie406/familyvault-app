import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/quick-access.css";
import "./styles/header-overrides.css";
import "./styles/header.css";
import "./styles/settings-override.css";

// Development fetch instrumentation to debug API calls
if (import.meta.env.DEV) {
  const _fetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === "string" ? input : (input as Request).url;
    console.info("[fetch]", init?.method ?? "GET", url, init);
    try {
      const res = await _fetch(input, init);
      console.info("[fetch][done]", res.status, url);
      return res;
    } catch (err) {
      console.error("[fetch][error]", url, err);
      throw err;
    }
  };
}

createRoot(document.getElementById("root")!).render(<App />);
