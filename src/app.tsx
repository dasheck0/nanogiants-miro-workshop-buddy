import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { EventProvider, useEventContext } from './EventContextProvider';
import './assets/style.css';
import { Footer } from './components/Footer';
import { Onboarding } from './components/Onboarding';
import { SimpleModal } from './components/SimpleModal';
import { useModal } from './components/useModal';
import { Router } from './router';
import { LocalStorageStore } from './store';
import { theme } from './theme';

const App: React.FC = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState(LocalStorageStore.getInstance().get('hasSeenOnboarding'));
  const { close, isOpen, open } = useModal();
  const { dispatchEvent } = useEventContext();

  return (
    <MainContainer>
      {!hasSeenOnboarding && <Onboarding onComplete={() => setHasSeenOnboarding(true)} />}
      {hasSeenOnboarding && (
        <ContentContainer className='grid'>
          <Router />
        </ContentContainer>
      )}

      {hasSeenOnboarding && (
        <SimpleModal
          isOpen={isOpen}
          onClose={close}
          onStartNewChat={() => {
            close();
            dispatchEvent('startNewChat');
          }}
        />
      )}

      {hasSeenOnboarding && (
        <Footer
          onSettingsClick={() => {
            open();
          }}
        />
      )}
    </MainContainer>
  );
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <EventProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </EventProvider>,
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
