import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const Index = () => (
    <BrowserRouter>
      <App />
    </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Index />);
