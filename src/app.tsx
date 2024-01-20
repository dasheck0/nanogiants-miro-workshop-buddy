import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import '../src/assets/style.css';
import { Footer } from './components/Footer';
import { Router } from './router';
import { theme } from './theme';

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

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  justify-content: space-between;
  align-items: flex-start;
  background-color: ${props => props.theme.colors.background};
`;

const ContentContainer = styled.div`
  overflow: scroll;
  width: 100%;
  height: 100%;
`;
