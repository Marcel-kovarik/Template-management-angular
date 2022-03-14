export class FormatSettings {
  id?: number;
  formatId?: number;
  key: string;
  type: string;
  value: string;
  field: string;
  updated?: boolean;

  constructor(init?: Partial<FormatSettings>) {
    this.updated = false;
    Object.assign(this, init);
  }
}
