import { Route, Routes } from 'react-router-dom';
import { Chatbot } from '../components/Chatbot';
import { Sample } from '../components/Sample';
import { Settings } from '../components/Settings';
import { WorkshopDebugView } from '../components/WorkshopDebugView';

export const Router = () => {
  return (
    <Routes>
      <Route path='/chat' element={<Chatbot />} />
      <Route path='/sample' element={<Sample />} />
      <Route path='/settings' element={<Settings />} />
      <Route path='/debug' element={<WorkshopDebugView />} />
      <Route path='*' element={<Chatbot />} />
    </Routes>
  );
};
