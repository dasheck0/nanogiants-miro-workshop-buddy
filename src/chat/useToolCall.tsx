import OpenAI from 'openai';

export interface ToolCallProps {
  prompt: string;
  openAIClient: OpenAI;
  tools: OpenAI.Chat.Completions.ChatCompletionTool[];
  functions: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function[];
  onToolsInvoked: (tools: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]) => void;
  onFunctionInvoked: (functionCall: OpenAI.Chat.Completions.ChatCompletionMessage.FunctionCall) => void;
  onRegularInocation: (message: OpenAI.Chat.Completions.ChatCompletionMessage) => void;
  forceTool?: string;
}

export const useToolCall = () => {
  const invokeTool = async (props: ToolCallProps) => {
    console.log('start');

    const response = await props.openAIClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: props.prompt,
        },
      ],
      // tool_choice: props.forceTool ? { type: 'function', function: { name: props.forceTool } } : 'auto',
      // tools: props.tools,
      functions: props.functions,
      function_call: props.forceTool ? { name: props.forceTool } : 'auto',
      temperature: 0.5,
      model: 'gpt-4-1106-preview',
    });

    try {
      console.log(response);
      // const isToolCalled = response.choices[0].finish_reason === 'tool_calls';
      // console.log('isToolCalled', isToolCalled);

      // if (isToolCalled) {
      //   const tools = response.choices[0].message.tool_calls;
      //   if (tools) {
      //     props.onToolsInvoked(tools);
      //   }
      // }

      const functionCall = response.choices[0].message.function_call;

      if (functionCall) {
        props.onFunctionInvoked(functionCall);
      } else {
        props.onRegularInocation(response.choices[0].message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    invokeTool,
  };
};
