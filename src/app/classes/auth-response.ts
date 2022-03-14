import { Organisation } from './organisation';
import { User } from './user';

export class AuthResponse {
  organisations: Organisation[];
  user: User;
  token: string;

  constructor(init?: Partial<AuthResponse>) {
    Object.assign(this, init);
  }
}
