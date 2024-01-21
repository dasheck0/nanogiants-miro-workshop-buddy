import { useBuilder } from './useBuilder';

export const useCreateAgendaItemBoard = () => {
  const { createAgendaItemFrame } = useBuilder();

  const createAgendaItemBoard = async (argumentsAsString: string, rowIndex: number) => {
    const { title, description, durationInMinutes, desiredOutcome } = JSON.parse(argumentsAsString);
    createAgendaItemFrame({
      rowIndex,
      title,
      description,
      duration: durationInMinutes,
      desiredOutcome,
    });
  };

  return {
    createAgendaItemBoard,
  };
};
