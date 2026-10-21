// Ensure window.fetch has both getter and setter before extension scripts or libraries attempt to wrap it
try {
  let currentFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    enumerable: true,
    get() {
      return currentFetch;
    },
    set(newFetch) {
      currentFetch = newFetch;
    }
  });
} catch {
  // ignore
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
