export class TextSection {
  text: string;
  audName: string;
  audSrc: string;
  defaultStopWords?: any;
  stopWords?: [string];
  textToAudio?: string;
  type?: string;
  key?: string;

  constructor(init?: Partial<TextSection>) {
    Object.assign(this, init);
  }
}
