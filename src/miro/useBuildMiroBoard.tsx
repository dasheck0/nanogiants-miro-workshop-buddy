import OpenAI from 'openai';
import { useToolCall } from '../chat/useToolCall';
import { createAgendaItemFunction, createSinglePaneItemFunction, createTwoPaneItemFunction } from './chatgptFunctions';
import { useCreateAgendaItemBoard } from './useCreateAgendaItemBoard';
import { useCreateSinglePaneBoard } from './useCreateSinglePaneBoard';
import { useCreateTwoPaneBoard } from './useCreateTwoPaneBoard';

export interface BuildMiroBoardProps {
  message: string;
  rowIndex: number;
}

export const useBuildMiroBoard = () => {
  const { invokeTool } = useToolCall();

  const { createAgendaItemBoard } = useCreateAgendaItemBoard();
  const { createSinglePaneBoard } = useCreateSinglePaneBoard();
  const { createTwoPaneBoard } = useCreateTwoPaneBoard();

  const build = async (props: BuildMiroBoardProps) => {
    const availableFunctions = [createSinglePaneItemFunction, createTwoPaneItemFunction, createAgendaItemFunction];

    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    });

    console.log(props.message);

    await invokeTool({
      openAIClient: openai,
      tools: [],
      functions: availableFunctions,
      prompt: props.message,
      onToolsInvoked: tools => {
        console.log('toolcall', tools);
      },
      onFunctionInvoked: functionCall => {
        console.log('functioncall', functionCall);

        if (functionCall.name === 'createAgendaItem') {
          createAgendaItemBoard(functionCall.arguments, props.rowIndex);
        } else if (functionCall.name === 'createSinglePaneItem') {
          createSinglePaneBoard(functionCall.arguments, props.rowIndex);
        } else if (functionCall.name === 'createTwoPaneItem') {
          createTwoPaneBoard(functionCall.arguments, props.rowIndex);
        }
      },
      onRegularInocation: message => {
        miro.board.notifications.showError('There was an error. No boards were created.');
      },
    });
  };

  return {
    build,
  };
};
