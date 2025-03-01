import "../css/views/AI.css";

import * as Chess from "chess.js";

import React, { useEffect, useRef, useState } from "react";
import { TabPanel, TabView } from "primereact/tabview";

import AISelector from "../components/PlayPanel/AISelector";
import AI_LEVEL_ONE from "../ai/200.js";
import AI_LEVEL_THREE from "../ai/600.js";
import AI_LEVEL_TEN from "../ai/2000.js";
import AI_LEVEL_TWO from "../ai/400.js";
import CustomBoard from "../components/CustomBoard/CustomBoard";
import { Toast } from "primereact/toast";
import piecemove from "../assets/sounds/piecemove.mp3";
import useSound from "use-sound";

const AI = () => {
  const [active_index, set_active_index] = useState(0);
  const [preferred_color, set_preferred_color] = useState("any");
  const [game, set_game] = useState(new Chess());
  const [start, set_start] = useState(false);
  const [game_end, set_game_end] = useState(false);
  const [position, set_position] = useState("start");
  const [turn, set_turn] = useState("w");
  const [history, set_history] = useState([]);
  const [ai_data, set_ai_data] = useState({});
  const [color, set_color] = useState("w");
  const [active_move, set_active_move] = useState(0);
  const [ai, set_ai] = useState(null);

  const toast = useRef();

  const [game_result, set_game_result] = useState(false);
  const [game_reason, set_game_reason] = useState(false);

  const [playPieceMove] = useSound(piecemove);

  function safeGameMutate(modify) {
    set_game((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  useEffect(() => {
    if (color === "b") {
      ai_move();
    }
  }, [ai]);

  useEffect(() => {}, [turn]);

  let onDrop = (sourceSquare, targetSquare) => {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        console.log("move is null");
        return "snapback";
      } else {
        // if (color === "w") {
        //   set_white_time((t) => t + custom_increment);
        // } else {
        //   set_black_time((t) => t + custom_increment);
        // }
        console.log(game.fen());
        set_position(game.fen());
        set_history((h) => [...h, game.fen()]);
        set_active_move((m) => m + 1);
        set_turn(!turn);
        playPieceMove();
      }
    });

    if (game.game_over()) {
      if (game.in_checkmate()) {
        set_game_result(color === "w" ? "1-0" : "0-1");
        set_game_reason("by checkmate");
      } else if (game.in_stalemate()) {
        set_game_result(color === "w" ? "1/2-1/2" : "1/2-1/2");
        set_game_reason("by stalemate");
      } else if (game.in_threefold_repetition()) {
        set_game_result(color === "w" ? "1/2-1/2" : "1/2-1/2");
        set_game_reason("by threefold");
      } else if (game.insufficient_material()) {
        set_game_result(color === "w" ? "1/2-1/2" : "1/2-1/2");
        set_game_reason("by insufficient");
      }
    } else {
      setTimeout(ai_move, 500);
    }

    return true;
  };

  const ai_move = () => {
    const ai_move = ai.makeMove();
    console.log(ai_move);

    safeGameMutate((game) => {
      const move = game.move(ai_move);

      if (move === null) {
        console.log("move is null");
        return "snapback";
      } else {
        // if (color === "w") {
        //   set_white_time((t) => t + custom_increment);
        // } else {
        //   set_black_time((t) => t + custom_increment);
        // }

        console.log(game.fen());
        set_position(game.fen());
        set_history((h) => [...h, game.fen()]);
        set_active_move((m) => m + 1);
        playPieceMove();
        set_turn(!turn);
      }
    });
  };

  const first_move = () => {
    console.log(1);
    set_active_move(1);
    set_position(history[0]);
    playPieceMove();
  };

  const last_move = () => {
    console.log(history.length - 1);
    set_active_move(history.length);
    set_position(history[history.length - 1]);
    playPieceMove();
  };

  const prev_move = () => {
    console.log(active_move - 1);
    set_position(history[active_move - 2]);
    set_active_move((m) => m - 1);
    playPieceMove();
  };

  const next_move = () => {
    console.log(active_move - 1);
    set_position(history[active_move]);
    set_active_move((m) => m + 1);
    playPieceMove();
  };

  const start_game = (ai_number) => {
    let new_color = "w";
    if (preferred_color === "w") {
      set_color("w");
      new_color = "w";
    } else if (preferred_color === "b") {
      set_color("b");
      new_color = "b";
    } else {
      const randomIdx = Math.round(Math.random());
      set_color(randomIdx === 0 ? "w" : "b");
      new_color = "w";
    }
    set_start(true);

    if (ai_number === 1) {
      console.log("level one");
      set_ai_data({
        name: "Banana",
        rating: 200,
      });
      set_ai(new AI_LEVEL_ONE(game, new_color));
    } else if (ai_number === 2) {
      console.log("level two");
      set_ai_data({
        name: "Apple",
        rating: 250,
      });
      set_ai(new AI_LEVEL_TWO(game, new_color));
    } else if (ai_number === 3) {
      console.log("level three");
      set_ai_data({
        name: "Cantaloupe",
        rating: 600,
      });
      set_ai(new AI_LEVEL_THREE(game, new_color));
    }
  };

  const resign = () => {
    set_game_end(true);
    set_game_result(color === "w" ? "0-1" : "1-0");
    set_game_reason("by resignation");
  };

  return (
    <div className="ai-container">
      <div className="game">
        <div className="game-board-container">
          <CustomBoard
            color={color}
            isInteractive={start && !game_end}
            game={game}
            onDrop={onDrop}
            position={game.fen()}
          />
        </div>
        <TabView
          className="ai-box"
          active_index={active_index}
          onTabChange={(e) => set_active_index(e.index)}
        >
          <TabPanel header="AI">
            <AISelector
              preferred_color={preferred_color}
              set_preferred_color={set_preferred_color}
              start_game={start_game}
              active_move={active_move}
              game_end={game_end}
              first_move={first_move}
              last_move={last_move}
              prev_move={prev_move}
              next_move={next_move}
              toast={toast}
              start={start}
              history={history}
              game={game}
            />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default AI;
