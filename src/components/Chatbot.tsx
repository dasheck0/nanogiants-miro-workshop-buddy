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
  const { query, streamedResponse } = useChat();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, streamedResponse]);

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

  const onDeleteConversation = async () => {
    setMessages([]);
    LocalStorageStore.getInstance().set('conversations', [{ messages: [] }]);
  };

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
      const completedStream = await query({
        context: '',
        prompt: message,
        history: currentMessages,
      });

      const finalResponse = completedStream();
      setCurrentQuery('');

      addMessage({
        username: 'bot',
        message: finalResponse,
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
        {streamedResponse && (
          <ChatMessageItem
            information={{
              username: 'bot',
              message: streamedResponse,
              timestamp: new Date().toISOString(), // Temporary timestamp
              icon: 'https://i.imgur.com/T2WwVfS.png',
              isBotMessage: true,
            }}
            key='streamed-response'
          />
        )}
        <div ref={messagesEndRef} />
      </MessageContainer>
      <UserInputContainer>
        <InputContainer className='form-group-small'>
          <input
            className='input input-small'
            type='text'
            value={currentQuery}
            onChange={e => setCurrentQuery(e.target.value)}
            disabled={!isChatEnabled || streamedResponse.length > 0}
          />
        </InputContainer>
        <Button
          className='button-icon button-icon-small icon-invitation'
          type='button'
          disabled={!isChatEnabled || currentQuery.length === 0 || streamedResponse.length > 0}
          onClick={() => onSendMessage(currentQuery)}></Button>

        <button className='button-icon button-icon-small icon-trash' type='button' onClick={() => onDeleteConversation()}></button>
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
