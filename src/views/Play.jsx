import "../css/views/Play.css";

import * as Chess from "chess.js";

import React, { useEffect, useRef, useState } from "react";
import useQuery, {
  getMode,
  getTimeString,
  getTiming,
} from "../hooks/queryParams";

import { Avatar } from "primereact/avatar";
import Board from "../components/Board";
import Clock from "../components/Clock";
import { Dialog } from "primereact/dialog";
import PlayPanel from "../components/PlayPanel";
import { Toast } from "primereact/toast";
import { confirmPopup } from "primereact/confirmpopup";
import { getUserData } from "../supabase/supabase.js";
import io from "socket.io-client";
import piecemove from "../assets/sounds/piecemove.mp3";
import { ratingCalculate } from "../helpers/ratingCalculator";
import useSound from "use-sound";
import { v4 as uuidv4 } from "uuid";
import CustomBoard from "../components/CustomBoard/CustomBoard";

let backup_data = false;

const socket = io("https://chess-cage.onrender.com/");

const Play = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const query = useQuery();

  const [game, set_game] = useState(new Chess());
  const [position, set_position] = useState("start");
  const [start, set_start] = useState(false);
  const [game_end, set_game_end] = useState(false);
  const [data, set_data] = useState(false);
  const [turn, set_turn] = useState(false);
  const [mode, set_mode] = useState(getMode(query));
  const [history, set_history] = useState([]);
  const [chat, set_chat] = useState([]);
  const [lobby_chat, set_lobby_chat] = useState([]);
  const [id, set_id] = useState([]);
  const [game_result, set_game_result] = useState(false);
  const [game_reason, set_game_reason] = useState(false);
  const [custom_time, set_custom_time] = useState(getTiming(query));
  const [white_time, set_white_time] = useState(getTiming(query));
  const [black_time, set_black_time] = useState(getTiming(query));
  const [custom_increment, set_custom_increment] = useState(0);
  const [takeback_offer, set_takeback_offer] = useState(false);
  const [draw_offer, set_draw_offer] = useState(false);
  const [active_move, set_active_move] = useState(0);
  const [preferred_color, set_preferred_color] = React.useState("Any");
  const [game_dialog, set_game_dialog] = React.useState(false);

  const [playPieceMove] = useSound(piecemove);
  const firstUpdate = useRef(true);
  const toast = useRef(true);

  useEffect(() => {
    document.title = "The Chessverse | New Game";
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (!game_end) {
      end_game();
    }
  }, [game_reason]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      socket.emit("username", {
        socketid: socket.id,
        username: "Anonymous",
      });
    });
    socket.on("startGame", (res) => {
      console.log("start game");
      set_data(res);
      backup_data = { ...res };
      console.log(res);
      set_start(true);
      set_turn(res.color === "w" ? true : false);
      set_game_end(false);
      const white_username =
        data.color === "w"
          ? user
            ? user.username
            : "Anonymous"
          : res.username
          ? res.username
          : "Anonymous";
      const black_username =
        data.color === "w"
          ? user
            ? user.username
            : "Anonymous"
          : res.username
          ? res.username
          : "Anonymous";
      game.header("White", white_username, "Black", black_username);
    });
    socket.on("new move", (res) => {
      set_custom_time(res.time);
      onOpponentMove(res.from, res.to);
    });
    socket.on("chat", (res) => {
      set_chat((c) => {
        return [
          ...c,
          {
            msg: res.msg,
            time: res.time,
            username: res.username,
          },
        ];
      });
    });
    socket.on("lobby chat", (res) => {
      console.log("ids: " + res.ids);
      if (!id.includes(res.id)) {
        console.log("lobby chat");
        set_lobby_chat((c) => {
          return [
            ...c,
            {
              id: res.id,
              msg: res.msg,
              time: res.time,
              username: res.username,
            },
          ];
        });
        set_id((c) => {
          return [...c, res.id];
        });
      }
    });
    socket.on("resign", () => {
      set_game_result(backup_data.color === "w" ? "1-0" : "0-1");
      set_game_reason("by resignation");
    });
    socket.on("takeback request", () => {
      console.log("takeback request", backup_data);

      confirmPopup({
        target: document.querySelector(".takeback-offer"),
        message: `${
          backup_data.username ? backup_data.username : "Anonymous"
        } requests a takeback?`,
        icon: "pi pi-undo",
        accept: () => undo(),
        reject: () => takeback_reject(),
      });
      set_takeback_offer(true);
      set_chat((c) => {
        return [
          ...c,
          {
            type: "system",
            msg:
              "Takeback requested by " +
              (backup_data.username ? backup_data.username : "Anonymous"),
          },
        ];
      });
    });
    socket.on("takeback accept", () => {
      safeGameMutate((game) => {
        game.undo();
        set_position(game.fen());
      });
      set_turn(!turn);
      set_turn(false);
      playPieceMove();
      set_chat((c) => {
        return [
          ...c,
          {
            type: "system",
            msg: "Takeback accepted",
          },
        ];
      });
    });
    socket.on("takeback reject", () => {
      set_chat((c) => {
        return [
          ...c,
          {
            type: "system",
            msg: "Takeback rejected",
          },
        ];
      });
      return takeback_rejected();
    });
    socket.on("draw request", () => {
      console.log("draw request", backup_data);

      confirmPopup({
        target: document.querySelector(".draw-offer"),
        message: `${
          backup_data.username ? backup_data.username : "Anonymous"
        } requests a draw?`,
        icon: "pi pi-undo",
        accept: () => draw_accept(),
        reject: () => draw_reject(),
      });
      set_draw_offer(true);
      set_chat((c) => {
        return [
          ...c,
          {
            type: "system",
            msg:
              "Draw requested by " +
              (backup_data.username ? backup_data.username : "Anonymous"),
          },
        ];
      });
    });
    socket.on("draw accept", () => {
      set_game_result("1/2-1/2");
      set_game_reason("by draw offer");
      set_chat((c) => {
        return [
          ...c,
          {
            type: "system",
            msg: "Draw offer accepted",
          },
        ];
      });
    });
    socket.on("draw reject", () => {
      set_chat((c) => {
        return [
          ...c,
          {
            type: "system",
            msg: "Draw offer rejected",
          },
        ];
      });
      return draw_rejected();
    });
  }, []);

  const timeOut = (color) => {
    set_game_result(
      color === game.turn()
        ? color === "w"
          ? "0-1"
          : "1-0"
        : color === "b"
        ? "1-0"
        : "0-1"
    );
    set_game_reason("by timeout");
  };

  const set_time = (new_time) => {
    if (new_time >= 25 * 60 && mode !== "Classical") {
      set_mode("Classical");
    } else if (new_time >= 480 && new_time < 25 * 60 && mode !== "Rapid") {
      console.log("Rapid");
      set_mode("Rapid");
    } else if (new_time > 180 && new_time < 480 && mode !== "Blitz") {
      set_mode("Blitz");
    } else if (new_time <= 180 && mode !== "Bullet") {
      set_mode("Bullet");
    }

    set_custom_time(new_time);
    set_white_time(new_time);
    set_black_time(new_time);
  };

  const set_new_mode = (mode) => {
    if (mode === "Bullet") {
      set_time(60);
    } else if (mode === "Blitz") {
      set_time(300);
    } else if (mode === "Rapid") {
      set_time(600);
    } else if (mode === "Classical") {
      set_time(60 * 25);
    }
    set_mode(mode);
  };

  const end_game = () => {
    set_game_end();
    set_game_dialog(true);
  };

  function safeGameMutate(modify) {
    set_game((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  const startGame = (mode) => {
    const color =
      preferred_color === "White"
        ? "w"
        : preferred_color === "Black"
        ? "b"
        : "a";
    console.log(socket.id);
    socket.emit("joinGame", {
      socketid: socket.id,
      mode: mode,
      color: color,
      time: custom_time,
      increment: custom_increment,
      uid: user ? user.uid : uuidv4(),
      username: user ? user.username : "Anonymous",
      rating: user ? user[mode] : 1000,
    });
  };

  const takeback_rejected = () => {
    set_chat((c) => {
      return [
        ...c,
        {
          type: "system",
          msg: "Your takeback request was rejected",
        },
      ];
    });
  };

  const takeback_reject = () => {
    set_takeback_offer(null);
    socket.emit("takeback reject", {
      socketid: backup_data.socketid,
    });
    set_chat((c) => {
      return [
        ...c,
        {
          type: "system",
          msg:
            "You rejected " +
            (backup_data.username ? backup_data.username : "Anonymous") +
            " takeback request",
        },
      ];
    });
  };

  const undo = () => {
    if (game.history().length > 2) {
      console.log(backup_data);
      socket.emit("takeback accept", {
        socketid: backup_data.socketid,
      });
      safeGameMutate((game) => {
        game.undo();
        set_position(game.fen());
      });
      set_history((h) => h.splice(-1));
      set_active_move((m) => m - 1);
      set_turn(!turn);
      set_turn(false);
      playPieceMove();
      set_chat((c) => {
        return [
          ...c,
          {
            type: "system",
            msg: "Takeback accepted",
          },
        ];
      });
    }
  };

  const draw_accept = () => {
    set_game_result("1/2-1/2");
    set_game_reason("by draw offer");
    socket.emit("draw accept", {
      socketid: backup_data.socketid,
    });
    set_chat((c) => {
      return [
        ...c,
        {
          type: "system",
          msg: "Draw offer accepted",
        },
      ];
    });
  };

  const draw_rejected = () => {
    set_chat((c) => {
      return [
        ...c,
        {
          type: "system",
          msg: "Your draw request was rejected",
        },
      ];
    });
  };

  const draw_reject = () => {
    set_draw_offer(null);
    socket.emit("draw reject", {
      socketid: backup_data.socketid,
    });
    set_chat((c) => {
      return [
        ...c,
        {
          type: "system",
          msg:
            "You rejected " +
            (backup_data.username ? backup_data.username : "Anonymous") +
            " draw request",
        },
      ];
    });
  };

  let onDrop = (sourceSquare, targetSquare) => {
    if (game.turn() === backup_data.color) {
      let move = null;
      safeGameMutate((game) => {
        move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });

        console.log(move);

        if (move === null) {
          console.log("move is null");
          set_position(position);
          return "snapback";
        } else {
          if (backup_data.color === "w") {
            set_white_time((t) => t + custom_increment);
          } else {
            set_black_time((t) => t + custom_increment);
          }

          console.log(game.fen());
          set_position(game.fen());
          set_history((h) => [...h, game.fen()]);
          console.log(active_move + 1);
          set_active_move((m) => m + 1);
          set_turn(!turn);
          playPieceMove();
          socket.emit("new move", {
            socketid: backup_data.socketid,
            from: sourceSquare,
            to: targetSquare,
            time: custom_time,
            promotion: "q",
          });
        }
      });

      if (takeback_offer) {
        takeback_reject();
      }
      if (draw_offer) {
        draw_reject();
      }

      if (game.game_over()) {
        if (game.in_checkmate()) {
          set_game_result(backup_data.color === "w" ? "1-0" : "0-1");
          set_game_reason("by checkmate");
        } else if (game.in_stalemate()) {
          set_game_result(backup_data.color === "w" ? "1/2-1/2" : "1/2-1/2");
          set_game_reason("by stalemate");
        } else if (game.in_threefold_repetition()) {
          set_game_result(backup_data.color === "w" ? "1/2-1/2" : "1/2-1/2");
          set_game_reason("by threefold");
        } else if (game.insufficient_material()) {
          set_game_result(backup_data.color === "w" ? "1/2-1/2" : "1/2-1/2");
          set_game_reason("by insufficient");
        }
      }
      return true;
    } else {
      set_position(position);
      return "snapback";
    }
  };

  let onOpponentMove = (sourceSquare, targetSquare) => {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });

      if (move === null) {
        return "snapback";
      }
    });

    if (backup_data.color === "b") {
      set_white_time((t) => t + custom_increment);
    } else {
      set_black_time((t) => t + custom_increment);
    }
    set_position(game.fen());
    set_history((h) => [...h, game.fen()]);
    console.log(active_move + 1);
    set_active_move((m) => m + 1);
    set_turn(!turn);
    playPieceMove();
    if (game.game_over()) {
      if (game.in_checkmate()) {
        set_game_result(backup_data.color === "w" ? "0-1" : "1-0");
        set_game_reason("by checkmate");
      } else if (game.in_stalemate()) {
        set_game_result(backup_data.color === "w" ? "1/2-1/2" : "1/2-1/2");
        set_game_reason("by stalemate");
      } else if (game.in_threefold_repetition()) {
        set_game_result(backup_data.color === "w" ? "1/2-1/2" : "1/2-1/2");
        set_game_reason("by threefold");
      } else if (game.insufficient_material()) {
        set_game_result(backup_data.color === "w" ? "1/2-1/2" : "1/2-1/2");
        set_game_reason("by insufficient");
      }
    }
    return true;
  };

  const send_message = (msg) => {
    const date = new Date();
    const time = `${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
    }`;
    console.log(time, date.getSeconds() < 10);
    socket.emit("chat", {
      socketid: backup_data.socketid,
      username: user ? user.username : "Anonymous",
      msg: msg,
      time: time,
    });
    set_chat((c) => {
      return [
        ...c,
        {
          msg: msg,
          time: time,
          username: "You",
        },
      ];
    });
  };

  const send_lobby_message = (msg) => {
    const date = new Date();
    const id = uuidv4();
    const time = `${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
    }`;
    socket.emit("lobby chat", {
      id: id,
      username: user ? user.username : "Anonymous",
      msg: msg,
      time: time,
    });
    set_lobby_chat((c) => {
      return [
        ...c,
        {
          id: id,
          msg: msg,
          time: time,
          username: "You",
        },
      ];
    });
    set_id((c) => {
      return [...c, id];
    });
  };

  const resign = () => {
    socket.emit("resign", {
      socketid: backup_data.socketid,
    });
    set_game_result(backup_data.color === "w" ? "0-1" : "1-0");
    set_game_reason("by resignation");
  };

  const takeback = () => {
    socket.emit("takeback request", {
      socketid: backup_data.socketid,
    });
    set_chat((c) => {
      return [
        ...c,
        {
          type: "system",
          msg: "You requested a takeback",
        },
      ];
    });
  };

  const draw = () => {
    socket.emit("draw request", {
      socketid: backup_data.socketid,
    });
    set_chat((c) => {
      return [
        ...c,
        {
          type: "system",
          msg: "You offered a draw",
        },
      ];
    });
  };

  const next_game = () => {
    // console.log("next game");
    // set_white_time(custom_time);
    // set_black_time(custom_time);
    // set_data(false);
    // set_start(false);
    // set_game_end(false);
    // set_position("start");
    // safeGameMutate((game) => {
    //   game.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    // });
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

  const share = () => {
    navigator.clipboard.writeText(game.pgn());
    toast.current.show({
      severity: "info",
      summary: "Copied to clipboard",
      detail: "PGN copied to clipboard",
    });
  };

  return (
    <div className="play-container">
      <Dialog
        header={
          (game_result === "1/2-1/2"
            ? "You drawed "
            : (backup_data.color === "w" && game_result === "1-0") ||
              (backup_data.color === "b" && game_result === "0-1")
            ? "You won "
            : "You lost ") + game_reason
        }
        visible={game_dialog}
        onHide={() => set_game_dialog(false)}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
      >
        <p>
          {game_result === "1/2-1/2"
            ? "You drawed!"
            : (backup_data.color === "w" && game_result === "1-0") ||
              (backup_data.color === "b" && game_result === "0-1")
            ? "You won!"
            : "You lost!"}
        </p>
      </Dialog>
      <Toast ref={toast} />
      <div className="play-panel-container">
        <PlayPanel
          start={start}
          game_end={game_end}
          startGame={startGame}
          set_time={set_time}
          time={custom_time}
          custom_increment={custom_increment}
          set_custom_increment={set_custom_increment}
          mode={mode}
          set_mode={set_new_mode}
          send_message={send_message}
          send_lobby_message={send_lobby_message}
          chat={chat}
          lobby_chat={lobby_chat}
          game={game}
          data={backup_data}
          resign={resign}
          takeback={takeback}
          next_game={next_game}
          draw_offer={draw}
          history={history}
          active_move={active_move}
          first_move={first_move}
          last_move={last_move}
          prev_move={prev_move}
          next_move={next_move}
          preferred_color={preferred_color}
          set_preferred_color={set_preferred_color}
          share={share}
        />
      </div>
      <div className="game">
        <div className="player opp">
          <p className="opp name">
            <Avatar icon="pi pi-user" shape="circle" />{" "}
            <span>
              {backup_data ? backup_data.username : "Anonymous"} (
              {backup_data
                ? !game_end
                  ? backup_data[mode.toLowerCase()]
                  : ratingCalculate(
                      backup_data.rating,
                      user[mode],
                      game_result === "1/2-1/2"
                        ? 0.5
                        : (game_result === "1-0" &&
                            backup_data.color === "w") ||
                          (game_result === "0-1" && backup_data.color === "b")
                        ? 0
                        : 1
                    )
                : "1000"}
              )
            </span>
          </p>
          <Clock
            color={backup_data ? (backup_data.color === "w" ? "b" : "w") : "b"}
            start={start && !game_end}
            game={game}
            time={
              backup_data
                ? backup_data.color === "b"
                  ? white_time
                  : black_time
                : custom_time
            }
            set_time={
              backup_data
                ? backup_data.color === "b"
                  ? set_white_time
                  : set_black_time
                : set_custom_time
            }
            onTimeout={timeOut}
          />
        </div>
        <div className="game-board-container">
          <CustomBoard
            color={backup_data ? backup_data.color : "w"}
            isInteractive={start && !game_end}
            game={game}
            onDrop={onDrop}
            position={game.fen()}
          />
        </div>

        <div className="player you">
          <p className="you name">
            <Avatar icon="pi pi-user" shape="circle" /> <span>You</span>{" "}
            <span>
              {user
                ? !game_end
                  ? `(${user[mode.toLowerCase()]})`
                  : `(${ratingCalculate(
                      user[mode],
                      backup_data.rating,
                      game_result === "1/2-1/2"
                        ? 0.5
                        : (game_result === "1-0" &&
                            backup_data.color === "w") ||
                          (game_result === "0-1" && backup_data.color === "b")
                        ? 1
                        : 0
                    )})`
                : "(1000)"}
            </span>
          </p>
          <Clock
            color={backup_data ? backup_data.color : "w"}
            start={start && !game_end}
            game={game}
            time={
              backup_data
                ? backup_data.color === "w"
                  ? white_time
                  : black_time
                : custom_time
            }
            set_time={
              backup_data
                ? backup_data.color === "w"
                  ? set_white_time
                  : set_black_time
                : set_custom_time
            }
            onTimeout={timeOut}
          />
        </div>
      </div>
    </div>
  );
};

export default Play;
