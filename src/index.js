import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app';
import ScrollTop from './components/scroll-top';
import './assets/css/index.css';
import './assets/css/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <App />
        <ScrollTop/>
    </>
);
