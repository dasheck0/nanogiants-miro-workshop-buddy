import OpenAI from 'openai';

// export const createAgendaItem: OpenAI.Chat.Completions.ChatCompletionTool = {
//   type: 'function',
//   function: {
//     name: 'createAgendaItem',
//     description: 'Create miro elements for an agenda item',
//     parameters: {
//       type: 'object',
//       properties: {
//         title: {
//           type: 'string',
//           description: 'Title of the agenda item',
//         },
//         description: {
//           type: 'string',
//           description: 'Description of the agenda item',
//         },
//         desiredOutcome: {
//           type: 'string',
//           description: 'Desired outcome of the agenda item',
//         },
//         durationInMinutes: {
//           type: 'number',
//           description: 'Duration of the agenda item in minutes',
//         },
//       },
//       required: ['title', 'description', 'desiredOutcome', 'durationInMinutes'], // All properties are required
//     },
//   },
// };

export const createAgendaItemFunction: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function = {
  name: 'createAgendaItem',
  description: 'Create miro elements for an agenda item',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the agenda item',
      },
      description: {
        type: 'string',
        description: 'Description of the agenda item',
      },
      desiredOutcome: {
        type: 'string',
        description: 'Desired outcome of the agenda item',
      },
      durationInMinutes: {
        type: 'number',
        description: 'Duration of the agenda item in minutes',
      },
    },
    required: ['title', 'description', 'desiredOutcome', 'durationInMinutes'], // All properties are required
  },
};
