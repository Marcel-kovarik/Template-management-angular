import { FormatType } from './format-type';
import { FormatSpec } from './format-spec';
import { Resource } from './resource';

export class Format {
  id: number;
  name: string;
  state: number; // BITWISE
  idCampaign: number;
  idCreation: number;
  type: FormatType;
  formatSpec: FormatSpec;
  resource: Resource[];
  iframeTag: string;
  asyncTag: string;
  syncTag: string;

  constructor(init?: Partial<Format>) {
    // if (init !== undefined && !('state' in init)) {
    //   init.state = 'INIT';
    // }
    Object.assign(this, init);
  }
}

