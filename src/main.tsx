import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress console warnings in development
if (import.meta.env.DEV) {
  // Suppress React Router future flag warnings
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('React Router Future Flag Warning')) {
      return; // Suppress React Router warnings
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
