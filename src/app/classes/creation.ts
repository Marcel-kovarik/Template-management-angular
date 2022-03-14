import { CreationFormat } from './creation-format';
import { Conversation } from './conversation';

export class Creation {
  id: number;
  name: string;
  creationType: string;   // CREAPUB | ASSISTANT | VOICECOMM | SPC'
  state: number; // BITWISE
  conversation: Conversation;
  formats: CreationFormat[];
  idCampaign: number;

  constructor(init?: Partial<Creation>) {
    // if (init !== undefined && !('state' in init)) {
    //   init.state = 1;
    // }
    Object.assign(this, init);
  }
}
