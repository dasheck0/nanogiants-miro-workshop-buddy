import { Workshop } from './workshop.dto';

export interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
  icon: string;
  isBotMessage: boolean;
}

export interface Conversation {
  uuid: string;
  messages: ChatMessage[];
  workshop: Workshop;
}
