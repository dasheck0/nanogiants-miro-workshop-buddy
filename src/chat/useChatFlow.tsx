import OpenAI from 'openai';
import { ActionPlan } from '../dtos/actionPlan.dto';
import { ChatMessage } from '../dtos/chat.dto';
import { LocalStorageStore } from '../store';
import { useChat } from './useChat';

export interface ChatFlowProps {
  userPrompt: string;
  actionPlan: ActionPlan;
  history: ChatMessage[];
}

export const useChatFlow = () => {
  const { query, streamedResponse } = useChat();

  const flow = async (props: ChatFlowProps) => {
    const openai = new OpenAI({
      apiKey: LocalStorageStore.getInstance().get('openaiapikey'),
      dangerouslyAllowBrowser: true,
    });

    const currentQuestion = props.actionPlan.items[props.actionPlan.currentStep];
    console.log('currentQuestion', currentQuestion);

    if (currentQuestion) {
      if (currentQuestion) {
        return await query({
          history: props.history,
          prompt: currentQuestion.instruction,
          openaiClient: openai,
        });
      }
    }

    return () => '';
  };

  return {
    flow,
    streamedResponse,
  };
};
