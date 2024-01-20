import OpenAI from 'openai';
import { Workshop } from '../dtos/workshop.dto';
import { LocalStorageStore } from '../store';

export interface PlanningProps {
  userPrompt: string;
  workshop?: Workshop;
  openaiClient: OpenAI;
}

export const usePlanning = () => {
  const plan = async (props: PlanningProps) => {
    const actionPlan = LocalStorageStore.getInstance().get('actionplan');
    const currentQuestion = actionPlan.items.find(item => item.userAnswer.length === 0);

    const content = `
    You are an expert when it comes to creating workshops in miro. You help the user to plan a workshop step by step. 
    For this you need to better understand what the users intentions are desired outcome is, what the starting point is and how much time the users has for conducting the workshop, in this order.
    If you don't know anything ask for the desired outcome. If you know the desired outcome ask for the starting point. If you know the starting point ask for the time available.    
    You only try to get one information at a time, to make it easier for the user.
    When you don't have enough information the next step is to ask the user questions in order to get the information. If you know enough the next step is to proceed with the planning.
    You already know the following information about the workshop: ${JSON.stringify(actionPlan)}.
       `;

    const response = await props.openaiClient.chat.completions.create({
      messages: [
        {
          content: content,
          role: 'system',
        },
      ],
      model: 'gpt-3.5-turbo-1106',
    });

    console.log('done planning', response);

    return response;
  };

  return {
    plan,
  };
};
