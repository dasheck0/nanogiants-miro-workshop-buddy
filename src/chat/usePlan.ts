import { useEffect, useState } from 'react';
import { useEventContext } from '../EventContextProvider';
import { ActionPlanItem, defaultPlan, onAnswer, useNegativeResponse, usePositiveResponse } from '../dtos/actionPlan.dto';
import { ChatMessage } from '../dtos/chat.dto';
import { LocalStorageStore } from '../store';
import { generateUuidV4 } from '../utils';
import { Conversation } from './../dtos/chat.dto';
import { useChatFlow } from './useChatFlow';

export const usePlan = () => {
  const actionPlanItems = defaultPlan;

  const { flow, streamedResponse } = useChatFlow();

  const [conversation, setConversation] = useState<Conversation | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { lastEvent, clearEvent } = useEventContext();

  const { onPositive, isLoading: isPositiveActionLoading } = usePositiveResponse();
  const { onNegative } = useNegativeResponse();

  useEffect(() => {
    if (lastEvent === 'startNewChat') {
      startNewConversation();
      clearEvent();
    }
  }, [lastEvent]);

  useEffect(() => {
    if (conversation) {
      LocalStorageStore.getInstance().updateConversation(conversation);
    }
  }, [conversation]);

  useEffect(() => {
    if (conversation) {
      LocalStorageStore.getInstance().setMessagesForConversation(conversation.uuid, messages);
      LocalStorageStore.getInstance().set('currentConversation', conversation.uuid);
    }
  }, [messages]);

  const addMessage = (message: ChatMessage) => {
    setMessages(currentMessages => [...currentMessages, message]);
  };

  const initialize = () => {
    const result = LocalStorageStore.getInstance()
      .get('conversations')
      .find((conversation: Conversation) => conversation.uuid === LocalStorageStore.getInstance().get('currentConversation'));

    if (!result) {
      startNewConversation();
    } else {
      setConversation(result);
      setMessages(result.messages);
    }
  };

  const startNewConversation = () => {
    console.log('starting new conversation');

    const newConversation: Conversation = {
      uuid: generateUuidV4(),
      currentStep: 0,
      workshop: {},
      additionalPlanItems: [],
      messages: [
        {
          uuid: generateUuidV4(),
          isBotMessage: true,
          message:
            'Hello, I am your Workshop Buddy. I will help you to plan your workshop. Before we start I need to know a little bit more about your workshop. To achieve best results answer as detailed as possible. What is the desired outcome of the workshop?',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setConversation(newConversation);
    setMessages(newConversation.messages);

    miro.board.notifications.showInfo('New conversation started');
  };

  const handleUserMessage = async (message: string) => {
    console.log('handle', message);
    if (conversation) {
      console.log('conversation', conversation);
      const latestBotMessage = conversation.messages.filter(message => message.isBotMessage).slice(-1)[0];

      if (latestBotMessage) {
        console.log('latestBotMessage', latestBotMessage);
        latestBotMessage.answeredByUser = message;
      }

      const actionItem = [...actionPlanItems, ...conversation.additionalPlanItems][conversation.currentStep];

      if (actionItem) {
        actionItem.additionalUserFeedback = message;

        console.log('actionItem', actionItem);
        addMessage({
          uuid: generateUuidV4(),
          isBotMessage: false,
          message,
          timestamp: new Date().toISOString(),
        });

        try {
          const completedStream = await flow({
            userPrompt: actionItem.instruction,
            additionalUserFeedback: actionItem.additionalUserFeedback,
            history: conversation.messages,
          });

          const finalResponse = completedStream();
          addMessage({
            uuid: generateUuidV4(),
            isBotMessage: true,
            message: finalResponse,
            timestamp: new Date().toISOString(),
            actionItem,
          });

          console.log('current"#,', actionItem);
          if (actionItem.type === 'question') {
            onAnswer(conversation, message, actionItem);
            // setCurrentStep(conversation.currentStep + 1);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        miro.board.notifications.showError('No action item found');
      }
    } else {
      miro.board.notifications.showError('No conversation found');
    }
  };

  const handleOnPositive = async (caption: string, message: string, actionItem?: ActionPlanItem) => {
    if (actionItem && conversation) {
      const matchingActionItem = findMatchingActionItemInPlan(actionItem);

      console.log('handle positive', matchingActionItem, message);

      if (matchingActionItem) {
        await onPositive(conversation, message, matchingActionItem);
        console.log('HSJkfhdjkfghdsjfdzsiufzhdsjkfhdjfzds78');

        //matchingActionItem.onPositive?.(conversation, message);
        handleUserMessage(caption);
      }
    }
  };

  const handleOnNegative = async (caption: string, message: string, actionItem?: ActionPlanItem) => {
    if (actionItem && conversation) {
      const matchingActionItem = findMatchingActionItemInPlan(actionItem);
      console.log('handle negative', matchingActionItem, message);

      if (matchingActionItem) {
        // matchingActionItem.onNegative?.(conversation, message);
        await onNegative(conversation, message, matchingActionItem);
        handleUserMessage(caption);
      }
    }
  };

  const findMatchingActionItemInPlan = (actionItem?: ActionPlanItem): ActionPlanItem | null => {
    if (!actionItem) {
      return null;
    }

    return (
      [...actionPlanItems, ...(conversation?.additionalPlanItems || [])].find(item => item.instruction === actionItem.instruction) ?? null
    );
  };

  return {
    initialize,
    startNewConversation,
    handleOnPositive,
    handleOnNegative,
    handleUserMessage,
    messages,
    streamedResponse,
    currentStep: conversation ? conversation.currentStep : 0,
    currentAction: conversation
      ? [...actionPlanItems, ...(conversation?.additionalPlanItems || [])][conversation.currentStep - 1]
      : undefined,
    isPositiveActionLoading,
  };
};
