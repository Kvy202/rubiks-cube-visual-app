import React, { useState, useEffect } from "react";
import CubeFace from "./CubeFace";
import ColorPicker from "./ColorPicker";
import Result from "./Result";
import Tutorial from "./Tutorial";

/** Backend URL:
 *  Set VITE_BACKEND_URL in Vercel/Env to override.
 *  Defaults to your Render service.
 */
const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://rubiks-cube-visual-app.onrender.com";

const facesNames = ["U", "R", "F", "D", "L", "B"];
const allowedColors = new Set(["W", "G", "R", "B", "O", "Y"]);

const App = () => {
  // Start with all stickers = white (so blank-looking squares are real 'W')
  const [faces, setFaces] = useState(
    facesNames.reduce((acc, f) => ({ ...acc, [f]: Array(9).fill("W") }), {})
  );

  const [currentColor, setCurrentColor] = useState("W");
  const [partitioned, setPartitioned] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Expose for quick DevTools inspection (optional)
  useEffect(() => {
    window._faces = faces;
  }, [faces]);

  const handleColorChange = (color) => setCurrentColor(color);

  const handleSquareClick = (face, index) => {
    const newFace = [...faces[face]];
    // always write a valid color; default to white if something odd
    newFace[index] = allowedColors.has(currentColor) ? currentColor : "W";
    setFaces((prev) => ({ ...prev, [face]: newFace }));
  };

  // ---------- Solve handler ----------
  const handleSolve = async () => {
    setResult(null);

    // 1) Basic validation
    const faceOk = (arr) =>
      Array.isArray(arr) && arr.length === 9 && arr.every((c) => allowedColors.has(c));

    const missing = facesNames.filter((f) => !faceOk(faces[f]));
    if (missing.length) {
      alert(
        `Please fill all 9 stickers on these faces with W/G/R/B/O/Y: ${missing.join(
          ", "
        )}`
      );
      return;
    }

    // 2) Strict counts inside handleSolve
const dbgCounts = { W: 0, G: 0, R: 0, B: 0, O: 0, Y: 0 };
facesNames.forEach((f) => faces[f].forEach((c) => (dbgCounts[c] += 1)));
const wrong = Object.entries(dbgCounts).filter(([, n]) => n !== 9);
if (wrong.length) {
  alert(
    `Each color must appear exactly 9 times. Current counts: ` +
    `W:${dbgCounts.W} G:${dbgCounts.G} R:${dbgCounts.R} ` +
    `B:${dbgCounts.B} O:${dbgCounts.O} Y:${dbgCounts.Y}`
  );
  return;
}

    // 3) Build color -> face-letter legend from centers
    const centers = {
      U: faces.U[4],
      R: faces.R[4],
      F: faces.F[4],
      D: faces.D[4],
      L: faces.L[4],
      B: faces.B[4],
    };

    if (Object.values(centers).some((c) => !allowedColors.has(c))) {
      alert("Please set the center (middle) on every face.");
      return;
    }

    const colorToFace = {};
    Object.entries(centers).forEach(([faceLetter, color]) => {
      colorToFace[color] = faceLetter; // e.g. 'W' -> 'U'
    });

    // 4) Convert each sticker color to its face letter, in URFDLB order
    const order = ["U", "R", "F", "D", "L", "B"];
    const faceToLetters = (arr) => arr.map((c) => colorToFace[c]);

    // ensure all stickers map to a known center color
    if (!order.every((f) => faceToLetters(faces[f]).every((ch) => ch))) {
      alert("Sticker colors must match one of the six center colors.");
      return;
    }

    const cubeState = order
      .map((f) => faceToLetters(faces[f]).join(""))
      .join("");

    // 5) Final validation & debug
    console.log("color counts:", dbgCounts);
    console.log("cubeState:", cubeState, "len:", cubeState.length);

    if (!/^[URFDLB]{54}$/.test(cubeState)) {
      alert(`cubeState invalid → len=${cubeState.length}, value=${cubeState}`);
      return;
    }

// 6) Send faces (not cubeState) to backend
const facesPayload = {
  U: faces.U.join(""),
  R: faces.R.join(""),
  F: faces.F.join(""),
  D: faces.D.join(""),
  L: faces.L.join(""),
  B: faces.B.join(""),
};

const payload = { faces: facesPayload, partitioned };
setLoading(true);
try {
  const res = await fetch(`${API_URL}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

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
  function fillSolved() {
  const centers = { U: "W", R: "R", F: "G", D: "Y", L: "O", B: "B" };
  const solved = {};
  Object.entries(centers).forEach(([f, c]) => (solved[f] = Array(9).fill(c)));
  setFaces(solved);
  }
  // Live UI counts (for user feedback)
  const uiCounts = { W: 0, G: 0, R: 0, B: 0, O: 0, Y: 0 };
  facesNames.forEach((f) => faces[f].forEach((c) => (uiCounts[c] += 1)));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Rubik&apos;s Cube Visual Solver</h1>
       {/* New Button */}
    <button
      onClick={fillSolved}
      className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
    >
      Fill Solved
    </button>

      <ColorPicker current={currentColor} onSelect={handleColorChange} />

      <div className="mt-2 text-sm text-gray-600">
        Counts → W:{uiCounts.W} G:{uiCounts.G} R:{uiCounts.R} B:{uiCounts.B} O:{uiCounts.O} Y:{uiCounts.Y}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
