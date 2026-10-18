import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n/index.js";
import App from "./App.jsx";
import "./index.css";
import { synchronizeLocation } from "./routing/navigation.js";

const currentRoute = synchronizeLocation();
const root = document.getElementById("root");
const prerenderState = document.getElementById("muuva-prerender");
const initialRoute = prerenderState ? JSON.parse(prerenderState.textContent) : currentRoute;

const application = (
  <React.StrictMode>
    <App initialRoute={initialRoute} />
  </React.StrictMode>
);

if (prerenderState && root.hasChildNodes()) ReactDOM.hydrateRoot(root, application);
else ReactDOM.createRoot(root).render(application);
