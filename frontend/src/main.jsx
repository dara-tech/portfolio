import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Your styles
import App from './App.jsx';

// Add font links to document head
const khmerFontLink = document.createElement('link');
khmerFontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@100;200;300;400;500;600;700;800;900&display=swap';
khmerFontLink.rel = 'stylesheet';
document.head.appendChild(khmerFontLink);

const modernFontLink = document.createElement('link');
modernFontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap';
modernFontLink.rel = 'stylesheet';
document.head.appendChild(modernFontLink);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{
      fontFamily: "'Inter', 'Noto Sans Khmer', sans-serif"
    }}>
      <App />
    </div>
  </StrictMode>,
);
