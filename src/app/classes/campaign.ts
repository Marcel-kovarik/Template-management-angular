import { Creation } from './creation';

export class Campaign {
  id: number;
  organisationId: number;
  name: string;
  creation: Creation[];

  constructor(init?: Partial<Campaign>) {
    Object.assign(this, init);
  }
}
