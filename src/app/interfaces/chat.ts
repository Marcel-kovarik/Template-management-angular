import { ChatSuggestion } from './chat-suggestion';

export interface Chat {
  text: string;
  class: string;
  suggestions?: ChatSuggestion[];
  element?: any;
  type?: string;
}
