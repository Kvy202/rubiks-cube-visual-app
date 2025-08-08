// Node.js backend to solve Rubik's cube using the Fridrich method
const express = require('express');
const cors = require('cors');
app.use(cors());
const cors = require('cors');
const solver = require('./solver');

/**
 * Converts user‑provided faces into the cube state expected by the
 * `rubiks-cube-solver` library.
 *
 * The user sends an object with six keys: `U`, `R`, `F`, `D`, `L`, `B`.
 * Each key contains a nine‑character string where each character
 * represents the colour on that face. To determine which letter to use
 * for each sticker in the output, we look at the centre sticker of each
 * face (index 4) and assign an orientation letter based on its face:
 *  - centre of F → 'f'
 *  - centre of R → 'r'
 *  - centre of U → 'u'
 *  - centre of D → 'd'
 *  - centre of L → 'l'
 *  - centre of B → 'b'
 *
 * With this mapping in hand we walk through each face in the order
 * front → right → up → down → left → back and replace each colour with its
 * orientation letter.  The result is a 54 character string describing
 * the cube state, as required by the solver【375182243669049†L266-L305】.
 *
 * @param {Object} faces
 * @returns {string}
 */
function convertFacesToState(faces) {
  const required = ['U', 'R', 'F', 'D', 'L', 'B'];
  // Basic validation
  for (const face of required) {
    const str = faces[face];
    if (typeof str !== 'string' || str.length !== 9) {
      throw new Error(`Face ${face} must be a string of nine characters.`);
    }
  }
  // Build mapping from colour to orientation letter based on centre stickers
  const mapping = {};
  mapping[faces['F'][4]] = 'f';
  mapping[faces['R'][4]] = 'r';
  mapping[faces['U'][4]] = 'u';
  mapping[faces['D'][4]] = 'd';
  mapping[faces['L'][4]] = 'l';
  mapping[faces['B'][4]] = 'b';
  // Assemble state string in order: front, right, up, down, left, back
  const order = ['F', 'R', 'U', 'D', 'L', 'B'];
  let state = '';
  for (const face of order) {
    for (const char of faces[face]) {
      const orient = mapping[char];
      if (!orient) {
        throw new Error(
          `Unknown colour '${char}' on face ${face}. Make sure the centre colours are consistent.`
        );
      }
      state += orient;
    }
  }
  return state;
}

const app = express();
app.use(cors());
app.use(express.json());

// POST /solve
// Accepts JSON like { faces: { U: "...", R: "...", F: "...", D: "...", L: "...", B: "..." }, partitioned: true }
// Returns either a single move string or a partitioned object
app.post('/solve', (req, res) => {
  try {
    const { faces, partitioned = true } = req.body || {};
    if (!faces) {
      return res.status(400).json({ success: false, error: 'Missing faces parameter' });
    }
    const cubeState = convertFacesToState(faces);
    const solution = solver(cubeState, { partitioned });
    res.json({ success: true, solution });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Rubik solver backend listening on port ${PORT}`);
});