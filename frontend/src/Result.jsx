import React from 'react';

/**
 * Display the solution returned by the backend.
 * Handles both a raw algorithm string and a partitioned object.
 *
 * @param {Object|string} solution
 */
const Result = ({ solution }) => {
  // If solution is a string, split into individual moves.
  if (typeof solution === 'string') {
    const moves = solution.trim().split(/\s+/);
    return (
      <div className="mt-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Solution Moves</h2>
        <p className="flex flex-wrap gap-2">
          {moves.map((move, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-100 rounded">
              {move}
            </span>
          ))}
        </p>
      </div>
    );
  }

  // Otherwise assume partitioned solution with cross, f2l, oll and pll.
  const { cross = [], f2l = [], oll = '', pll = '' } = solution;
  return (
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Solution Phases</h2>
      <div className="space-y-4">
        <section>
          <h3 className="font-bold">Cross</h3>
          <ul className="list-disc pl-6">
            {cross.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="font-bold">F2L</h3>
          <ul className="list-disc pl-6">
            {f2l.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="font-bold">OLL</h3>
          <p>{oll}</p>
        </section>
        <section>
          <h3 className="font-bold">PLL</h3>
          <p>{pll}</p>
        </section>
      </div>
    </div>
  );
};

export default Result;