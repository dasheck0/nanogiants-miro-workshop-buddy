import OpenAI from 'openai';

export interface Workshop {
  title?: string;
  description?: string;
  goals?: string[];
  durationInMinutes?: number;
}

export const updateWorkshop = (workshop: Workshop, tools?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]): Workshop => {
  const copy = { ...workshop };

  console.log('rools', tools);

  tools?.forEach(tool => {
    const validTool = tools.find(t => t.function.name === tool.function.name);
    console.log('validTool', validTool);

    if (validTool) {
      try {
        const key = validTool.function.name.replace('set', '')[0].toLowerCase() + validTool.function.name.replace('set', '').slice(1);
        const args = JSON.parse(validTool.function.arguments);
        console.log('key', key, args[key as unknown as any], tool);

        (copy as any)[key] = args[key as unknown as any];
      } catch (error) {
        console.error(error);
      }
    }
  });

  console.log('returneding', copy);

  return copy;
};

const createStringTool = (name: string): OpenAI.Chat.Completions.ChatCompletionTool => ({
  type: 'function',
  function: {
    name: `set${name.charAt(0).toUpperCase() + name.slice(1)}`,
    description: `Sets the ${name} of the workshop`,
    parameters: {
      type: 'object',
      properties: {
        [name]: {
          type: 'string',
          format: 'string',
          description: `the ${name} of the workshop`,
        },
      },
    },
  },
});

const createNumberTool = (name: string): OpenAI.Chat.Completions.ChatCompletionTool => ({
  type: 'function',
  function: {
    name: `set${name.charAt(0).toUpperCase() + name.slice(1)}`,
    description: `Sets the ${name} of the workshop`,
    parameters: {
      type: 'object',
      properties: {
        [name]: {
          type: 'number',
          format: 'number',
          description: `the ${name} of the workshop`,
        },
      },
    },
  },
});

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  createStringTool('title'),
  createStringTool('description'),
  createNumberTool('durationInMinutes'),
];
