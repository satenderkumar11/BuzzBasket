// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.js";
import "./index.css";
import mainStore from "./store/store.js";

const root = createRoot(document.getElementById("root"));

root.render(
  
    <Provider store={mainStore}>
      <App />
    </Provider>
  
);
