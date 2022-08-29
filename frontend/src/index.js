import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style/index.scss";
import { PublicationContextProvider } from "./context/PublicationsContext";
import { UserContextProvider } from "./context/UserContext";
/**/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <PublicationContextProvider>
        <App />
      </PublicationContextProvider>
    </UserContextProvider>

  </React.StrictMode>
);
