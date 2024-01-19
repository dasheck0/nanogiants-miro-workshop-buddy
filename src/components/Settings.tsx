import React from 'react';
import { LocalStorageStore } from '../store';

export const Settings = () => {
  const [openaiApiKey, setOpenaiApiKey] = React.useState<string>(LocalStorageStore.getInstance().get('openaiapikey') || '');

  const updateItems = async () => {
    LocalStorageStore.getInstance().set('openaiapikey', openaiApiKey);
    await miro.board.notifications.showInfo('Settings saved successfully');
  };

  return (
    <>
      <h1 className='cs1 ce12 h1'>Settings</h1>
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

      <button className='cs1 ce12 button button-primary button-small' style={{ textAlign: 'center', justifyContent: 'center' }} onClick={() => updateItems()}>
        Save
      </button>
    </>
  );
};
