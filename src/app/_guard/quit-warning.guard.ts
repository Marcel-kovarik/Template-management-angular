import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MyCanDeactivate } from '../interfaces/my-can-deactivate';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class QuitWarningGuard implements CanDeactivate<MyCanDeactivate> {
  constructor(private translate: TranslateService) {
  }
  canDeactivate(component: MyCanDeactivate): Observable<boolean> | boolean {
    return component.canDeactivate() ? true : confirm(this.translate.instant('ALERTS.QUIT_GUARD'));
  }
}
