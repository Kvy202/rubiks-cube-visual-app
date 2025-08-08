import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Rubik's Cube solver frontend.
// Includes the React plugin and leverages Tailwind via the index.css import.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});