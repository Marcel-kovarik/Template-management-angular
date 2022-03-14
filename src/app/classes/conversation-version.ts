import { ConvFlowPack } from '../interfaces/convflow-models';

export class ConversationVersion {
  id: number;
  conversationId: number;
  name: string;
  code: string;
  state: number;
  version: string;
  voiceId: string;
  languageCode: string;
  representationModel: ConvFlowPack;

  constructor(init?: Partial<ConversationVersion>) {
    Object.assign(this, init);
  }
}

