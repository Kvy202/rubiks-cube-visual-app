const express = require('express');
const cors = require('cors');
const solveCube = require('rubiks-cube-solver');

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());
app.use(express.json());

app.post('/solve', (req, res) => {
    const { faces } = req.body;
    try {
        const solution = solveCube(faces);
        res.json({ solution });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
