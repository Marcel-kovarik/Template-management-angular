import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../classes/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../services/user.service';
import {OrganisationService} from '../../../../services/organisation.service';
import {Organisation} from '../../../../classes/organisation';
import {AlertService} from '../../../../services/alert.service';
import {TranslateService} from '@ngx-translate/core';
import {ServerState} from '../../../../classes/server-state';
import { PersistenceService } from '../../../../services/persistence.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  user: User;
  editing = true;
  allOrganisations: Organisation[];
  newUserForm: FormGroup;
  loading = true;
  userOrgsID: number[];

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
    this.editing = this.router.url === '/admin/user/edit';


    if (this.editing) {
      this.user = this.userService.userModified;
      if (!this.user) {
        const idUser = parseInt(this.persistenceService.getItem('userModified'), 10);
        this.userService.getUserById(idUser).subscribe(element => {
          this.user = element;
        });
      }
      this.organisationService.getAllOrganisations().subscribe(organisation => {
        this.allOrganisations = organisation;
        this.createForm();
      });
    } else {
      this.user = new User();
      this.organisationService.getAllOrganisations().subscribe(organisation => {
        this.allOrganisations = organisation;
        this.createForm();
      });
    }



  }

  newUser(): void {
    if (this.newUserForm.valid) {
      this.user.firstName = this.newUserForm.get('firstName').value;
      this.user.lastName = this.newUserForm.get('lastName').value;
      this.user.email = this.newUserForm.get('email').value;
      this.updateEntreprises();
      this.newUserForm.reset();
      if (this.editing) {
        this.userService.updateUser(this.user).subscribe(element => {
          this.router.navigate(['admin/user/list']);
          const serverState = element as unknown as ServerState;
          if (serverState.ok === true) {
            this.alertService.success(this.translate.instant('ALERTS.USER_UPDATE'), {autoClose: true});
          } else {
            this.alertService.error(this.translate.instant('ALERTS.USER_UPDATE_FAIL'), {autoClose: true});
          }
        });
      } else {
        // TODO: [BUILDER:213] Use the navigating locale value
        this.user.locale = 'en';
        this.userService.newUser(this.user).subscribe(element => {
          this.router.navigate(['admin/user/list']);
          const serverState = element as unknown as ServerState;
          if (serverState.ok === true) {
            this.alertService.success(this.translate.instant('ALERTS.USER_CREATION'), {autoClose: true});
          } else {
            this.alertService.error(this.translate.instant('ALERTS.USER_CREATION_FAIL'), {autoClose: true});
          }
        });
      }
    }


  }

  private updateEntreprises(): void {
    const idEntreprises: number[] = [];

    const linkedOrganisations = document.getElementsByClassName('linkedOrgs') as unknown as HTMLInputElement[];
    for (const org of linkedOrganisations) {
      if (org.checked) {
        idEntreprises.push(parseInt(org.value, 10));
      }
    }
    this.user.organisations = [];
    if (idEntreprises) {
      for (const idEntreprise of idEntreprises) {
        for (const entreprise of this.allOrganisations) {
          if (entreprise.id === idEntreprise) {
            this.user.organisations.push(entreprise);
          }
        }
      }
    }
  }

  private createForm(): void {
    if (this.user.organisations) {
      this.userOrgsID = this.user.organisations.map(element => {
        return element.id;
      });
    } else {
      this.userOrgsID = [];
    }

    this.newUserForm = this.formBuilder.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
    this.loading = false;
  }

}
