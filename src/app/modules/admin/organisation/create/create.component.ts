import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Organisation} from '../../../../classes/organisation';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../services/user.service';
import {OrganisationService} from '../../../../services/organisation.service';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from '../../../../services/alert.service';
import {ServerState} from '../../../../classes/server-state';
import { PersistenceService } from '../../../../services/persistence.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  organisation: Organisation;
  editing = true;
  newOrganisationForm: FormGroup;
  loading = true;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private organisationService: OrganisationService,
              private persistenceService: PersistenceService,
              private formBuilder: FormBuilder,
              private translate: TranslateService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.userService.user.subscribe(user => {
      if (!(user.userType === 'INTERNE')) {
        this.router.navigate(['home']);
      }
    }).unsubscribe();
    this.editing = this.router.url === '/admin/organisation/edit';
    if (this.editing) {
      this.organisation = this.organisationService.organisationModified;
      if (!this.organisation) {
        const idOrganisation = parseInt(this.persistenceService.getItem('organisationModified'), 10);
        this.organisationService.getOrganisationById(idOrganisation).subscribe(element => {
          this.organisation = element;
          this.createForm();
        });
      } else {
        this.createForm();
      }
    } else {
      this.organisation = new Organisation();
      this.createForm();
    }


  }

  newOrganisation(): void {
    if (this.newOrganisationForm.valid) {
      this.organisation.name = this.newOrganisationForm.get('name').value;
      this.newOrganisationForm.reset();
      if (this.editing) {
        this.organisationService.updateOrganisation(this.organisation).subscribe(element => {
          this.router.navigate(['admin/organisation/list']);
          const serverState = element as unknown as ServerState;
          if (serverState.ok === true) {
            this.alertService.success(this.translate.instant('ALERTS.ORGANISATION_UPDATE'), {autoClose: true});
          } else {
            this.alertService.error(this.translate.instant('ALERTS.ORGANISATION_UPDATE_FAIL'), {autoClose: true});
          }
        });
      } else {
        this.organisationService.newOrganisation(this.organisation).subscribe(element => {
          this.router.navigate(['admin/organisation/list']);
          const serverState = element as unknown as ServerState;
          if (serverState.ok === true) {
            this.alertService.success(this.translate.instant('ALERTS.ORGANISATION_CREATION'), {autoClose: true});
          } else {
            this.alertService.error(this.translate.instant('ALERTS.ORGANISATION_CREATION_FAIL'), {autoClose: true});
          }
        });
      }
    }
  }

  changeLogo(event): void {
    const image = event.target.files[0];
    const reader = new FileReader();
    const me = this;
    reader.readAsDataURL(image);
    reader.onload = () => {
      me.organisation.base64logo = reader.result.toString();
    };

  }

  private createForm(): void {
    this.newOrganisationForm = this.formBuilder.group({
      name: [this.organisation.name, Validators.required],
      base64logo: ['']
    });
    this.loading = false;
  }

}
