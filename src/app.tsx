import * as React from 'react';
import { createRoot } from 'react-dom/client';

import '../src/assets/style.css';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className='grid h100 w100' style={{ gridTemplateRows: '1fr auto' }}>
      <div className='grid cs1 ce12' style={{ alignSelf: 'flex-start' }}>
        <div className='cs1 ce4 placeholder'>test</div>
        <div className='cs6 ce11 placeholder'>test</div>
      </div>

      <Footer />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
