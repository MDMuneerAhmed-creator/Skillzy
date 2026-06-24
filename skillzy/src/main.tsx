import { createRoot } from "react-dom/client";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Configure custom fetcher to use token from localStorage
setAuthTokenGetter(() => {
  return localStorage.getItem("skillzy_token");
});

createRoot(document.getElementById("root")!).render(<App />);
