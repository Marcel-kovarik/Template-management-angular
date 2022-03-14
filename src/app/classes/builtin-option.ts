import { ListValue } from './list-value';

export class BuiltinOption {
  codeOption: string;
  labelOption: string;
  typeDataOption: string;
  required: boolean;
  requiredTechnical: boolean;
  displayOrderOption: number;
  help: string;
  defaultValue: string;
  listValue: ListValue[];

  constructor(init?: Partial<BuiltinOption>) {
    Object.assign(this, init);

  }
}
