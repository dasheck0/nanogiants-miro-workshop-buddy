import { Route, Routes } from 'react-router-dom';
import { Chatbot } from '../components/Chatbot';
import { Sample } from '../components/Sample';

export const Router = () => {
  return (
    <Routes>
      <Route path='/chat' element={<Chatbot />} />
      <Route path='/sample' element={<Sample />} />
      <Route path='*' element={<Sample />} />
    </Routes>
  );
};
