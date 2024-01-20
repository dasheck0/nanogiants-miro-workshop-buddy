import React from 'react';
import styled from 'styled-components';
import { ChatMessage } from '../dtos/chat.dto';
import { ChatMessageItem } from './ChatMessageItem';

export interface ChatbotProps {}

export const Chatbot: React.FC<ChatbotProps> = (props: ChatbotProps) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  React.useEffect(() => {
    setMessages([
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: false,
      },
    ]);
  }, []);

  return (
    <Container className='cs1 ce12'>
      <MessageContainer className='grid'>
        {messages.map((message: ChatMessage) => (
          <ChatMessageItem information={message} />
        ))}
      </MessageContainer>
      <UserInputContainer>
        <InputContainer className='form-group-small'>
          <input className='input input-small' type='text' />
        </InputContainer>
        <Button className='button-icon button-icon-small icon-invitation' type='button'></Button>
      </UserInputContainer>
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
