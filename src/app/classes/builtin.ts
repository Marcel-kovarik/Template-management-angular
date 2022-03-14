import { BuiltinOption } from './builtin-option';

export class Builtin {
  nodeBuiltinCode: string;
  nodeBuiltinLabel: string;
  nodeBuiltinOptions: BuiltinOption[];
  help: string;

  constructor(init?: Partial<Builtin>) {
    Object.assign(this, init);

  }
}

