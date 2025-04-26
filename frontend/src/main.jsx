import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from './App.jsx'

// Add Inter font (Modern, clean, and highly readable)
const interLink = document.createElement('link');
interLink.rel = 'stylesheet';
interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap';
document.head.appendChild(interLink);

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

// Add JetBrains Mono for code elements
const jetbrainsLink = document.createElement('link');
jetbrainsLink.rel = 'stylesheet';
jetbrainsLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap';
document.head.appendChild(jetbrainsLink);

// Add Poppins for headings
const poppinsLink = document.createElement('link');
poppinsLink.rel = 'stylesheet';
poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap';
document.head.appendChild(poppinsLink);

// Apply fonts to body with a modern font stack
document.body.style.fontFamily = '"Inter", "SF Pro Display", "Kantumruy Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';

// Apply JetBrains Mono to code elements
document.body.style.setProperty('--font-mono', '"JetBrains Mono", monospace');

// Apply Poppins to headings
document.body.style.setProperty('--font-heading', '"Poppins", sans-serif');

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
