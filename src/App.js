import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ApiPage from "./apiPage.js";
import Home from "./Home.js";
import TicTacToe from "./TicTacToe.js";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/tictactoe">Tic-Tac-Toe</Link>
            </li>
            <li>
              <Link to="/api">API Page</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/api" element={<ApiPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
