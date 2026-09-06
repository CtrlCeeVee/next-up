import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// PWA/offline support has been retired — all functionality now lives in the
// native apps. Proactively tear down any service worker and caches left over
// from the old PWA so returning visitors (including installed PWAs) get the
// current marketing site instead of stale cached content. The self-destructing
// /service-worker.js handles clients that load before this code runs.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}

if ('caches' in window) {
  caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
