import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

// StrictMode-г хаслаа: development дээр useEffect 2x ажиллуулж
// apicars.info-ийн rate limit (429)-д хүрч байсан
ReactDOM.createRoot(document.getElementById('root')).render(<App />);