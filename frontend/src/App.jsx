import React, { useState } from "react";
import CubeFace from "./CubeFace";
import ColorPicker from "./ColorPicker";
import Result from "./Result";
import Tutorial from "./Tutorial";

/** Backend URL:
 *  You can set VITE_BACKEND_URL in Vercel/your .env to override.
 *  Defaults to your Render service.
 */
const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://rubiks-cube-visual-app.onrender.com";

const facesNames = ["U", "R", "F", "D", "L", "B"];
const allowedColors = new Set(["W", "G", "R", "B", "O", "Y"]);

const App = () => {
  // Initialize each face as 9 empty stickers
  const [faces, setFaces] = useState(
  facesNames.reduce((acc, f) => ({ ...acc, [f]: Array(9).fill("W") }), {})
  );
  const [currentColor, setCurrentColor] = useState("W");
  const [partitioned, setPartitioned] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  // in App.jsx, after your useStates:
React.useEffect(() => {
  window._faces = faces;      // current stickers
}, [faces]);

  const handleColorChange = (color) => setCurrentColor(color);

  const handleSquareClick = (face, index) => {
    const newFace = [...faces[face]];
    newFace[index] = currentColor;
    setFaces((prev) => ({ ...prev, [face]: newFace }));
  };

  // ---------- Validation helpers ----------
  const facesAreComplete = () =>
    facesNames.every(
      (f) =>
        Array.isArray(faces[f]) &&
        faces[f].length === 9 &&
        faces[f].every((c) => allowedColors.has(c))
    );

  const haveExactColorCounts = () => {
    const counts = { W: 0, G: 0, R: 0, B: 0, O: 0, Y: 0 };
    facesNames.forEach((f) => faces[f].forEach((c) => (counts[c] += 1)));
    return Object.values(counts).every((n) => n === 9);
  };

  const buildCubeState = () =>
    faces.U.join("") +
    faces.R.join("") +
    faces.F.join("") +
    faces.D.join("") +
    faces.L.join("") +
    faces.B.join("");

// ---------- Solve handler ----------
const handleSolve = async () => {
  setResult(null);

  // 1) Basic validation: all 54 filled with allowed colors
  const allowed = new Set(["W","G","R","B","O","Y"]);
  const faceOk = (arr) =>
    Array.isArray(arr) && arr.length === 9 && arr.every(c => allowed.has(c));

  const missing = ["U","R","F","D","L","B"].filter(f => !faceOk(faces[f]));
  if (missing.length) {
    alert(`Please fill all 9 stickers on these faces with W/G/R/B/O/Y: ${missing.join(", ")}`);
    return;
  }

  // 2) Strict counts: each color exactly 9 times
  const counts = { W:0,G:0,R:0,B:0,O:0,Y:0 };
  ["U","R","F","D","L","B"].forEach(f => faces[f].forEach(c => counts[c]++));
  const wrong = Object.entries(counts).filter(([,n]) => n !== 9);
  if (wrong.length) {
    alert("Each color must appear exactly 9 times across the cube.");
    return;
  }

  // 3) Build color -> face-letter legend from centers
  const centers = { U: faces.U[4], R: faces.R[4], F: faces.F[4], D: faces.D[4], L: faces.L[4], B: faces.B[4] };
  if (Object.values(centers).some(c => !allowed.has(c))) {
    alert("Please set the center (middle) on every face.");
    return;
  }
  const colorToFace = {};
  Object.entries(centers).forEach(([faceLetter, color]) => { colorToFace[color] = faceLetter; });

  // 4) Convert every sticker color to face letters, in URFDLB order
  const order = ["U","R","F","D","L","B"];
  const faceToLetters = (faceArr) => faceArr.map(c => colorToFace[c]);
  // ensure no color fell outside the 6 centers
  if (!order.every(f => faceToLetters(faces[f]).every(ch => ch))) {
    alert("Sticker colors must match one of the six center colors.");
    return;
  }
  const cubeState = order.map(f => faceToLetters(faces[f]).join("")).join("");

// 5) Debug & final validation before sending
const counts = { W:0,G:0,R:0,B:0,O:0,Y:0 };
["U","R","F","D","L","B"].forEach(f => faces[f].forEach(c => counts[c]++));
console.log("color counts:", counts);

console.log("cubeState:", cubeState, "len:", cubeState.length);
if (!/^[URFDLB]{54}$/.test(cubeState)) {
  alert(`cubeState invalid → len=${cubeState.length}, value=${cubeState}`);
  return;
}

  // 6) Send to backend
  const payload = { cubeState, partitioned };
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
