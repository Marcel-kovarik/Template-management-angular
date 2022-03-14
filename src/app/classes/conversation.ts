import { ConversationVersion } from './conversation-version';

export class Conversation {
  id: number;
  code: string;
  author: string;
  name: string;
  state: number; // BITWISE
  url: string;
  languageCode: string;
  creationDate: string;
  organisationId: string;
  version: ConversationVersion[];

  constructor(init?: Partial<Conversation>) {
    Object.assign(this, init);
  }
}
