const express = require("express");
const cors = require("cors");
const solveCube = require("rubiks-cube-solver"); // keep your lib

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://rubiks-cube-visual-app-ai2v.vercel.app",
    "http://localhost:5173",   // Vite
    "http://localhost:3000"    // CRA (if you ever use it)
  ]
}));
app.use(express.json());

// Optional: quick health check
app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/solve", async (req, res) => {
  try {
    const { cubeState, faces, partitioned } = req.body;

    // helper: run solver safely and normalize to { moves: [] }
    const runSolve = (state) => {
      // the library returns a STRING of moves (e.g., "R U R' ...")
      const raw = solveCube(state);
      const moves =
        typeof raw === "string"
          ? raw.trim().split(/\s+/).filter(Boolean)
          : [];
      return moves;
    };

    // 1) If cubeState provided, validate and use it
    if (typeof cubeState === "string") {
      if (!/^[URFDLB]{54}$/.test(cubeState)) {
        return res.status(400).json({ error: '"cubeState" must be 54 letters of URFDLB' });
      }
      try {
        const moves = runSolve(cubeState);
        // Always return { moves } so frontend Result.jsx can render
        return res.json({ cubeState, moves });
      } catch (e) {
        console.error("Solver failed with cubeState:", cubeState, e);
        return res
          .status(400)
          .json({ error: "Solver failed for supplied cubeState", details: String(e && e.stack || e) });
      }
    }

    // 2) Else expect faces (strings of W/G/R/B/O/Y, length 9 each)
    if (!faces) {
      return res.status(400).json({ error: 'Provide "cubeState" or "faces"' });
    }
    const order = ["U", "R", "F", "D", "L", "B"];
    for (const f of order) {
      if (!faces[f] || typeof faces[f] !== "string" || faces[f].length !== 9) {
        return res.status(400).json({ error: `Face ${f} missing or invalid` });
      }
    }

    // Map colors -> face letters using centers
    const centers = {
      U: faces.U[4], R: faces.R[4], F: faces.F[4],
      D: faces.D[4], L: faces.L[4], B: faces.B[4]
    };
    const colorToFace = {};
    for (const [faceLetter, color] of Object.entries(centers)) colorToFace[color] = faceLetter;

    const toFaceLetters = (s) => s.split("").map((c) => colorToFace[c]).join("");
    const facelet = order.map((f) => toFaceLetters(faces[f])).join("");

    if (!/^[URFDLB]{54}$/.test(facelet)) {
      return res.status(400).json({ error: "Computed cubeState invalid from faces", facelet });
    }

    try {
      const moves = runSolve(facelet);
      // Always return { moves }
      return res.json({ cubeState: facelet, moves });
    } catch (e) {
      console.error("Solver failed with computed facelet:", facelet, e);
      return res
        .status(400)
        .json({ error: "Solver failed for computed cubeState", details: String(e && e.stack || e) });
    }
  } catch (e) {
    console.error("Unhandled /solve error:", e);
    return res.status(500).json({ error: "Server error", details: String(e && e.stack || e) });
  }
});

app.listen(PORT, () => console.log(`Rubik solver backend listening on port ${PORT}`));
