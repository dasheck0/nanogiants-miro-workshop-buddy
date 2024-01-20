import OpenAI from 'openai';
import { useState } from 'react';
import { ChatMessage } from '../dtos/chat.dto';
import { Workshop } from '../dtos/workshop.dto';

export interface ChatProps {
  prompt: string;
  temperature?: number;
  history: ChatMessage[];
  currentWorkshop?: Workshop;
  openaiClient: OpenAI;
  context: string;
}

export const useChat = () => {
  const [streamedResponse, setStreamedResponse] = useState('');

  const query = async (props: ChatProps) => {
    const temperature = props.temperature || 0.7;

    const conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = props.history.map((message: ChatMessage) => ({
      role: message.isBotMessage ? 'assistant' : 'user',
      content: message.message,
    }));

    console.log('prom', props.prompt, props.context);

    const stream = await props.openaiClient.beta.chat.completions.stream({
      messages: [
        {
          role: 'system',
          content: `You are an expert when it comes to creating workshops in miro. You help the user to plan a workshop step by step. 
          For this you need to better understand what the users intentions are.
          You follow a given plan and get instructions for each step. Here is the information you already know:
          ${props.context}          
          You can put important words between asterisks to emphasize them.
          `,
        },
        { role: 'user', content: props.prompt },
      ],
      model: 'gpt-3.5-turbo-16k-0613',
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
