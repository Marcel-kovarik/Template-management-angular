export class Voice {
  id: number;
  applicationType: string;
  gender: string;
  languageCode: string;
  neuralVoice: boolean;
  standardVoice: boolean;
  voiceId: string;
  defaultVoice: boolean;

  constructor(init?: Partial<Voice>) {
    Object.assign(this, init);
  }
}
