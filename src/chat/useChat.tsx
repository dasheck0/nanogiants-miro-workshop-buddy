import OpenAI from 'openai';
import { useState } from 'react';
import { ChatMessage } from '../dtos/chat.dto';
import { LocalStorageStore } from '../store';

export interface ChatProps {
  context: string;
  prompt: string;
  temperature?: number;
  history: ChatMessage[];
}

export const useChat = () => {
  const [streamedResponse, setStreamedResponse] = useState('');

  const query = async (props: ChatProps) => {
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

    const stream = await openai.beta.chat.completions.stream({
      messages: [...conversationHistory, { role: 'user', content }],
      model: 'gpt-3.5-turbo',
      stream: true,
      temperature,
    });

    let finalResponse = '';

    for await (const chunk of stream) {
      const chunkContent = chunk.choices[0]?.delta?.content || '';
      finalResponse += chunkContent;
      setStreamedResponse(finalResponse);
    }

    return () => {
      setStreamedResponse('');
      return finalResponse;
    };
  };

  return {
    query,
    streamedResponse,
  };
};
