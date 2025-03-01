import React, { useEffect, useState } from "react";
import { TabPanel, TabView } from "primereact/tabview";
import {
  convertSecondsToMinutesAndSeconds,
  convertTimeToString,
} from "../helpers/convertTimeToString";

import AISelector from "./PlayPanel/AISelector";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Slider } from "primereact/slider";
import { UseAuth } from "../firebase/firebase";
import { confirmPopup } from "primereact/confirmpopup";
import useQuery from "../hooks/queryParams";
import resignIcon from "../assets/images/resign.svg";
import takebackIcon from "../assets/images/takeback.svg";
import drawIcon from "../assets/images/draw.svg";
import chatIcon from "../assets/images/chat.svg";
import blockIcon from "../assets/images/block.svg";
import reportIcon from "../assets/images/report.svg";
import shareIcon from "../assets/images/share.svg";
import playIcon from "../assets/images/play.svg";

const PlayPanel = ({
  startGame,
  start,
  game_end,
  set_time,
  time,
  custom_increment,
  set_custom_increment,
  mode,
  set_mode,
  send_message,
  send_lobby_message,
  chat,
  lobby_chat,
  game,
  data,
  resign,
  takeback,
  next_game,
  draw_offer,
  active_move,
  first_move,
  last_move,
  prev_move,
  next_move,
  preferred_color,
  set_preferred_color,
  share,
}) => {
  const user = UseAuth();
  const query = useQuery();
  const [draw_offer_count, set_draw_offer_count] = useState(0);
  const [active, set_active] = useState(0);
  const [lobby, set_lobby] = useState("lobby");
  const [msg, set_msg] = useState("");
  const modes = [
    { label: "Bullet", value: "Bullet" },
    { label: "Blitz", value: "Blitz" },
    { label: "Rapid", value: "Rapid" },
    { label: "Classical", value: "Classical" },
  ];

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        last_move();
      } else if (e.key === "ArrowLeft") {
        next_move();
      } else if (e.key === "ArrowRight") {
        prev_move();
      } else if (e.key === "ArrowUp") {
        first_move();
      }
    });
  }, []);

  const onChat = (e) => {
    set_msg(e.target.value);
    console.log(e.target.value);
  };

  const resignConfirm = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to resign?",
      icon: "pi pi-exclamation-triangle",
      accept: () => resign(),
      reject: () => {
        return false;
      },
    });
  };

  const takebackConfirm = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to request a takeback?",
      icon: "pi pi-exclamation-triangle",
      accept: () => takeback(),
      reject: () => {
        return false;
      },
    });
  };

  const drawConfirm = (event) => {
    set_draw_offer_count((c) => c + 1);
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to request a draw?",
      icon: "pi pi-exclamation-triangle",
      accept: () => draw_offer(),
      reject: () => {
        return false;
      },
    });
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (lobby === "game") {
        send_message(msg);
      } else {
        send_lobby_message(msg);
      }
      set_msg("");
    } else {
      set_msg(e.target.value);
    }
  };

  return (
    <TabView
      activeIndex={active}
      onTabChange={(e) => set_active(e.index)}
      className="play-box"
    >
      <TabPanel header="NEW GAME" className="new-game-box">
        {start ? (
          <div className="game-box-content">
            <div className="history flex justify-content-between flex-row">
              <div className="white">
                {game.history().map((item, index) => {
                  if (index % 2 === 0) {
                    return (
                      <p
                        className={index === active_move - 1 ? "active" : ""}
                        key={index}
                      >
                        {item}
                      </p>
                    );
                  }
                })}
              </div>
              <div className="top-seperator"></div>
              <div className="black">
                {game.history().map((item, index) => {
                  if (index % 2) {
                    return (
                      <p
                        className={index === active_move - 1 ? "active" : ""}
                        key={index}
                      >
                        {item}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
            <div className="arrows flex align-items-center justify-content-center">
              <Button
                className="p-button-text p-button-secondary"
                icon="pi pi-angle-double-left"
                disabled={game.history().length === 0 || active_move === 1}
                onClick={first_move}
              />
              <Button
                className="p-button-text p-button-secondary"
                icon="pi pi-angle-left"
                disabled={game.history().length === 0 || active_move === 1}
                onClick={prev_move}
              />
              <Button
                className="p-button-text p-button-secondary"
                icon="pi pi-angle-right"
                disabled={
                  game.history().length === 0 ||
                  game.history().length === active_move
                }
                onClick={next_move}
              />
              <Button
                className="p-button-text p-button-secondary"
                icon="pi pi-angle-double-right"
                disabled={
                  game.history().length === 0 ||
                  game.history().length === active_move
                }
                onClick={last_move}
              />
            </div>
            <div className="options flex flex-wrap">
              <div
                className="players flex justify-content-between"
                style={{ width: "100%" }}
              >
                <div className="you">
                  <p>{user ? user.username : "Anonymous"}</p>
                  <span>{user ? user[mode.toLowerCase()] : "1000"}</span>
                </div>
                <p>vs</p>
                <div className="opp">
                  <p>{data.username ? data.username : "Anonymous"}</p>
                  <span>{data ? data.rating : "1000"}</span>
                </div>
              </div>
              <div className="controls">
                <div
                  className="flex flex-wrap justify-content-between"
                  style={{ width: "100%" }}
                >
                  <button
                    className="small-button"
                    tooltip="Resign"
                    onClick={resignConfirm}
                    disabled={game_end || game.history().length <= 2}
                  >
                    <img src={resignIcon} className="icon" alt="Resign" />
                  </button>
                  <button
                    className="small-button takeback-offer"
                    tooltip="Takeback offer"
                    disabled={game_end || game.history().length <= 2}
                    onClick={takebackConfirm}
                  >
                    <img src={takebackIcon} className="icon" alt="Takeback" />
                  </button>
                  <button
                    className="small-button draw-offer"
                    onClick={drawConfirm}
                    tooltip="Draw offer"
                    disabled={
                      game_end ||
                      draw_offer_count >= 3 /* || game.history().length <= 20 */
                    }
                  >
                    <img src={drawIcon} className="icon" alt="Draw" />
                  </button>
                  <button
                    className="small-button"
                    tooltip="Chat"
                    onClick={() => {
                      set_active(1);
                      set_lobby("game");
                    }}
                  >
                    <img src={chatIcon} className="icon" alt="Chat" />
                  </button>
                </div>
                <div
                  className="line"
                  style={{ width: "100%", marginTop: "5%" }}
                >
                  <button
                    className="small-button"
                    tooltip="Block"
                    disabled={!user}
                  >
                    <img src={blockIcon} className="icon" alt="Block" />
                  </button>
                  <button
                    className="small-button"
                    tooltip="Report"
                    disabled={!user}
                  >
                    <img src={reportIcon} className="icon" alt="Report" />
                  </button>
                  <button
                    className="small-button"
                    tooltip="Share"
                    onClick={share}
                  >
                    <img src={shareIcon} className="icon" alt="Share" />
                  </button>
                  <button
                    className="small-button"
                    tooltip="Friend"
                    disabled={!user}
                  >
                    <img src={playIcon} className="icon" alt="Friend" />
                  </button>
                </div>

                <button
                  className="btn-block"
                  disabled={!game_end}
                  onClick={next_game}
                  style={{ marginTop: "vh" }}
                >
                  Next game
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="new-game-box">
            <p className="subtitle">
              Mode: <span>{mode}</span>
            </p>
            {/* Mode select */}
            <Dropdown
              value={mode}
              options={modes}
              onChange={(e) => set_mode(e.value)}
              placeholder={query.get("time")}
              style={{
                width: "90%",
              }}
            />
            <p className="title">OR</p>
            <p className="subtitle">
              Time: <span>{convertTimeToString(time)}</span>
            </p>
            <Slider
              value={time}
              onChange={(e) => {
                set_time(e.value);
              }}
              min={60}
              max={3600}
              step={5}
            />
            <p
              className="subtitle"
              style={{
                marginTop: "5%",
              }}
            >
              Increment: <span>{custom_increment}s</span>
            </p>
            <Slider
              value={custom_increment}
              onChange={(e) => set_custom_increment(e.value)}
              min={0}
              max={180}
            />
            <p
              className="subtitle"
              style={{
                marginTop: "5%",
              }}
            >
              Color:{" "}
            </p>
            <ul className="select">
              <li>
                <div
                  onClick={() => set_preferred_color("w")}
                  className={
                    "circle white" + (preferred_color === "w" ? " active" : "")
                  }
                ></div>
              </li>
              <li>
                <div
                  onClick={() => set_preferred_color("b")}
                  className={
                    "circle black" + (preferred_color === "b" ? " active" : "")
                  }
                ></div>
              </li>
              <li>
                <div
                  onClick={() => set_preferred_color("any")}
                  className={
                    "circle any" + (preferred_color === "any" ? " active" : "")
                  }
                ></div>
              </li>
            </ul>
            <button
              className="btn-block"
              onClick={() => startGame(mode.toLowerCase())}
            >
              Play
            </button>
          </div>
        )}
      </TabPanel>
      <TabPanel header="CHAT" className="chat-panel">
        <div className="chat-panel-container">
          <div className="top">
            <Dropdown
              value={lobby}
              options={[
                { label: "Lobby", value: "lobby" },
                { label: "Game", value: "game" },
              ]}
              onChange={(e) => {
                set_lobby(e.value);
              }}
              placeholder={query.get("time")}
              style={{ width: "100%" }}
            />
          </div>
          <div className="chat-room">
            {lobby === "game"
              ? chat.map((msg, index) => {
                  if (msg.type === "system") {
                    return (
                      <p className="system-announcement" key={index}>
                        {msg.msg}
                      </p>
                    );
                  }
                  return (
                    <p key={index}>
                      <span>{msg.time}</span> {msg.username}: {msg.msg}
                    </p>
                  );
                })
              : lobby_chat.map((msg, index) => {
                  console.log(lobby_chat);
                  return (
                    <p key={index}>
                      <span>{msg.time}</span> {msg.username}: {msg.msg}
                    </p>
                  );
                })}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Please enter a message..."
              onKeyDown={(e) => onKeyDown(e)}
              className="input left"
            />
            <div
              className="icon-container right flex align-center justify-center"
              onClick={onChat}
            >
              <i className="icon pi pi-send"></i>
            </div>
          </div>
        </div>
      </TabPanel>
    </TabView>
  );
};

export default PlayPanel;
