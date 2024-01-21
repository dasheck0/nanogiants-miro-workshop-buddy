import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LocalStorageStore } from '../store';

export interface WorkshopDebugViewProps {}

export const WorkshopDebugView: React.FC<WorkshopDebugViewProps> = (props: WorkshopDebugViewProps) => {
  const navigate = useNavigate();

  return (
    <Container className='cs1 ce12 grid'>
      <button className='button-icon button-icon-small icon-back-1 cs1 ce2' type='button' onClick={() => navigate('/chat')}></button>
      <div className='cs3 ce12 h1'>Debug</div>
      <div className='cs1 ce12'>
        <pre>
          {JSON.stringify(
            {
              frames: LocalStorageStore.getInstance().get('boardStorage'),
              conversation: LocalStorageStore.getInstance()
                .get('conversations')
                .filter((conversation: any) => conversation.uuid === LocalStorageStore.getInstance().get('currentConversation'))[0],
            },
            null,
            2,
          )}
        </pre>
      </div>
    </Container>
  );
};

const Container = styled.div`
  align-self: flex-start;
`;
