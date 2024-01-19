import * as React from 'react';
import { createRoot } from 'react-dom/client';

import '../src/assets/style.css';
import { Chatbot } from './components/Chatbot';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className='grid h100 w100' style={{ gridTemplateRows: '1fr auto', overflow: 'hidden' }}>
      <div className='grid cs1 ce12' style={{ alignSelf: 'flex-start', height: '100%', overflow: 'scroll' }}>
        <Chatbot />
      </div>

      <Footer />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
