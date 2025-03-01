import React, { useRef, useState } from "react";
import Piece from "./Piece";

const Square = ({
  square,
  piece,
  setSelectedSquare,
  setActivePiece,
  chessboard,
  color,
  onDrop,
}) => {
  const squareRef = useRef(null);
  const [extraClass, setExtraClass] = useState("");

  const click = () => {
    setSelectedSquare(square);
    console.log(square);
  };

  const highlight = (e) => {
    e.preventDefault();

    if (squareRef.current.classList.contains("highlighted")) {
      squareRef.current.classList.remove("highlighted");
    } else {
      squareRef.current.classList.add("highlighted");
    }
  };

  return (
    <div
      className={"square " + extraClass}
      data-square={square}
      onClick={click}
      onContextMenu={(e) => highlight(e)}
      ref={squareRef}
      onDrop={() => {
        const move = onDrop(square);
        console.log(move);
        setExtraClass("");
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={() => {
        if (!piece) {
          setExtraClass("border");
        }
      }}
      onDragLeave={() => {
        if (!piece) {
          setExtraClass("");
        }
      }}
    >
      {piece ? (
        <Piece
          src={piece}
          square={square}
          setActivePiece={setActivePiece}
          chessboard={chessboard}
          color={color}
        />
      ) : null}
    </div>
  );
};

export default Square;
