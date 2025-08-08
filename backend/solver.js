// Thin wrapper around the rubiks-cube-solver library.
//
// The library accepts a string describing the cube state and returns a
// string of Rubik's cube moves following the Fridrich method.  When the
// `partitioned` option is true it returns an object with four phases:
// `cross`, `f2l`, `oll` and `pll`【375182243669049†L292-L299】.  Cross and
// F2L are arrays of moves for each edge and pair, while OLL and PLL are
// algorithm strings.
//
// See: https://github.com/slammayjammay/rubiks-cube-solver
const rubikSolver = require('rubiks-cube-solver');

/**
 * Solve the cube state.
 *
 * @param {string} state 54‑character cube description (see convertFacesToState).
 * @param {Object} options Options passed to the solver.  When `partitioned`
 * is true, the solver returns an object with keys `cross`, `f2l`, `oll`
 * and `pll`【375182243669049†L292-L299】.
 * @returns {string|Object} The sequence of moves or partitioned solution.
 */
function solve(state, options = {}) {
  // Default to partitioned output so users can view all stages.
  const { partitioned = true } = options;
  return rubikSolver(state, { partitioned });
}

module.exports = solve;