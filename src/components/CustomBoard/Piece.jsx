import React, { useRef } from "react";

const Piece = ({ src, square, chessboard, setActivePiece, color }) => {
  const pieceRef = useRef(null);

  const onDragStart = (e) => {
    const style = e.target.style;

    style.position = "absolute";
    style.height = chessboard.offsetHeight / 8 + "px";
    style.width = chessboard.offsetWidth / 8 + "px";
    setActivePiece(pieceRef.current);
  };

  const onDrag = (e) => {
    const style = e.target.style;
  };

  const onDragEnd = (e) => {
    e.target.removeAttribute("style");
    setActivePiece(null);
  };

  return (
    <img
      className={"piece " + (color === "b" ? "black" : "white")}
      src={src}
      ref={pieceRef}
      alt="Piece"
      data-square={square}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
    />
  );
};

export default Piece;
