import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Footer } from './components/Footer';

import { BrowserRouter, useNavigate } from 'react-router-dom';
import '../src/assets/style.css';
import { Router } from './router';

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='grid h100 w100' style={{ gridTemplateRows: '1fr auto', overflow: 'hidden' }}>
      <div className='grid cs1 ce12 h100' style={{ alignSelf: 'flex-start', overflow: 'scroll' }}>
        <Router />
      </div>

      <button className='button button-primary cs1 ce4' onClick={() => navigate('/chat')}>
        Chat
      </button>
      <button className='button button-primary cs9 ce12' onClick={() => navigate('/')}>
        Sample
      </button>

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
