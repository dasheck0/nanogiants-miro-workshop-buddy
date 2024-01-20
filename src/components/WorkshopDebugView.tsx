import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LocalStorageStore } from '../store';

export interface WorkshopDebugViewProps {}

export const WorkshopDebugView: React.FC<WorkshopDebugViewProps> = (props: WorkshopDebugViewProps) => {
  const navigate = useNavigate();

  return (
    <Container className='cs1 ce 12 grid'>
      <button className='button-icon button-icon-small icon-back-1 cs1 ce2' type='button' onClick={() => navigate(-1)}></button>
      <div className='cs3 ce12 h1'>Debug</div>
      <div className='cs1 ce12'>{JSON.stringify(LocalStorageStore.getInstance().get('conversations')[0].workshop ?? {}, null, 2)}</div>
    </Container>
  );
};

const Container = styled.div`
  align-self: flex-start;
`;
