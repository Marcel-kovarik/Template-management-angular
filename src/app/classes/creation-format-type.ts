
export class CreationFormatType {
  type: string;
  text: string;
  icon: string;
  display: boolean;

  constructor(init?: Partial<CreationFormatType>) {
    Object.assign(this, init);
  }
}
