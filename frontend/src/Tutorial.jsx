import React from "react";

const Tutorial = () => (
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-2">How to use this solver</h2>
    <ol className="list-decimal pl-6 space-y-1">
      <li>Select a color from the palette above.</li>
      <li>Click on each square of a face to assign that color.</li>
      <li>Fill all six faces (U, R, F, D, L, B).</li>
      <li>Choose whether you want a partitioned solution.</li>
      <li>Click <b>Solve</b> to compute the solution.</li>
    </ol>
  </div>
);

export default Tutorial;
