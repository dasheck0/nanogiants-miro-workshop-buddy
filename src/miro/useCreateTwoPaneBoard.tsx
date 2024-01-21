import { useToolCall } from '../chat/useToolCall';
import { useBuilder } from './useBuilder';

export const useCreateTwoPaneBoard = () => {
  const { invokeTool } = useToolCall();
  const { createTwoPaneItemFrame } = useBuilder();

  const createTwoPaneBoard = async (argumentsAsString: string, rowIndex: number) => {
    const { title, description, durationInMinutes, leftPaneTitle, leftPaneDescription, rightPaneTitle, rightPaneDescription } =
      JSON.parse(argumentsAsString);
    createTwoPaneItemFrame({
      rowIndex,
      title,
      description,
      duration: durationInMinutes,
      leftPaneTitle,
      leftPaneDescription,
      rightPaneTitle,
      rightPaneDescription,
    });
  };

  return {
    createTwoPaneBoard,
  };
};
