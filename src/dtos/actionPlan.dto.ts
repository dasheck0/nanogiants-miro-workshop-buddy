import { Conversation } from './chat.dto';

export type ActionType = 'question' | 'confirmation';
export type ActionIntent = 'outcome' | 'time' | 'participants' | 'confirmation' | 'title' | 'agenda';

export interface ActionPlanItem {
  type: ActionType;
  instruction: string;
  intent: ActionIntent;
  onPositive?: (conversation: Conversation) => void;
  positiveCaption?: string;
  onNegative?: (conversation: Conversation) => void;
  negativeCaption?: string;
}

export interface ActionPlan {
  items: ActionPlanItem[];
  currentStep: number;
}

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
    onNegative: conversation => {
      conversation.currentStep = 0;
    },
    onPositive: conversation => {
      conversation.currentStep = 4;
    },
  },
  {
    instruction:
      'Create an engaging title for the workshop based on your current knowledge and ask if the user want to go with the create title',
    type: 'confirmation',
    intent: 'title',
    negativeCaption: 'Create new',
    positiveCaption: 'Use this title',
    onNegative: conversation => {
      conversation.currentStep = 4;
    },
    onPositive: conversation => {
      conversation.currentStep = 5;
    },
  },
  {
    instruction:
      'Create an agenda for the workshop based on your current knowledge and ask if the user want to go with the create agenda. The agenda should be a bullet point list. Each bullet point should only contain the name of the topic with no explanation. Tell him that you want to tackle each topic one by one with him after this.',
    type: 'confirmation',
    intent: 'agenda',
    negativeCaption: 'Create new',
    positiveCaption: 'Use agenda',
    onNegative: conversation => {
      conversation.currentStep = 5;
    },
    onPositive: conversation => {
      conversation.currentStep = 6;
    },
  },
];

export const buildEmptyPlan = (): ActionPlan => ({
  items: defaultPlan.map(item => ({ ...item, userAnswer: [], onNegative: item.onNegative, onPositive: item.onPositive })),
  currentStep: 0,
});
