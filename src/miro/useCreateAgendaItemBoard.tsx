import OpenAI from 'openai';
import { useToolCall } from '../chat/useToolCall';
import { LocalStorageStore } from '../store';
import { createAgendaItemFunction } from './chatgptFunctions';
import { useBuilder } from './useBuilder';

export const useCreateAgendaItemBoard = () => {
  const { invokeTool } = useToolCall();
  const { createAgendaItemFrame } = useBuilder();

  const create = async (description: string) => {
    const openai = new OpenAI({
      apiKey: LocalStorageStore.getInstance().get('openaiapikey'),
      dangerouslyAllowBrowser: true,
    });

    invokeTool({
      openAIClient: openai,
      tools: [],
      functions: [createAgendaItemFunction],
      prompt: description,
      forceTool: 'createAgendaItem',
      onToolsInvoked: tools => {
        console.log(tools);
      },
      onFunctionInvoked: functionCall => {
        console.log(functionCall);
        const { title, description, durationInMinutes, desiredOutcome } = JSON.parse(functionCall.arguments);
        createAgendaItemFrame({
          title,
          description,
          duration: durationInMinutes,
          desiredOutcome,
        });
      },
      onRegularInocation: message => {
        miro.board.notifications.showError('There was an error. No boards were created.');
      },
    });
  };

  return {
    create,
  };
};
