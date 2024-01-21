import OpenAI from 'openai';
import { ChatMessage } from '../dtos/chat.dto';
import { useChat } from './useChat';

export interface ChatFlowProps {
  userPrompt: string;
  additionalUserFeedback?: string;
  history: ChatMessage[];
}

export const useChatFlow = () => {
  const { query, streamedResponse } = useChat();

  const flow = async (props: ChatFlowProps) => {
    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    });

    const context = props.history
      .filter(item => item.isBotMessage)
      .map(item => `${item.message}: ${item.answeredByUser ?? ''}`)
      .join('\n');

    const additionalUserFeedback = props.additionalUserFeedback
      ? `. Please respect the users feedback: ${props.additionalUserFeedback}`
      : '';

    return await query({
      history: props.history,
      prompt: `${props.userPrompt}${additionalUserFeedback}`,
      openaiClient: openai,
      context,
    });
  };

  return {
    flow,
    streamedResponse,
  };
};
