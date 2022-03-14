export class Organisation {
  id: number;
  name: string;
  nbUser: number;
  logo: string;
  base64logo: string;

  constructor(init?: Partial<Organisation>) {
    Object.assign(this, init);
  }
}
