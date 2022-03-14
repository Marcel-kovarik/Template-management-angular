import { Observable } from 'rxjs';

export interface MyCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

