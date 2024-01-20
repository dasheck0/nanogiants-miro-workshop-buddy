export type ActionType = 'question' | 'confirmation';

export interface ActionPlanItem {
  type: ActionType;
  instruction: string;
  userAnswer: string[];
}

export interface ActionPlan {
  items: ActionPlanItem[];
  currentStep: number;
}

export const emptyPlan: Omit<ActionPlanItem, 'userAnswer'>[] = [
  {
    instruction: 'Ask the user what the desired outcome of the workshop is',
    type: 'question',
  },
  {
    instruction: 'Ask how much time the user has for the workshop?',
    type: 'question',
  },
  {
    instruction: 'Ask how many participants are there?',
    type: 'question',
  },
  {
    instruction: 'Summarize your current knowledege about the workshop and ask if the user wants to continue or start over',
    type: 'confirmation',
  },
];

export const buildEmptyPlan = (): ActionPlan => ({
  items: emptyPlan.map(item => ({ ...item, userAnswer: [] })),
  currentStep: 0,
});

export const questions: string[] = [
  'What is the desired outcome of your workshop?',
  'How much time do you have for your workshop?',
  'How many participants do you have?',
];
