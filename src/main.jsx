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
