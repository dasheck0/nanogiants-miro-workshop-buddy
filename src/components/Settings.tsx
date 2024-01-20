import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LocalStorageStore } from '../store';

export const Settings = () => {
  const [openaiApiKey, setOpenaiApiKey] = React.useState<string>(LocalStorageStore.getInstance().get('openaiapikey') || '');
  const navigate = useNavigate();

  const updateItems = async () => {
    LocalStorageStore.getInstance().set('openaiapikey', openaiApiKey);
    await miro.board.notifications.showInfo('Settings saved successfully');
  };

  return (
    <Container className='cs1 ce12 grid'>
      <button className='button-icon button-icon-small icon-back-1 cs1 ce2' type='button' onClick={() => navigate(-1)}></button>
      <div className='cs3 ce12 h2'>Settings</div>
      <div className='form-group-small cs1 ce12'>
        <label htmlFor='openai-api-key'>OpenAI API Key</label>
        <input
          type='password'
          id='openai-api-key'
          name='openai-api-key'
          className='input input-small'
          placeholder='Your OpenAI API Key'
          value={openaiApiKey}
          onChange={e => setOpenaiApiKey(e.target.value)}
        />
      </div>

      <Button className='cs1 ce12 button button-primary button-small' onClick={() => updateItems()}>
        Save
      </Button>
    </Container>
  );
};

const Container = styled.div`
  align-self: flex-start;
`;

const Button = styled.button`
  text-align: center;
  justify-content: center;
`;
