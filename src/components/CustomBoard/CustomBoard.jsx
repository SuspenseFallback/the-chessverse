import React, { useEffect, useState, useRef } from "react";
import Square from "./Square.jsx";

import { squares } from "../../helpers/lightOrDark.js";

import wpawn from "../../assets/images/pieces/wpawn.png";
import wknight from "../../assets/images/pieces/wknight.png";
import wbishop from "../../assets/images/pieces/wbishop.png";
import wrook from "../../assets/images/pieces/wrook.png";
import wqueen from "../../assets/images/pieces/wqueen.png";
import wking from "../../assets/images/pieces/wking.png";

import bpawn from "../../assets/images/pieces/bpawn.png";
import bknight from "../../assets/images/pieces/bknight.png";
import bbishop from "../../assets/images/pieces/bbishop.png";
import brook from "../../assets/images/pieces/brook.png";
import bqueen from "../../assets/images/pieces/bqueen.png";
import bking from "../../assets/images/pieces/bking.png";

const CustomBoard = ({
  game,
  position,
  onDrop,
  color,
  bothSides = false,
  isInteractive = true,
}) => {
  const [board, set_board] = useState([
    [
      { square: "a8", piece: brook },
      { square: "b8", piece: bknight },
      { square: "c8", piece: bbishop },
      { square: "d8", piece: bqueen },
      { square: "e8", piece: bking },
      { square: "f8", piece: bbishop },
      { square: "g8", piece: bknight },
      { square: "h8", piece: brook },
    ],
    [
      { square: "a7", piece: bpawn },
      { square: "b7", piece: bpawn },
      { square: "c7", piece: bpawn },
      { square: "d7", piece: bpawn },
      { square: "e7", piece: bpawn },
      { square: "f7", piece: bpawn },
      { square: "g7", piece: bpawn },
      { square: "h7", piece: bpawn },
    ],
    [
      { square: "a6", piece: null },
      { square: "b6", piece: null },
      { square: "c6", piece: null },
      { square: "d6", piece: null },
      { square: "e6", piece: null },
      { square: "f6", piece: null },
      { square: "g6", piece: null },
      { square: "h6", piece: null },
    ],
    [
      { square: "a5", piece: null },
      { square: "b5", piece: null },
      { square: "c5", piece: null },
      { square: "d5", piece: null },
      { square: "e5", piece: null },
      { square: "f5", piece: null },
      { square: "g5", piece: null },
      { square: "h5", piece: null },
    ],
    [
      { square: "a4", piece: null },
      { square: "b4", piece: null },
      { square: "c4", piece: null },
      { square: "d4", piece: null },
      { square: "e4", piece: null },
      { square: "f4", piece: null },
      { square: "g4", piece: null },
      { square: "h4", piece: null },
    ],
    [
      { square: "a3", piece: null },
      { square: "b3", piece: null },
      { square: "c3", piece: null },
      { square: "d3", piece: null },
      { square: "e3", piece: null },
      { square: "f3", piece: null },
      { square: "g3", piece: null },
      { square: "h3", piece: null },
    ],
    [
      { square: "a2", piece: wpawn },
      { square: "b2", piece: wpawn },
      { square: "c2", piece: wpawn },
      { square: "d2", piece: wpawn },
      { square: "e2", piece: wpawn },
      { square: "f2", piece: wpawn },
      { square: "g2", piece: wpawn },
      { square: "h2", piece: wpawn },
    ],
    [
      { square: "a1", piece: wrook },
      { square: "b1", piece: wknight },
      { square: "c1", piece: wbishop },
      { square: "d1", piece: wqueen },
      { square: "e1", piece: wking },
      { square: "f1", piece: wbishop },
      { square: "g1", piece: wknight },
      { square: "h1", piece: wrook },
    ],
  ]);
  const [selectedSquare, setSelectedSquare] = useState("");
  const [moves, setMoves] = useState([]);
  const [activePiece, setActivePiece] = useState(null);
  const chessboard = useRef(null);

  const updateBoard = () => {
    let boardCopy = [...board];

    game.board().forEach((row, i) => {
      row.forEach((square, j) => {
        if (!square) {
          boardCopy[i][j].piece = null;
        } else if (square.type === "r" && square.color === "w") {
          boardCopy[i][j].piece = wrook;
        } else if (square.type === "b" && square.color === "w") {
          boardCopy[i][j].piece = wbishop;
        } else if (square.type === "k" && square.color === "w") {
          boardCopy[i][j].piece = wking;
        } else if (square.type === "n" && square.color === "w") {
          boardCopy[i][j].piece = wknight;
        } else if (square.type === "q" && square.color === "w") {
          boardCopy[i][j].piece = wqueen;
        } else if (square.type === "p" && square.color === "w") {
          boardCopy[i][j].piece = wpawn;
        } else if (square.type === "r" && square.color === "b") {
          boardCopy[i][j].piece = brook;
        } else if (square.type === "b" && square.color === "b") {
          boardCopy[i][j].piece = bbishop;
        } else if (square.type === "k" && square.color === "b") {
          boardCopy[i][j].piece = bking;
        } else if (square.type === "n" && square.color === "b") {
          boardCopy[i][j].piece = bknight;
        } else if (square.type === "q" && square.color === "b") {
          boardCopy[i][j].piece = bqueen;
        } else if (square.type === "p" && square.color === "b") {
          boardCopy[i][j].piece = bpawn;
        }
      });
    });
    set_board(boardCopy);
  };

  useEffect(() => {
    updateBoard();
  }, [position]);

  useEffect(() => {
    if (isInteractive && color === game.turn()) {
      setPossibleMoves();
    }
  }, [moves]);

  const setPossibleMoves = () => {
    if (moves !== []) {
      moves.forEach((move) => {
        console.log(move);
        document
          .querySelector(`[data-square=${move.to}]`)
          .classList.add("possible");
      });
    }
  };

  const setSquare = (square) => {
    document.querySelectorAll(".possible").forEach((square) => {
      square.classList.remove("possible");
    });
    if (!selectedSquare) {
      document
        .querySelector(`[data-square="${square}"]`)
        .classList.add("active");
      setSelectedSquare(square);
      if (game.get(square)) {
        console.log("is piece");
        game.moves({ square: square, verbose: true }).forEach((move) => {
          setMoves((m) => [...m, { from: move.from, to: move.to }]);
        });
      }
    } else if (selectedSquare) {
      if (moves && isInteractive) {
        console.log(selectedSquare, square);
        moves.forEach((move) => {
          if (
            !bothSides &&
            game.turn() === color &&
            move.from === selectedSquare &&
            move.to === square
          ) {
            console.log("move");
            return onDrop(move.from, move.to);
          }
        });
        document
          .querySelector(`[data-square="${selectedSquare}"]`)
          .classList.remove("active");
        setSelectedSquare(null);
        setMoves([]);
      } else {
        document
          .querySelector(`[data-square="${square}"]`)
          .classList.add("active");
        document
          .querySelector(`[data-square="${selectedSquare}"]`)
          .classList.remove("active");
        setSelectedSquare(square);
        if (game.get(square)) {
          setMoves(game.moves({ square: square }));
        }
      }
    }
    updateBoard();
  };

  const clearSquares = () => {
    squares.forEach((square) => {
      document
        .querySelector(`.square[data-square=${square}]`)
        .classList.remove("highlighted");
    });
  };

  const onBoardClick = () => {
    clearSquares();
  };

  const clearActive = () => {
    squares.forEach((square) => {
      document
        .querySelector(`.square[data-square=${square}]`)
        .classList.remove("active");
    });
  };

  function dropHandler(square) {
    const move = onDrop(activePiece.getAttribute("data-square"), square);
    return move;
  }

  return (
    <div
      className={"custom-board " + (color === "b" ? "black" : "white")}
      onClick={onBoardClick}
      onContextMenu={clearActive}
      ref={chessboard}
    >
      {board.map((row) => {
        return (
          <div className="row">
            {row.map((square) => {
              return (
                <Square
                  key={square.square}
                  square={square.square}
                  piece={square.piece}
                  setSelectedSquare={setSquare}
                  color={color}
                  activePiece={activePiece}
                  setActivePiece={setActivePiece}
                  chessboard={chessboard.current}
                  onDrop={dropHandler}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CustomBoard;
