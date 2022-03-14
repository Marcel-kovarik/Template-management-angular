import { AfterViewInit, ChangeDetectionStrategy, Component, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-in-with-google',
  template: '<div class="signin" [id]="id"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInWithGoogleComponent implements AfterViewInit {

  id = 'signin-google';

  @Input()
  clientId!: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private zone: NgZone
  ) { }

  ngAfterViewInit(): void {
    this.auth2Init();
  }

  private auth2Init(): void {
    if (this.clientId == null) {
      throw new Error(
        'clientId property is necessary. (<google-signin [clientId]="..."></google-signin>)');
    }

    (window as any).google.accounts.id.initialize({
      client_id: this.clientId,
      auto_select: false,
      callback: this.callback.bind(this)
    });

    (window as any).google.accounts.id.renderButton(document.getElementById(this.id),
      { theme: 'outline', size: 'large' });

  }

  callback(response: any): void {
    this.userService.googleCallBack(response).subscribe(value => {
      if (value) {
        this.zone.run(() => {
          this.router.navigate(['home']);
        });
      } else {
        this.zone.run(() => {
          this.alertService.error('Erreur connexion impossible.', { autoClose: true, fade: true });
        });
      }
    });
  }

}
