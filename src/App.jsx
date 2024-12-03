import { useState } from "react";
import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Kurdistan from "./pages/Kurdistan";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Kurdistan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
