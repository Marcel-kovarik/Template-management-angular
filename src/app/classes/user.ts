import {Organisation} from './organisation';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  firstNameLastName: string;
  email: string;
  userType: string;
  organisations: Organisation[];
  currentOrganisation: number;
  position: string;
  teamService: string;
  avatar: string;
  token: string;
  locale: any;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
