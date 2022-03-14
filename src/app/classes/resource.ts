export class Resource {
  id: number;
  content: string;
  url: string;
  settingsKey: string;
  formatSpecId: string;
  creationId: number;
  campagneId: number;
  organisationId: number;
  formatId: number;

  constructor(init?: Partial<Resource>) {
    Object.assign(this, init);
  }
}
