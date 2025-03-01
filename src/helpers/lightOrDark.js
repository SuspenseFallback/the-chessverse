import { throw_err } from "./throw_err";

export const squares = [
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
  "d1",
  "d2",
  "d3",
  "d4",
  "d5",
  "d6",
  "d7",
  "d8",
  "e1",
  "e2",
  "e3",
  "e4",
  "e5",
  "e6",
  "e7",
  "e8",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "g1",
  "g2",
  "g3",
  "g4",
  "g5",
  "g6",
  "g7",
  "g8",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "h7",
  "h8",
];

export const board_squares = [
  ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"],
  ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
  ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
  ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"],
  ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8"],
  ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"],
  ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"],
  ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"],
].reverse();

export const lightOrDark = (square) => {
  switch (square) {
    case "a1":
      return "light";
    case "a2":
      return "dark";
    case "a3":
      return "light";
    case "a4":
      return "dark";
    case "a5":
      return "light";
    case "a6":
      return "dark";
    case "a7":
      return "light";
    case "a8":
      return "dark";
    case "b1":
      return "dark";
    case "b2":
      return "light";
    case "b3":
      return "dark";
    case "b4":
      return "light";
    case "b5":
      return "dark";
    case "b6":
      return "light";
    case "b7":
      return "dark";
    case "b8":
      return "light";
    case "c1":
      return "light";
    case "c2":
      return "dark";
    case "c3":
      return "light";
    case "c4":
      return "dark";
    case "c5":
      return "light";
    case "c6":
      return "dark";
    case "c7":
      return "light";
    case "c8":
      return "dark";
    case "d1":
      return "dark";
    case "d2":
      return "light";
    case "d3":
      return "dark";
    case "d4":
      return "light";
    case "d5":
      return "dark";
    case "d6":
      return "light";
    case "d7":
      return "dark";
    case "d8":
      return "light";
    case "e1":
      return "light";
    case "e2":
      return "dark";
    case "e3":
      return "light";
    case "e4":
      return "dark";
    case "e5":
      return "light";
    case "e6":
      return "dark";
    case "e7":
      return "light";
    case "e8":
      return "dark";
    case "f1":
      return "dark";
    case "f2":
      return "light";
    case "f3":
      return "dark";
    case "f4":
      return "light";
    case "f5":
      return "ldark";
    case "f6":
      return "light";
    case "f7":
      return "dark";
    case "f8":
      return "light";
    case "g1":
      return "light";
    case "g2":
      return "dark";
    case "g3":
      return "light";
    case "g4":
      return "dark";
    case "g5":
      return "light";
    case "g6":
      return "dark";
    case "g7":
      return "light";
    case "g8":
      return "dark";
    case "h1":
      return "dark";
    case "h2":
      return "light";
    case "h3":
      return "dark";
    case "h4":
      return "light";
    case "h5":
      return "dark";
    case "h6":
      return "light";
    case "h7":
      return "dark";
    case "h8":
      return "light";
    default:
      return throw_err(400, "Invalid value");
  }
};
