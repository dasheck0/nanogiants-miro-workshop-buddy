import OpenAI from 'openai';
import { useToolCall } from '../chat/useToolCall';
import { LocalStorageStore } from '../store';
import { useBuilder } from './useBuilder';

export const useCreateAgendaItemBoard = () => {
  const { invokeTool } = useToolCall();
  const { createAgendaItemFrame } = useBuilder();

  const createAgendaItemBoard = async (description: string, rowIndex: number) => {
    const openai = new OpenAI({
      apiKey: LocalStorageStore.getInstance().get('openaiapikey'),
      dangerouslyAllowBrowser: true,
    });

    createAgendaItemFrame({
      rowIndex,
      title: 'Jfkdhjfdkfdjk',
      description: 'jhfkdhfjdsjkd',
      duration: 'fhdkjfhdjk',
      desiredOutcome: 'Hjkfhdjk',
    });

    // invokeTool({
    //   openAIClient: openai,
    //   tools: [],
    //   functions: [createAgendaItemFunction],
    //   prompt: description,
    //   forceTool: 'createAgendaItem',
    //   onToolsInvoked: tools => {
    //     console.log(tools);
    //   },
    //   onFunctionInvoked: functionCall => {
    //     console.log(functionCall);
    //     const { title, description, durationInMinutes, desiredOutcome } = JSON.parse(functionCall.arguments);
    //     createAgendaItemFrame({
    //       rowIndex,
    //       title,
    //       description,
    //       duration: durationInMinutes,
    //       desiredOutcome,
    //     });
    //   },
    //   onRegularInocation: message => {
    //     miro.board.notifications.showError('There was an error. No boards were created.');
    //   },
    // });
  };

  return {
    createAgendaItemBoard,
  };
};
