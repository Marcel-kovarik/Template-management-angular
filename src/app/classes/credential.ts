export class Credential {
  idUtilisateur: number;
  login: string;
  password: string;
  mode: string;

  constructor(init?: Partial<Credential>) {
    Object.assign(this, init);
  }
}
