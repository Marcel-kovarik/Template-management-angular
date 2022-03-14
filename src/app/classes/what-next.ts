import { WhatNextAnswer } from './what-next-answer';

export class WhatNext {
  title = 'WHAT_NEXT.TITLE';
  message: string;
  answers: WhatNextAnswer[];
  size = 'sm';

  constructor(init?: Partial<WhatNext>) {
    Object.assign(this, init);
  }
}
