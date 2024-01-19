import React from 'react';
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
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
      {
        username: 'bot',
        message:
          'Wow, Stefan! A masters degree with summa cum laude is an impressive accomplishment. Your dedication and hard work have definitely paid off. Having a strong academic foundation will serve you well on your path to earning a PhD. Now that we have a clearer picture of your starting point, lets move on to the next step. Are you ready to select a route to achieve your goal',
        timestamp: '2021-02-01 12:00:02',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
      {
        username: 'stefan',
        message: '123456',
        timestamp: '2021-02-01 12:00:03',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
      {
        username: 'bot',
        message: 'Your order is on its way',
        timestamp: '2021-02-01 12:00:04',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
      {
        username: 'bot',
        message: 'Hello, how can I help you?',
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
      {
        username: 'stefan',
        message: 'I need help with my order',
        timestamp: '2021-02-01 12:00:01',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
      {
        username: 'bot',
        message:
          'Wow, Stefan! A masters degree with summa cum laude is an impressive accomplishment. Your dedication and hard work have definitely paid off. Having a strong academic foundation will serve you well on your path to earning a PhD. Now that we have a clearer picture of your starting point, lets move on to the next step. Are you ready to select a route to achieve your goal',
        timestamp: '2021-02-01 12:00:02',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
      {
        username: 'stefan',
        message: '123456',
        timestamp: '2021-02-01 12:00:03',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
      {
        username: 'bot',
        message: 'Your order is on its way',
        timestamp: '2021-02-01 12:00:04',
        icon: 'https://i.imgur.com/T2WwVfS.png',
      },
    ]);
  }, []);

  return (
    <div className="grid cs1 ce12">
      {messages.map((message: ChatMessage) => (
        <ChatMessageItem information={message} />
      ))}
    </div>
  );
};
