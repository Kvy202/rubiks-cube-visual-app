const express = require("express");
const cors = require("cors");
const solveCube = require("rubiks-cube-solver");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://rubiks-cube-visual-app-ai2v.vercel.app",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

app.post("/solve", (req, res) => {
  try {
    const { faces } = req.body;

    if (!faces) {
      return res.status(400).json({ error: 'Missing "faces" in request body' });
    }

    const order = ["U", "R", "F", "D", "L", "B"];

    // Validate
    for (const f of order) {
      if (!faces[f] || typeof faces[f] !== "string" || faces[f].length !== 9) {
        return res.status(400).json({ error: `Face ${f} missing or invalid` });
      }
    }

    // Map colors -> face letters using centers
    const centers = {
      U: faces.U[4],
      R: faces.R[4],
      F: faces.F[4],
      D: faces.D[4],
      L: faces.L[4],
      B: faces.B[4],
    };

    const colorToFace = {};
    for (const [faceLetter, color] of Object.entries(centers)) {
      colorToFace[color] = faceLetter;
    }

    const toFaceLetters = (s) =>
      s.split("").map((c) => colorToFace[c]).join("");

    const cubeState = order.map((f) => toFaceLetters(faces[f])).join("");

    if (!/^[URFDLB]{54}$/.test(cubeState)) {
      return res
        .status(400)
        .json({ error: "Computed cubeState invalid", cubeState });
    }

    // Solve
    const solution = solveCube(cubeState);
    res.json({ cubeState, solution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
