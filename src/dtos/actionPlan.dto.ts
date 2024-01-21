import { useState } from 'react';
import { useBuildMiroBoard } from '../miro/useBuildMiroBoard';
import { LocalStorageStore } from '../store';
import { Conversation } from './chat.dto';

export type ActionType = 'question' | 'confirmation';
export type ActionIntent = 'outcome' | 'time' | 'participants' | 'confirmation' | 'title' | 'agenda' | 'detailed_agenda' | 'create_boards';

export interface ActionPlanItem {
  type: ActionType;
  instruction: string;
  intent: ActionIntent;
  positiveCaption?: string;
  negativeCaption?: string;
  additionalUserFeedback?: string;
}

export interface ActionPlan {
  items: ActionPlanItem[];
  currentStep: number;
}

const createAgendaItem = (topic: string): ActionPlanItem => {
  return {
    instruction: `Suggest a detailed plan on what to cover for the topic "${topic} during the workshop. List the subtopics as bullet points. Each bullet point should only contain the name of the subtopic with no explanation. There should not be more than 3 bullet points`,
    type: 'confirmation',
    intent: 'detailed_agenda',
    positiveCaption: 'Plan Details',
    negativeCaption: 'Regenerate',
  };
};

const createDetailedAgendaItem = (topic: string): ActionPlanItem => {
  return {
    instruction: `Suggest a activity to do during the workshop for the topic "${topic}". Describe how to do the activity in detail. And suggest a layout for a slide that can be used to present the activity. Do not use more than 150 words`,
    type: 'confirmation',
    intent: 'create_boards',
    positiveCaption: 'Create Boards',
    negativeCaption: 'Regenerate',
  };
};

export const findRelevantLines = (message: string) => {
  const lines = message.split('\n').filter(line => line.length > 0);
  return lines.filter(line => {
    const trimmedLine = line.trim();

    return (
      trimmedLine.length > 0 &&
      !trimmedLine.endsWith(':') &&
      (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•') || /^\d+\./.test(trimmedLine))
    );
  });
};

export const onAnswer = (conversation: Conversation, message: string, actionPlanItem: ActionPlanItem) => {
  console.log('onAnswer', actionPlanItem.intent, message);

  if (actionPlanItem.intent === 'time') {
    conversation.workshop.desiredOutcome = message;
  } else if (actionPlanItem.intent === 'participants') {
    conversation.workshop.duration = message;
  } else if (actionPlanItem.intent === 'title') {
    conversation.workshop.participantCount = message;
  } else if (actionPlanItem.intent === 'confirmation') {
    conversation.workshop.titleInformation = message;
  }

  conversation.currentStep = conversation.currentStep + 1;
};

export const usePositiveResponse = () => {
  const { build } = useBuildMiroBoard();
  const [isLoading, setIsLoading] = useState(false);

  const onPositive = async (conversation: Conversation, message: string, actionPlanItem: ActionPlanItem) => {
    console.log('onPositive', conversation, message, actionPlanItem);
    if (actionPlanItem.intent === 'confirmation') {
      conversation.currentStep = conversation.currentStep + 1;
    } else if (actionPlanItem.intent === 'title') {
      conversation.currentStep = conversation.currentStep + 1;
    } else if (actionPlanItem.intent === 'agenda') {
      const relevantLines = findRelevantLines(message);
      console.log('relevantLines', relevantLines);

      const newPlanItems = relevantLines.map((line: string) => {
        return createAgendaItem(line);
      });

      conversation.additionalPlanItems = newPlanItems;
      conversation.currentStep = conversation.currentStep + 1;

      console.log('agenda item', newPlanItems);
    } else if (actionPlanItem.intent === 'detailed_agenda') {
      const relevantLines = findRelevantLines(message);
      console.log('relevantLines', relevantLines);

      const newPlanItems = relevantLines.map((line: string) => {
        return createDetailedAgendaItem(line);
      });

      const cleanIndex = conversation.currentStep - defaultPlan.length;
      console.log('Clean', cleanIndex);
      LocalStorageStore.getInstance().set('currentRowIndex', cleanIndex);
      conversation.additionalPlanItems.splice(cleanIndex + 1, 0, ...newPlanItems);

      conversation.currentStep = conversation.currentStep + 1;
    } else if (actionPlanItem.intent === 'create_boards') {
      // we are ceating the boards here
      console.log('msg', message);

      const newMessage = `
    You are a smart agent that is capable of finding the right function for the desired task. 
    You will get instructions for building boards, frames or panes along with functions that you can call.
    You can choose between 
    - an agenda item board, which displays the aganda along with the goals if the current topic
    - a single pane frame, which is suitable for a single activity
    - a two pane frame, which is suitable for an activity that needs more explanation or has a companion activity (i.e. explaining some theory on that matter)
    You must decide for a function to call and find the right arguments to pass to the function based on the following instructions:
    ${message}
    `;

      console.log('newMessage', newMessage);

      try {
        setIsLoading(true);
        await build({ message: newMessage, rowIndex: LocalStorageStore.getInstance().get('currentRowIndex') });
        conversation.currentStep = conversation.currentStep + 1;
        console.log('hjfkfhdjk');
      } catch (error) {
        await miro.board.notifications.showError('Error while building boards');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    onPositive,
    isLoading,
  };
};

export const useNegativeResponse = () => {
  const onNegative = async (conversation: Conversation, message: string, actionPlanItem: ActionPlanItem) => {
    console.log('onNegative', conversation, message, actionPlanItem);

    if (actionPlanItem.intent === 'confirmation') {
      conversation.currentStep = 0;
    }
  };

  return {
    onNegative,
  };
};

export const defaultPlan: Omit<ActionPlanItem, 'userAnswer'>[] = [
  {
    instruction: 'Ask the user what the desired outcome of the workshop is',
    type: 'question',
    intent: 'outcome',
  },
  {
    instruction: 'Ask how much time the user has for the workshop?',
    type: 'question',
    intent: 'time',
  },
  {
    instruction: 'Ask how many participants are there?',
    type: 'question',
    intent: 'participants',
  },
  {
    instruction: 'Summarize your current knowledege about the workshop and ask if the user wants to continue or start over',
    type: 'confirmation',
    intent: 'confirmation',
    negativeCaption: 'Start over',
    positiveCaption: 'Continue',
  },
  {
    instruction:
      'Create an engaging title for the workshop based on your current knowledge and ask if the user want to go with the create title',
    type: 'confirmation',
    intent: 'title',
    negativeCaption: 'Create new',
    positiveCaption: 'Use this title',
  },
  {
    instruction:
      'Create an agenda for the workshop based on your current knowledge and ask if the user want to go with the create agenda. The agenda should be a bullet point list. Each bullet point should only contain the name of the topic with no explanation. Tell him that you want to tackle each topic one by one with him after this. There should not be more than 5 bullet points',
    type: 'confirmation',
    intent: 'agenda',
    negativeCaption: 'Create new',
    positiveCaption: 'Use agenda',
  },
];

export const buildEmptyPlan = (): ActionPlan => ({
  items: defaultPlan.map(item => ({ ...item, userAnswer: [] })),
  currentStep: 0,
});
