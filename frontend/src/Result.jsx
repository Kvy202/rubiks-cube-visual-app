import React from "react";

const Result = ({ result }) => {
  if (!result) return null;

  // If partitioned: data.phases; otherwise data.moves
  if (result.phases) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Solution (Fridrich phases)</h2>
        {Object.entries(result.phases).map(([phase, steps]) => (
          <div key={phase} className="mt-3">
            <h3 className="font-medium">{phase.toUpperCase()}</h3>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
              {Array.isArray(steps) ? steps.join(" ") : steps}
            </pre>
          </div>
        ))}
      </div>
    );
  }

  // Non‑partitioned
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Solution</h2>
      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
        {result.moves.join(" ")}
      </pre>
    </div>
  );
};

export default Result;
