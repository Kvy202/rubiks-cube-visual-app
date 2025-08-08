import React from 'react';

/**
 * Component for entering the six faces of the cube.
 * Each face has a label (U, R, F, D, L, B) and a text input limited to nine characters.
 * Values are automatically upper‑cased for convenience.
 */
const FaceInput = ({ faces, setFaces }) => {
  const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];

  const handleChange = (face, value) => {
    // Limit to 9 characters and convert to uppercase to preserve colour identifiers.
    const cleaned = value.toUpperCase().slice(0, 9);
    setFaces((prev) => ({ ...prev, [face]: cleaned }));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {faceOrder.map((face) => (
        <div key={face} className="flex flex-col">
          <label className="font-medium mb-1">Face {face}</label>
          <input
            type="text"
            className="border rounded p-2"
            maxLength={9}
            placeholder="Enter 9 letters"
            value={faces[face]}
            onChange={(e) => handleChange(face, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default FaceInput;