import "../css/views/Home.css";

import React, { useEffect } from "react";

import { getSession } from "../supabase/supabase";
import { useNavigate } from "react-router-dom";
import play from "../assets/images/play.svg";
import drill from "../assets/images/drill.svg";
import learn from "../assets/images/learn.svg";
import puzzles from "../assets/images/puzzles.svg";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home";
  }, []);

  useEffect(() => {
    getSession((data, err) => {
      if (err) console.error(err);

      if (data.session) {
        navigate("/dashboard");
      }
    });
  }, []);

  useEffect(() => {
    window.onresize = () => {
      document.querySelector(".board-container").style.top =
        window.innerHeight / 2;
    };
  }, []);

  const link = (to) => {
    navigate(to);
  };

  return (
    <main>
      <div className="box-container">
        <div className="box box-1" onClick={() => link('/play?time="bullet"')}>
          <p className="title">Play a match</p>
          <img src={play} alt="Play" />
        </div>
        <div className="box box-2" onClick={() => link("/puzzles/trainer")}>
          <p className="title">Try some puzzles</p>
          <img src={puzzles} alt="Puzzles" />
        </div>
        <div className="box box-3" onClick={() => link("/lessons")}>
          <p className="title">Learn how to play</p>
          <img src={learn} alt="Learn" />
        </div>
        <div className="box box-4" onClick={() => link("/drills")}>
          <p className="title">Do some drills</p>
          <img src={drill} alt="Drills" />
        </div>
      </div>
    </main>
  );
};

export default Home;
