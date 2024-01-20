import OpenAI from 'openai';
import { ChatMessage } from '../dtos/chat.dto';
import { LocalStorageStore } from '../store';

export interface ChatProps {
  context: string;
  prompt: string;
  temperature?: number;
  history: ChatMessage[];
}

export const useChat = () => {
  const query = async (props: ChatProps): Promise<string[]> => {
    const content = `${props.context}\n${props.prompt}\n`;
    const temperature = props.temperature || 0.7;

    const openai = new OpenAI({
      apiKey: LocalStorageStore.getInstance().get('openaiapikey'),
      dangerouslyAllowBrowser: true,
    });

    const conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = props.history.map((message: ChatMessage) => ({
      role: message.isBotMessage ? 'assistant' : 'user',
      content: message.message,
    }));

    const response = await openai.chat.completions.create({
      messages: [...conversationHistory, { role: 'user', content }],
      model: 'gpt-3.5-turbo',
      temperature,
    });

    return [response.choices[0].message.content ?? ''];
  };

  return {
    query,
  };
};
