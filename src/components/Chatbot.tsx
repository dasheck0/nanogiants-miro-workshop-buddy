import React from 'react';
import styled from 'styled-components';
import { useChat } from '../chat/useChat';
import { ChatMessage } from '../dtos/chat.dto';
import { LocalStorageStore } from '../store';
import { ChatMessageItem } from './ChatMessageItem';

export interface ChatbotProps {}

export const Chatbot: React.FC<ChatbotProps> = (props: ChatbotProps) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = React.useState<string>('');
  const [isChatEnabled, setIsChatEnabled] = React.useState<boolean>(false);
  const { query } = useChat();

  React.useEffect(() => {
    const conversations = LocalStorageStore.getInstance().get('conversations');
    setMessages(conversations[0].messages);

    setIsChatEnabled(LocalStorageStore.getInstance().get('openaiapikey').length > 0);
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages(currentMessages => [...currentMessages, message]);
  };

  React.useEffect(() => {
    LocalStorageStore.getInstance().set('conversations', [{ messages }]);
  }, [messages]);

  const onSendMessage = async (message: string) => {
    const currentMessages = [...messages];

    addMessage({
      username: 'user',
      message,
      timestamp: '2021-02-01 12:00:00',
      icon: 'https://i.imgur.com/T2WwVfS.png',
      isBotMessage: false,
    });

    try {
      const response = await query({
        context: '',
        prompt: message,
        history: currentMessages,
      });

      addMessage({
        username: 'bot',
        message: response[0],
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className='cs1 ce12'>
      <MessageContainer className='grid'>
        {messages.map((message: ChatMessage, index: number) => (
          <ChatMessageItem information={message} key={index} />
        ))}
      </MessageContainer>
      <UserInputContainer>
        <InputContainer className='form-group-small'>
          <input
            className='input input-small'
            type='text'
            value={currentQuery}
            onChange={e => setCurrentQuery(e.target.value)}
            disabled={!isChatEnabled}
          />
        </InputContainer>
        <Button
          className='button-icon button-icon-small icon-invitation'
          type='button'
          disabled={!isChatEnabled || currentQuery.length === 0}
          onClick={() => onSendMessage(currentQuery)}></Button>
      </UserInputContainer>
      {!isChatEnabled && <Error className='cs1 ce12 p-small'>You have to setup an OpenAI API key in order to use the chatbot.</Error>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  height: 100%;
  padding-left: 4px;
  align-self: flex-start;
`;

const MessageContainer = styled.div`
  overflow: scroll;
  align-self: flex-start;
`;

const UserInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  margin-bottom: 8px;
  width: 100%;
`;

const InputContainer = styled.div`
  flex: 1;
`;

const Button = styled.button`
  margin-left: 16px;
`;

const Error = styled.div`
  color: var(--red600);
`;
