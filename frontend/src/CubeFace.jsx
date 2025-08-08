import React from "react";
import { COLORS } from "./colorConstants";

const CubeFace = ({ name, squares, onSquareClick }) => {
  return (
    <div className="p-2 border rounded">
      <h3 className="font-medium mb-2">Face {name}</h3>
      <div className="grid grid-cols-3 gap-1">
        {squares.map((color, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 border ${COLORS[color] || "bg-gray-100"}`}
            onClick={() => onSquareClick(name, idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default CubeFace;
