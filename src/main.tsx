import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import "./App.css";

import { store } from "./store/store";
import { loadBuilder } from "./store/builderThunks";

// Dispatch loadBuilder to restore any saved configuration on startup
store.dispatch(loadBuilder() as any);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);