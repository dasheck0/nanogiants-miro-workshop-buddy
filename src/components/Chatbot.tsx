import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useChatFlow } from '../chat/useChatFlow';
import { buildEmptyPlan } from '../dtos/actionPlan.dto';
import { ChatMessage, Conversation } from '../dtos/chat.dto';
import { LocalStorageStore } from '../store';
import { generateUuidV4 } from '../utils';
import { ChatMessageItem } from './ChatMessageItem';

export interface ChatbotProps {}

export const Chatbot: React.FC<ChatbotProps> = (props: ChatbotProps) => {
  const [currentConversation, setCurrentConversation] = React.useState<Conversation>();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  const [currentQuery, setCurrentQuery] = React.useState<string>('');
  const [isChatEnabled, setIsChatEnabled] = React.useState<boolean>(false);
  const [sendButtonClass, setSendButtonClass] = React.useState<string>('button button-small button-primary');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { flow, streamedResponse } = useChatFlow();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    findCurrentWorkshop();
    setIsChatEnabled(LocalStorageStore.getInstance().get('openaiapikey').length > 0);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedResponse]);

  React.useEffect(() => {
    // update the messages of the curret conversation
    if (currentConversation) {
      const conversations = LocalStorageStore.getInstance().get('conversations');
      const index = conversations.findIndex((conversation: Conversation) => conversation.uuid === currentConversation.uuid);

      if (index > -1) {
        conversations[index].messages = messages;
        LocalStorageStore.getInstance().set('conversations', conversations);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(currentMessages => [...currentMessages, message]);
  };

  const onDeleteConversation = async () => {
    startNewWorkshop();
  };

  const findCurrentWorkshop = () => {
    const result = LocalStorageStore.getInstance()
      .get('conversations')
      .find((conversation: Conversation) => conversation.uuid === LocalStorageStore.getInstance().get('currentConversation'));

    if (!result) {
      startNewWorkshop();
    } else {
      setCurrentConversation(result);
      setMessages(result.messages);

      console.log('current conversation', result);
    }
  };

  const startNewWorkshop = async () => {
    const conversation: Conversation = {
      uuid: generateUuidV4(),
      messages: [
        {
          isBotMessage: true,
          message:
            'Hello, I am your Workshop Buddy. I will help you to plan your workshop. Before we start I need to know a little bit more about your workshop. To achieve best results answer as detailed as possible.',
          timestamp: new Date().toISOString(),
          username: 'bot',
          icon: 'https://i.imgur.com/T2WwVfS.png',
        },
      ],
      workshop: {},
    };

    LocalStorageStore.getInstance().set('conversations', [conversation]);
    LocalStorageStore.getInstance().set('currentConversation', conversation.uuid);
    LocalStorageStore.getInstance().set('actionplan', buildEmptyPlan());

    setCurrentConversation(conversation);
    setMessages(conversation.messages);
  };

  const onSendMessage = async (message: string) => {
    setIsLoading(true);
    const currentMessages = [...messages];
    setSendButtonClass('button button-small button-primary button-loading');

    addMessage({
      username: 'user',
      message,
      timestamp: '2021-02-01 12:00:00',
      icon: 'https://i.imgur.com/T2WwVfS.png',
      isBotMessage: false,
    });

    const currentPlan = LocalStorageStore.getInstance().get('actionplan');
    const currentQuestion = currentPlan.items[currentPlan.currentStep];

    currentQuestion.userAnswer.push(message);
    currentPlan.currentStep = currentPlan.currentStep + 1;

    console.log('currentQuestion', currentQuestion, currentPlan.currentStep);

    try {
      const completedStream = await flow({
        userPrompt: message,
        history: currentMessages,
        actionPlan: currentPlan,
      });

      const finalResponse = completedStream();
      setCurrentQuery('');
      setSendButtonClass('button button-small button-primary');

      LocalStorageStore.getInstance().set('actionplan', currentPlan);

      addMessage({
        username: 'bot',
        message: finalResponse,
        timestamp: '2021-02-01 12:00:00',
        icon: 'https://i.imgur.com/T2WwVfS.png',
        isBotMessage: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
            disabled={!isChatEnabled || streamedResponse.length > 0 || isLoading}
          />
        </InputContainer>
        <button
          className={sendButtonClass}
          type='button'
          disabled={!isChatEnabled || currentQuery.length === 0 || isLoading}
          onClick={() => onSendMessage(currentQuery)}>
          {!isLoading && <span className='icon-invitation'></span>}
        </button>

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
  width: 100%;
`;

const InputContainer = styled.div`
  flex: 1;
  margin-right: 16px;
`;

const Error = styled.div`
  color: var(--red600);
`;
