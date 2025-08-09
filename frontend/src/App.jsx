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
  // 1) Validate faces
  const allowed = new Set(["W","G","R","B","O","Y"]);
  const faceOk = (arr) => Array.isArray(arr) && arr.length === 9 && arr.every(c => allowed.has(c));

  const badFaces = facesNames.filter(f => !faceOk(faces[f]));
  if (badFaces.length) {
    alert(`Please fill all 9 stickers on each face with valid colors (W,G,R,B,O,Y).\nMissing/invalid: ${badFaces.join(", ")}`);
    return;
  }
// Optional: strict color counts (9 of each)
  const counts = { W:0,G:0,R:0,B:0,O:0,Y:0 };
  facesNames.forEach(f => faces[f].forEach(c => counts[c]++));
  const wrong = Object.entries(counts).filter(([,n]) => n !== 9);
  if (wrong.length) {
   alert("Each color must appear exactly 9 times. Check your inputs.");
   return;
  }

  // 2) Build payload
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

    // If backend returns 400, surface the reason
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend error (${res.status}): ${text}`);
    }

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
