import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });

  // Handle messages from service worker (e.g., requesting auth token)
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'GET_AUTH_TOKEN') {
      const token = localStorage.getItem('token');
      event.ports[0].postMessage({ token });
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
