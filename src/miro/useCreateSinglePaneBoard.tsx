import { useToolCall } from '../chat/useToolCall';
import { useBuilder } from './useBuilder';

export const useCreateSinglePaneBoard = () => {
  const { invokeTool } = useToolCall();
  const { createSinglePaneItemFrame } = useBuilder();

  const createSinglePaneBoard = async (argumentsAsString: string, rowIndex: number) => {
    const { title, description, durationInMinutes, paneTitle, paneDescription } = JSON.parse(argumentsAsString);
    createSinglePaneItemFrame({
      rowIndex,
      title,
      description,
      duration: durationInMinutes,
      paneTitle,
      paneDescription,
    });
  };

  return {
    createSinglePaneBoard,
  };
};
