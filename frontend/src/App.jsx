import React, { useState } from 'react';
import FaceInput from './FaceInput';
import Result from './Result';

/**
 * Top‑level component for the Rubik solver application.
 * Allows the user to input the six cube faces and submits them
 * to the backend for solving. Results are displayed below.
 */
function App() {
  const [faces, setFaces] = useState({ U: '', R: '', F: '', D: '', L: '', B: '' });
  const [partitioned, setPartitioned] = useState(true);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setSolution(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faces, partitioned })
      });
      const data = await res.json();
      if (data.success) {
        setSolution(data.solution);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Rubik&apos;s Cube Solver</h1>
      <p className="text-sm mb-6">
        Enter the colours of each face of your 3×3×3 cube. Each face must be nine characters long.
        The solver will return an algorithm following the Fridrich method, optionally partitioned
        into Cross, F2L, OLL and PLL phases【375182243669049†L292-L299】.
      </p>
      <FaceInput faces={faces} setFaces={setFaces} />
      <div className="my-4 flex items-center space-x-2">
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={partitioned}
            onChange={(e) => setPartitioned(e.target.checked)}
          />
          <span>Partitioned output (Cross/F2L/OLL/PLL)</span>
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Solving…' : 'Solve'}
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {solution && <Result solution={solution} />}
    </div>
  );
}

export default App;