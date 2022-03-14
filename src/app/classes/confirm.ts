
export class Confirm {
  title = 'CONFIRM.TITLE';
  message: string;
  okButton = 'BUTTONS.YES';
  cancelButton = 'BUTTONS.NO';
  size = 'sm';

  constructor(init?: Partial<Confirm>) {
    Object.assign(this, init);
  }
}
