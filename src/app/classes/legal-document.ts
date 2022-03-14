export class LegalDocument {
  id: number;
  cleS3: string;
  creationDate: string;
  jsonData: string;
  language: string;
  label: string;
  source: string;
  typeDocument: string;
  url: string;
  use: string;
  base64Data: string;

  constructor(init?: Partial<LegalDocument>) {
    Object.assign(this, init);
  }
}
