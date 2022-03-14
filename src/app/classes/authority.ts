export class Authority {
  authority: string;

  constructor(init?: Partial<Authority>) {
    Object.assign(this, init);
  }
}
