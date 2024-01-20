import { useEffect, useState } from 'react';
import { ActionPlanItem, defaultPlan } from '../dtos/actionPlan.dto';
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

  const setCurrentStep = (step: number) => {
    if (conversation) {
      conversation.currentStep = step;
      setConversation(conversation);
    }
  };

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

      const actionItem = actionPlanItems[conversation.currentStep];

      if (actionItem) {
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

          setCurrentStep(conversation.currentStep + 1);
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

  const handleOnPositive = (caption: string, actionItem?: ActionPlanItem) => {
    if (actionItem && conversation) {
      const matchingActionItem = findMatchingActionItemInPlan(actionItem);
      console.log('handle positive', matchingActionItem);

      if (matchingActionItem) {
        matchingActionItem.onPositive?.(conversation);
        handleUserMessage(caption);
      }
    }
  };

  const handleOnNegative = (caption: string, actionItem?: ActionPlanItem) => {
    if (actionItem && conversation) {
      const matchingActionItem = findMatchingActionItemInPlan(actionItem);

      if (matchingActionItem) {
        matchingActionItem.onNegative?.(conversation);
        handleUserMessage(caption);
      }
    }
  };

  const findMatchingActionItemInPlan = (actionItem?: ActionPlanItem): ActionPlanItem | null => {
    if (!actionItem) {
      return null;
    }

    return actionPlanItems.find(item => item.instruction === actionItem.instruction) ?? null;
  };

  return {
    initialize,
    startNewConversation,
    handleOnPositive,
    handleOnNegative,
    handleUserMessage,
    messages,
    streamedResponse,
    currentAction: conversation ? actionPlanItems[conversation.currentStep - 1] : undefined,
  };
};