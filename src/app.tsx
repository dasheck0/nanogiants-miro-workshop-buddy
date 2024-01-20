import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import '../src/assets/style.css';
import { Footer } from './components/Footer';
import { Router } from './router';

const App: React.FC = () => {
  return (
    <MainContainer className='grid'>
      <ContentContainer className='grid'>
        <Router />
      </ContentContainer>

      <Footer />
    </MainContainer>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  justify-content: space-between;
  align-items: flex-start;
`;

const ContentContainer = styled.div`
  overflow: scroll;
  width: 100%;
`;
