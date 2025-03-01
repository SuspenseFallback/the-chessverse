import { isCheckmate } from "./helperFunctions";

class AI_LEVEL_TEN {
  constructor(game, color) {
    this.game = game;
    this.color = color;
    this.best_move = "";
    this.move_rating = -9999;
  }

  calcMaterial() {
    const fen = this.game.fen();
    let calc = 0;

    fen
      .split(" ")[0]
      .split("")
      .forEach((piece) => {
        if (piece === "P") {
          calc += 1;
        } else if (piece === "N") {
          calc += 2.5;
        } else if (piece === "B") {
          calc += 3;
        } else if (piece === "R") {
          calc += 5;
        } else if (piece === "Q") {
          calc += 9;
        } else if (piece === "p") {
          calc -= 1;
        } else if (piece === "n") {
          calc -= 2.5;
        } else if (piece === "b") {
          calc -= 3;
        } else if (piece === "r") {
          calc -= 5;
        } else if (piece === "q") {
          calc -= 9;
        }
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
    console.log("make move");
    return this.minimaxRoot(3, this.game, true);
  };
}

export default AI_LEVEL_TEN;
