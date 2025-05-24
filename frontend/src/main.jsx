import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Kantumruy:wght@300;400;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{
      fontFamily: "'Helvetica Neue', 'Inter', 'Kantumruy', sans-serif"
    }}>
      <App />
    </div>
  </StrictMode>,
);
