import React, { useState } from "react";
import CubeFace from "./CubeFace";
import ColorPicker from "./ColorPicker";
import Result from "./Result";
import Tutorial from "./Tutorial";

const App = () => {
  const facesNames = ["U", "R", "F", "D", "L", "B"];
  const [faces, setFaces] = useState(
    facesNames.reduce((acc, f) => ({ ...acc, [f]: Array(9).fill("") }), {})
  );
  const [currentColor, setCurrentColor] = useState("W");
  const [partitioned, setPartitioned] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleColorChange = (color) => {
    setCurrentColor(color);
  };

  const handleSquareClick = (face, index) => {
    const newFace = [...faces[face]];
    newFace[index] = currentColor;
    setFaces((prev) => ({ ...prev, [face]: newFace }));
  };

  const handleSolve = async () => {
    // Build payload for backend
    const payload = {
      faces: {
        U: faces.U.join(""),
        R: faces.R.join(""),
        F: faces.F.join(""),
        D: faces.D.join(""),
        L: faces.L.join(""),
        B: faces.B.join(""),
      },
      partitioned,
    };
    setLoading(true);
    try {
      const res = await fetch("https://rubiks-cube-visual-app.onrender.com/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error solving cube: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Rubik&apos;s Cube Visual Solver</h1>

      <ColorPicker current={currentColor} onSelect={handleColorChange} />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {facesNames.map((f) => (
          <CubeFace
            key={f}
            name={f}
            squares={faces[f]}
            onSquareClick={handleSquareClick}
          />
        ))}
      </div>

      <div className="mt-4">
      <label className="inline-flex items-center space-x-2">
        <input
          type="checkbox"
          checked={partitioned}
          onChange={(e) => setPartitioned(e.target.checked)}
        />
        <span>Partitioned output (Cross/F2L/OLL/PLL)</span>
      </label>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleSolve}
        disabled={loading}
      >
        {loading ? "Solving…" : "Solve"}
      </button>

      <Result result={result} />

      <Tutorial />
    </div>
  );
};

export default App;
