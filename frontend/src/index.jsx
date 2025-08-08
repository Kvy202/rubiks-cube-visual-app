import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Attach React app to the root DOM element.
// This file is the entry point for bundlers such as Vite or Create React App.
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);