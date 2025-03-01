import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  TheBishop,
  TheKing,
  TheKnight,
  ThePawn,
  TheQueen,
  TheRook,
} from "./views/lessons/exportLessons";

import AI from "./views/AI";
import BoardEditor from "./views/BoardEditor";
import Dashboard from "./views/Dashboard";
import Home from "./views/Home";
import Lessons from "./views/Lessons";
import LogIn from "./views/LogIn";
import Material from "./views/lessons/Material";
import MutualAgreement from "./views/lessons/MutualAgreement";
import NavBar from "./components/NavBar";
import NotFound from "./views/NotFound.jsx";
import Play from "./views/Play";
import Promotion from "./views/lessons/Promotion";
import PuzzleTrainer from "./views/PuzzleTrainer.jsx";
import React from "react";
import SignUp from "./views/SignUp";
import Stalemate from "./views/lessons/Stalemate";
import ThePawnDrills from "./views/drills/Drills";
import Verify from "./views/Verify";
import BoardPage from "./components/CustomBoard/BoardPage";

function App() {
  return (
    <BrowserRouter basename="/chess-cage">
      <Routes>
        <Route element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="verify" element={<Verify />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<LogIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="play">
            <Route index element={<Play />} />
            <Route path="ai" element={<AI />} />
          </Route>
          <Route path="puzzles">
            <Route path="trainer" element={<PuzzleTrainer />} />
          </Route>
          <Route path="lessons">
            <Route index element={<Lessons />} />
            <Route path="the-pawn" element={<ThePawn />} />
            <Route path="the-knight" element={<TheKnight />} />
            <Route path="the-bishop" element={<TheBishop />} />
            <Route path="the-rook" element={<TheRook />} />
            <Route path="the-queen" element={<TheQueen />} />
            <Route path="stalemate" element={<Stalemate />} />
            <Route path="material" element={<Material />} />
            <Route path="promotion" element={<Promotion />} />
            <Route path="mutual-agreement" element={<MutualAgreement />} />
            <Route path="the-king" element={<TheKing />} />
          </Route>
          <Route path="drills">
            <Route path="the-pawn" element={<ThePawnDrills />} />
          </Route>
          <Route path="tools">
            <Route path="editor" element={<BoardEditor />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
