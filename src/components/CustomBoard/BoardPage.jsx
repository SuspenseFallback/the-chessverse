import React, { useState } from "react";
import * as Chess from "chess.js";
import CustomBoard from "./CustomBoard";
import "./CustomBoard.css";

const BoardPage = () => {
  const [game, set_game] = useState(new Chess());

  function safeGameMutate(modify) {
    set_game((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  let onDrop = (sourceSquare, targetSquare) => {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    });

    if (move === null) {
      console.log("move is null");
      return "snapback";
    }
  };

  return (
    <div className="page">
      <CustomBoard game={game} onDrop={onDrop} />
    </div>
  );
};

export default BoardPage;
