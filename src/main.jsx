import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";

import "./index.css";
import App from "./App.jsx";
import { appStore } from "./app/store.js";
import { Toaster } from "./components/ui/sonner";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      {/* 🌙 THEME PROVIDER */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <App />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);

// ✅ Service Worker Register
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("SW registered"))
      .catch((err) => console.log("SW failed:", err));
  });
}
