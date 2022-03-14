
export class CreationFormat {
  id: number;
  name: string;
  state: number; // BITWISE
  idFormatType: number;

  constructor(init?: Partial<CreationFormat>) {
    Object.assign(this, init);
  }
}
