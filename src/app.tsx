import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import '../src/assets/style.css';
import { Footer } from './components/Footer';
import { Onboarding } from './components/Onboarding';
import { Router } from './router';
import { LocalStorageStore } from './store';
import { theme } from './theme';

const App: React.FC = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState(LocalStorageStore.getInstance().get('hasSeenOnboarding'));

  return (
    <MainContainer>
      {!hasSeenOnboarding && <Onboarding onComplete={() => setHasSeenOnboarding(true)} />}
      {hasSeenOnboarding && (
        <ContentContainer className='grid'>
          <Router />
        </ContentContainer>
      )}

      {hasSeenOnboarding && <Footer />}
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
