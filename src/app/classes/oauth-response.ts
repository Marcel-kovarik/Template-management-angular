import { Organisation } from './organisation';
import { User } from './user';

export class OauthResponse {
  organisations: Organisation[];
  user: User;
  token: string;

  constructor(init?: Partial<OauthResponse>) {
    Object.assign(this, init);
  }

}
