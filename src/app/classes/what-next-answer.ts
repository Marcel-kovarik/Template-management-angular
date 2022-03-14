export class WhatNextAnswer {
  text: string;
  route: string;

  constructor(init?: Partial<WhatNextAnswer>) {
    Object.assign(this, init);
  }
}
