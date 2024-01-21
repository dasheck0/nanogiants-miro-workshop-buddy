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

export const createTwoPaneItemFunction: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function = {
  name: 'createTwoPaneItem',
  description:
    'Create miro elements for a two pane frame. The frame consists of two panes. In the panes are descriptions and texts that further explain what is going on in these panes.',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the frame',
      },
      durationInMinutes: {
        type: 'number',
        description: 'Duration of the activities planned for this frame in minutes',
      },
      description: {
        type: 'string',
        description: 'Describes what this frame is about and what the user tries to achieve with this',
      },
      leftPaneTitle: {
        type: 'string',
        description: 'The title of the activity that is meant to be done in the left pane',
      },
      leftPaneDescription: {
        type: 'string',
        description: 'The description of the activity that is meant to be done in the left pane',
      },
      rightPaneTitle: {
        type: 'string',
        description: 'The title of the activity that is meant to be done in the right pane',
      },
      rightPaneDescription: {
        type: 'string',
        description: 'The description of the activity that is meant to be done in the right pane',
      },
    },
    required: [
      'title',
      'description',
      'durationInMinutes',
      'leftPaneTitle',
      'leftPaneDescription',
      'rightPaneTitle',
      'rightPaneDescription',
    ], // All properties are required
  },
};

export const createSinglePaneItemFunction: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function = {
  name: 'createSinglePaneItem',
  description:
    'Create miro elements for a single pane frame. The frame consists of one pane. In the pane is a description and text that further explain what is going on in this pane.',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the frame',
      },
      durationInMinutes: {
        type: 'number',
        description: 'Duration of the activities planned for this frame in minutes',
      },
      description: {
        type: 'string',
        description: 'Describes what this frame is about and what the user tries to achieve with this',
      },
      paneTitle: {
        type: 'string',
        description: 'The title of the activity that is meant to be done in the pane',
      },
      paneDescription: {
        type: 'string',
        description: 'The description of the activity that is meant to be done in the pane',
      },
    },
    required: ['title', 'description', 'durationInMinutes', 'paneTitle', 'paneDescription'], // All properties are required
  },
};
