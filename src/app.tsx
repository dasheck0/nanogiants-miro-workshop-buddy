import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import '../src/assets/style.css';
import { Footer } from './components/Footer';
import { Router } from './router';

const App: React.FC = () => {
  return (
    <div
      className='grid h100 debug'
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
      <div className='grid debug w100' style={{ overflow: 'scroll' }}>
        <Router />
      </div>

      <Footer />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
