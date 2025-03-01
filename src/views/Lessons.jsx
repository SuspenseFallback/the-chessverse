import "../css/views/Lessons.css";

import React, { useState } from "react";

import wbishop from "../assets/images/pieces/wbishop.png";
import wking from "../assets/images/pieces/wking.png";
import wknight from "../assets/images/pieces/wknight.png";
import wpawn from "../assets/images/pieces/wpawn.png";
import wqueen from "../assets/images/pieces/wqueen.png";
import wrook from "../assets/images/pieces/wrook.png";

const Lessons = () => {
  const [activeItem, setActiveItem] = useState(1);

  return (
    <>
      <div className="lessons-container">
        <div className="beginner-lessons"></div>
      </div>
    </>
  );
};

export default Lessons;
