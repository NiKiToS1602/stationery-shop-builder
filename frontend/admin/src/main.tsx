import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";

import { getToken } from "./shared/auth/tokenStorage";
import { setAccessToken, logout } from "./features/auth/authSlice";

// Восстановление токена ДО render
const token = getToken();
if (token) {
  store.dispatch(setAccessToken(token));
} else {
  store.dispatch(logout());
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
