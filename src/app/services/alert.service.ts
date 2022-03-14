import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alert, AlertType } from '../classes/alert';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private  subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  // enable alert subscribing
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(
      filter(x => x && x.id === id)
    );
  }

  // Different class methods
  success(message: string, options?: any): void {
    this.alert(new Alert({...options, type: AlertType.Success, message}));
  }

  error(message: string, options?: any): void {
    this.alert(new Alert({...options, type: AlertType.Error, message}));
  }

  info(message: string, options?: any): void {
    this.alert(new Alert({...options, type: AlertType.Info, message}));
  }

  warn(message: string, options?: any): void {
    this.alert(new Alert({...options, type: AlertType.Warning, message}));
  }

  // Main alert methode
  alert(alert: Alert): void {
    alert.id = alert.id || this.defaultId;
    this.subject.next(new Alert(alert));
  }

  // Clear alerts
  clear(id = this.defaultId): void {
    this.subject.next(new Alert({ id }));
  }
}
