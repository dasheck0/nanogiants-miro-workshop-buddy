import { ActionPlanItem } from './actionPlan.dto';
import { Workshop } from './workshop.dto';

export interface ChatMessage {
  uuid: string;
  message: string;
  timestamp: string;
  isBotMessage: boolean;
  actionItem?: ActionPlanItem;
  answeredByUser?: string;
}

export interface Conversation {
  uuid: string;
  currentStep: number;
  messages: ChatMessage[];
  workshop: Workshop;
}
