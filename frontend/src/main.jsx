import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from './App.jsx'

// Add Khmer font (Kantumruy Pro) from Google Fonts
const khmerLink = document.createElement('link');
khmerLink.rel = 'stylesheet';
khmerLink.href = 'https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@100;300;400;500;600;700&display=swap';
document.head.appendChild(khmerLink);

// Add SF Pro font from Apple
const appleLink = document.createElement('link');
appleLink.rel = 'stylesheet';
appleLink.href = 'https://fonts.cdnfonts.com/css/sf-pro-display';
document.head.appendChild(appleLink);

// Apply fonts to body
document.body.style.fontFamily = '"SF Pro Display", "Kantumruy Pro", sans-serif';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
