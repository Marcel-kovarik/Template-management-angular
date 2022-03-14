export class ListValue {
  listValueCode: string;
  listValueLabel: string;

  constructor(init?: Partial<ListValue>) {
    Object.assign(this, init);

  }
}
