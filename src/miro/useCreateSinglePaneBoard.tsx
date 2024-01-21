import OpenAI from 'openai';
import { useToolCall } from '../chat/useToolCall';
import { LocalStorageStore } from '../store';
import { useBuilder } from './useBuilder';

export const useCreateSinglePaneBoard = () => {
  const { invokeTool } = useToolCall();
  const { createSinglePaneItemFrame } = useBuilder();

  const createSinglePaneBoard = async (description: string, rowIndex: number) => {
    const openai = new OpenAI({
      apiKey: LocalStorageStore.getInstance().get('openaiapikey'),
      dangerouslyAllowBrowser: true,
    });

    createSinglePaneItemFrame({
      rowIndex,
      // title,
      // description,
      // duration: durationInMinutes,
      // paneTitle,
      // paneDescription,
      title: 'fdjkldjkl',
      description: 'fdjkldjkl',
      duration: 'fdjkldjkl',
      paneTitle: 'fdjkldjkl',
      paneDescription: 'fdjkldjkl',
    });

    // invokeTool({
    //   openAIClient: openai,
    //   tools: [],
    //   functions: [createSinglePaneItemFunction],
    //   prompt: description,
    //   forceTool: 'createSinglePaneItem',
    //   onToolsInvoked: tools => {
    //     console.log(tools);
    //   },
    //   onFunctionInvoked: functionCall => {
    //     console.log(functionCall);
    //     const { title, description, durationInMinutes, paneTitle, paneDescription } = JSON.parse(functionCall.arguments);
    //     createSinglePaneItemFrame({
    //       rowIndex,
    //       title,
    //       description,
    //       duration: durationInMinutes,
    //       paneTitle,
    //       paneDescription,
    //     });
    //   },
    //   onRegularInocation: message => {
    //     miro.board.notifications.showError('There was an error. No boards were created.');
    //   },
    // });
  };

  return {
    createSinglePaneBoard,
  };
};
