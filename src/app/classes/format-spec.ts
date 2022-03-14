import { ResourceSpec } from './resource-spec';

export class FormatSpec {
  id: number;
  name: string;
  logo: string;
  description: string;
  code: string;
  creationType: string;
  formatType: string;
  resourceSpec: ResourceSpec[];

  constructor(init?: Partial<FormatSpec>) {
    Object.assign(this, init);
  }
}
