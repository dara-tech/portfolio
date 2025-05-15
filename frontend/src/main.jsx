import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Your styles
import App from './App.jsx';

// Add font link to document head
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{
      fontFamily: "'Helvetica Neue', 'Inter', sans-serif"
    }}>
      <App />
    </div>
  </StrictMode>,
);
