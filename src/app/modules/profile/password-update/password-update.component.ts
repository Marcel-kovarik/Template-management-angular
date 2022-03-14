import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { IdenticalValidator } from '../../../validators/identical.validator';
import { UserService } from '../../../services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.scss']
})
export class PasswordUpdateComponent implements OnInit {

  form: FormGroup;
  submitting = false;
  submitted = false;
  displayPasswords = {
    old: false,
    new: false,
    repeat: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]]
    }, {validators: IdenticalValidator(['newPassword', 'repeatPassword'])});
  }

  get f(): any {
    return this.form.controls;
  }

  submit(): void {
    this.submitting = this.submitted = true;

    if (this.form.invalid) {
      this.submitting = false;
      return;
    }

    const data = this.form.getRawValue();
    delete data.repeatPassword;
    this.userService.updatePassword(data).subscribe(result => {
      if (result.code === 'PASSWORD_UPDATED') {
        this.alertService.success(this.translate.instant(`ALERTS.${result.code}`), {autoClose: true});
      } else {
        this.alertService.error(this.translate.instant(`ALERTS.${result.code}`), {autoClose: true});
      }
      this.submitting = false;
    });
  }

  toggleInputDisplay(key: string): void {
    this.displayPasswords[key] = this.displayPasswords[key] ? false : true;
  }

}
