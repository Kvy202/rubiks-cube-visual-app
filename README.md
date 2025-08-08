# Rubik's Cube Visual Solver

A beginner-friendly web application to solve a Rubik's Cube visually by selecting face colors and submitting them for solution. Built with React (frontend) and Node.js (backend) using the Fridrich method.

---

## 🌟 Features
- Interactive 3x3 color grid for each cube face
- Color picker palette with click-to-assign behavior
- Partitioned solving output: Cross, F2L, OLL, PLL
- Beginner tutorial section with steps
- Clean modern UI with CSS enhancements

---

## 📦 Project Structure
```
rubiks-cube-visual-app/
├── backend/               # Node.js server (uses rubiks-cube-solver)
└── frontend/              # React app
    └── src/
        ├── App.jsx
        ├── CubeFace.jsx
        ├── ColorPicker.jsx
        ├── Tutorial.jsx
        ├── Result.jsx
        ├── index.jsx
        └── index.css
```

---

## 🚀 How to Run

### 1. Clone and Install
```bash
git clone https://github.com/YOUR_USERNAME/rubiks-cube-visual-app.git
cd rubiks-cube-visual-app
```

### 2. Start Backend
```bash
cd backend
npm install
node index.js  # Starts server at http://localhost:5000
```

### 3. Start Frontend
```bash
cd ../frontend
npm install
npm run dev  # Starts Vite dev server at http://localhost:3000
```

---

## 🧠 How to Use
1. Pick a color (white, red, green, etc.) from the palette.
2. Click on each of the 6 cube faces (U, R, F, D, L, B) to color all 9 stickers.
3. Make sure every face is filled.
4. Click "Solve" to see the full solution.
5. (Optional) Enable "Partitioned Output" to split into Cross, F2L, OLL, PLL.

---

## 🤖 Solver Reference
This app uses [`rubiks-cube-solver`](https://github.com/slammayjammay/rubiks-cube-solver), a JavaScript solver implementing the Fridrich method.

---

## 📸 Demo
*(Add screenshots or a Loom video link if available)*


