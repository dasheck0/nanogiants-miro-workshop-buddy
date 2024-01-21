import React, { useEffect } from 'react';
import styled from 'styled-components';
import { usePlan } from '../chat/usePlan';
import { ChatMessage } from '../dtos/chat.dto';
import { useCreateAgendaItemBoard } from '../miro/useCreateAgendaItemBoard';
import { LocalStorageStore } from '../store';
import { generateUuidV4 } from '../utils';
import { ChatMessageItem } from './ChatMessageItem';

export interface ChatbotProps {}

export const Chatbot: React.FC<ChatbotProps> = (props: ChatbotProps) => {
  const {
    initialize,
    messages,
    handleOnPositive,
    handleOnNegative,
    streamedResponse,
    handleUserMessage,
    startNewConversation,
    currentAction,
    currentStep,
  } = usePlan();

  const [currentQuery, setCurrentQuery] = React.useState<string>('');
  const [isChatEnabled, setIsChatEnabled] = React.useState<boolean>(false);
  const [sendButtonClass, setSendButtonClass] = React.useState<string>('button button-small button-primary');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { create } = useCreateAgendaItemBoard();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();

    setIsChatEnabled(LocalStorageStore.getInstance().get('openaiapikey').length > 0);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedResponse]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSendMessage = async (message: string) => {
    setIsLoading(true);
    setSendButtonClass('button button-small button-primary button-loading');

    try {
      await handleUserMessage(message);
    } catch (error) {
      console.error(error);
    } finally {
      setCurrentQuery('');
      setIsLoading(false);
      setSendButtonClass('button button-small button-primary');
    }
  };

  const isLatestBotMessage = (message: ChatMessage) => {
    return messages.length > 0 && messages[messages.length - 1].uuid === message.uuid;
  };

  const createTest = async () => {
    try {
      await create(
        'Create one board for the following agenda item. The agenda item is called ice breaker and the main goal is to get to know each other and have a little fun. It should be about 15 minutes long. Create only one single board and not multiple ones!',
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className='cs1 ce12'>
      <MessageContainer className='grid'>
        {messages.map((message: ChatMessage, index: number) => (
          <ChatMessageItem
            information={message}
            key={index}
            onPositive={handleOnPositive}
            onPositiveCaption={currentAction?.positiveCaption}
            onNegative={handleOnNegative}
            onNegativeCaption={currentAction?.negativeCaption}
            isLatestBotMessage={isLatestBotMessage(message)}
          />
        ))}
        {streamedResponse && (
          <ChatMessageItem
            information={{
              uuid: generateUuidV4(),
              message: streamedResponse,
              timestamp: new Date().toISOString(), // Temporary timestamp
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
            disabled={!isChatEnabled || streamedResponse.length > 0 || isLoading || (currentAction?.type ?? 'question') !== 'question'}
          />
        </InputContainer>
        <button
          className={sendButtonClass}
          type='button'
          disabled={!isChatEnabled || currentQuery.length === 0 || isLoading || (currentAction?.type ?? 'question') !== 'question'}
          onClick={() => onSendMessage(currentQuery)}>
          {!isLoading && <span className='icon-invitation'></span>}
        </button>
      </UserInputContainer>
      <button onClick={() => createTest()}>Click</button>
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
  margin-bottom: 16px;
`;

const InputContainer = styled.div`
  flex: 1;
  margin-right: 16px;
`;

const Error = styled.div`
  color: var(--red600);
`;
