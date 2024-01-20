import { StructuredOutputParser } from 'langchain/output_parsers';
import OpenAI from 'openai';
import { z } from 'zod';
import { Workshop, tools, updateWorkshop } from '../dtos/workshop.dto';
import { LocalStorageStore } from '../store';

export interface WorkshopCompletionProps {
  workshop: Workshop;
  userQuestion: string;
  userPrompt: string;
  openaiClient: OpenAI;
}

export const useWorkshopCompletion = () => {
  const completeWorkshop = async (props: WorkshopCompletionProps): Promise<Workshop | null> => {
    const outputParser = StructuredOutputParser.fromZodSchema(
      z
        .array(
          z.object({
            fields: z.object({
              Name: z.string().describe('The name of the country'),
              Capital: z.string().describe("The country's capital"),
            }),
          }),
        )
        .describe('An array of Airtable records, each representing a country'),
    );

    const availableFunctions: OpenAI.Chat.Completions.ChatCompletionTool[] = tools;

    const response = await props.openaiClient.chat.completions.create({
      messages: [
        {
          content: `
          The user was asked to provided some information about his or her workshop.
          The question was: "${props.userQuestion}".
          The user replied with: "${props.userPrompt}".
          Set title or duration of the workshop.
          If the users answer does not contain any information relevant to the workshop, do not set anything`,
          role: 'system',
        },
      ],
      tool_choice: 'auto',
      tools: availableFunctions,
      temperature: 0.5,
      model: 'gpt-4-0613',
    });

    try {
      const isToolCall = response.choices[0].finish_reason === 'tool_calls';
      const currentWorkshop = LocalStorageStore.getInstance().get('conversations')[0].workshop;

      console.log('workshop response', response);
      console.log('is function call', isToolCall);

      if (isToolCall) {
        const tools = response.choices[0].message.tool_calls;
        const updatedWorkshop = updateWorkshop(currentWorkshop, tools);

        const conversations = LocalStorageStore.getInstance().get('conversations');
        conversations[0].workshop = updatedWorkshop;

        LocalStorageStore.getInstance().set('conversations', conversations);
        console.log('updated con', conversations);
        console.log('done completing workshop', response);

        return updatedWorkshop;
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  return {
    completeWorkshop,
  };
};
