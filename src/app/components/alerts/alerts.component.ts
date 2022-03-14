import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Alert, AlertType } from '../../classes/alert';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html'
})
export class AlertsComponent implements OnInit, OnDestroy {

  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    // Subscribe to new alert notification
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        if (!alert.message) {
          // Remove alerts without `keepAfterRouteChange` flag
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
          // and remove `keepAfterRouteChange` flag on others
          this.alerts.forEach(x => delete x.keepAfterRouteChange);
          return;
        }

        // Push new alert into array
        this.alerts.push(alert);

        if (!alert.autoClose) {
          return;
        }
        setTimeout(() => this.removeAlert(alert), 3000);
      });

    // Clear on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    if (!this.alerts.includes(alert)) { return; }

    if (!this.fade) {
      this.alerts = this.alerts.filter(x => x !== alert);
    } else {
      this.alerts.find(x => x === alert).fade = true;
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
      }, 500);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) { return; }

    const classes = ['alert', 'alert-dismissable', 'container'];
    const alertTypeClass = {
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-danger',
      [AlertType.Info]: 'alert alert-info',
      [AlertType.Warning]: 'alert alert-warning'
    };
    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('face');
    }
    return classes.join(' ');
  }
}
