import { isCheckmate } from "./helperFunctions";
import { board_squares } from "../helpers/lightOrDark";

class AI_LEVEL_TWO {
  constructor(game, color) {
    this.game = game;
    this.color = color;
    this.best_move = "";
    this.move_rating = -9999;
  }

  knight_board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0.5, 1, 0, 0, 1, 0.5, 0],
    [0, 0, 0, 0.4, 0.4, 0, 0, 0],
    [0, -0.5, 0, 0, 0, 0, -0.5, 0],
  ];

  bishop_board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0.5, 0.5, 0.5, 0.5, 0, 0],
    [0, 1, 0, 0.5, 0.5, 0, 1, 0],
    [0, 0, -1, 0, 0, -1, 0, 0],
  ];

  rook_board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0.5, 0.5, 0, 0, 0],
    [-1, 0, 0, 0.5, 1, 0.5, 0, -1],
  ];

  getPieceBoardPoints = (type, color, i, j) => {
    if (type === "n" && color === "b") {
      return this.knight_board.reverse()[i][j];
    } else if (type === "b" && color === "b") {
      return this.bishop_board.reverse()[i][j];
    } else if (type === "r" && color === "b") {
      return this.rook_board.reverse()[i][j];
    } else if (type === "n") {
      return this.knight_board[i][j];
    } else if (type === "b") {
      return this.bishop_board[i][j];
    } else if (type === "r") {
      return this.rook_board[i][j];
    }
  };

  calcMaterial() {
    let calc = 0;

    board_squares.forEach((row, i) => {
      row.forEach((square, j) => {
        const piece = this.game.get(square);
        if (piece) {
          if (piece.color === "b") {
            if (piece.type === "p") {
              calc -= 1;
            } else if (piece.type === "n") {
              calc -= 2.5;
            } else if (piece.type === "b") {
              calc -= 3;
            } else if (piece.type === "r") {
              calc -= 5;
            } else if (piece.type === "q") {
              calc -= 9;
            }
          }
          if (piece.color === "w") {
            if (piece.type === "p") {
              calc += 1;
            } else if (piece.type === "n") {
              calc += 2.5;
            } else if (piece.type === "b") {
              calc += 3;
            } else if (piece.type === "r") {
              calc += 5;
            } else if (piece.type === "q") {
              calc += 9;
            }
          }

          calc += this.getPieceBoardPoints(piece.type, piece.color, i, j);
        }
      });
    });

    if (this.color === "b") {
      calc *= -1;
    }

    return calc;
  }

  minimaxRoot = function (depth, game, isMaximisingPlayer) {
    var newGameMoves = game.moves();
    var bestMove = -9999;
    var bestMoveFound;

    newGameMoves.forEach((move) => {
      game.move(move);
      var value = this.minimax(depth - 1, game, !isMaximisingPlayer);
      game.undo();
      if (value >= bestMove) {
        bestMove = value;
        bestMoveFound = move;
      }
    });
    return bestMoveFound;
  };

  minimax = function (depth, game, isMaximisingPlayer) {
    if (depth === 0) {
      return -this.calcMaterial(game.board());
    }

    var newGameMoves = game.moves();

    if (isMaximisingPlayer) {
      var bestMove = -9999;
      newGameMoves.forEach((move) => {
        game.move(move);
        bestMove = Math.max(
          bestMove,
          this.minimax(depth - 1, game, !isMaximisingPlayer)
        );
        game.undo();
      });
      return bestMove;
    } else {
      var bestMove = 9999;
      newGameMoves.forEach((move) => {
        game.move(move);
        bestMove = Math.min(
          bestMove,
          this.minimax(depth - 1, game, !isMaximisingPlayer)
        );
        game.undo();
      });
      return bestMove;
    }
  };

  makeMove = () => {
    if (this.game.turn() === this.color) {
      console.log("make move");
      return this.minimaxRoot(3, this.game, true);
    }
  };
}

export default AI_LEVEL_TWO;
