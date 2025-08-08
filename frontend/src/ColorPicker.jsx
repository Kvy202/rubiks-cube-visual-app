import React from "react";
import { COLORS } from "./colorConstants";

const palette = ["W", "G", "R", "B", "O", "Y"];

const ColorPicker = ({ current, onSelect }) => {
  return (
    <div className="flex space-x-2 mb-4">
      {palette.map((c) => (
        <button
          key={c}
          className={`w-8 h-8 rounded border ${COLORS[c]}`}
          style={{ outline: current === c ? "2px solid blue" : "none" }}
          onClick={() => onSelect(c)}
          title={c}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
