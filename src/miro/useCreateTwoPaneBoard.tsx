import OpenAI from 'openai';
import { useToolCall } from '../chat/useToolCall';
import { LocalStorageStore } from '../store';
import { useBuilder } from './useBuilder';

export const useCreateTwoPaneBoard = () => {
  const { invokeTool } = useToolCall();
  const { createTwoPaneItemFrame } = useBuilder();

  const createTwoPaneBoard = async (description: string, rowIndex: number) => {
    const openai = new OpenAI({
      apiKey: LocalStorageStore.getInstance().get('openaiapikey'),
      dangerouslyAllowBrowser: true,
    });

    createTwoPaneItemFrame({
      rowIndex,
      title: 'fdjkldjkl',
      description: 'fdjkldjkl',
      duration: 'fdjkldjkl',
      leftPaneTitle: 'fdjkldjkl',
      leftPaneDescription: 'fdjkldjkl',
      rightPaneTitle: 'fdjkldjkl',
      rightPaneDescription: 'fdjkldjkl',
    });

    // invokeTool({
    //   openAIClient: openai,
    //   tools: [],
    //   functions: [createTwoPaneItemFunction],
    //   prompt: description,
    //   forceTool: 'createTwoPaneItem',
    //   onToolsInvoked: tools => {
    //     console.log(tools);
    //   },
    //   onFunctionInvoked: functionCall => {
    //     console.log(functionCall);
    //     const { title, description, durationInMinutes, leftPaneTitle, leftPaneDescription, rightPaneTitle, rightPaneDescription } =
    //       JSON.parse(functionCall.arguments);
    //     createTwoPaneItemFrame({
    //       rowIndex,
    //       title,
    //       description,
    //       duration: durationInMinutes,
    //       leftPaneTitle,
    //       leftPaneDescription,
    //       rightPaneTitle,
    //       rightPaneDescription,
    //     });
    //   },
    //   onRegularInocation: message => {
    //     miro.board.notifications.showError('There was an error. No boards were created.');
    //   },
    // });
  };

  return {
    createTwoPaneBoard,
  };
};
