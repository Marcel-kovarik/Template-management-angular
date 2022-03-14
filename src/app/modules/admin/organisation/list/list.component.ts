import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from '../../../../services/alert.service';
import {Router} from '@angular/router';
import {Organisation} from '../../../../classes/organisation';
import {OrganisationService} from '../../../../services/organisation.service';
import {ServerState} from '../../../../classes/server-state';
import { DialogService } from '../../../../services/dialog.service';
import { PersistenceService } from '../../../../services/persistence.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  openActionListId: any = false;
  organisations: Organisation[] = [];

  constructor(private organisationService: OrganisationService,
              private translate: TranslateService,
              private dialogService: DialogService,
              private alertService: AlertService,
              private persistenceService: PersistenceService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getOrganisationList();
  }

  deleteOrganisation(element: any): void {
    const organisation = element as unknown as Organisation;
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_ORGANISATION'))
      .then(resp => {
        if (resp) {
          this.organisationService.deleteOrganisationById(organisation.id).subscribe((result) => {
            const serverState = result as unknown as ServerState;
            if (serverState.ok === true) {
              this.alertService.success(this.translate.instant('ALERTS.ORGANISATION_DELETE'), {autoClose: true});
              this.getOrganisationList();
            } else {
              this.alertService.error(this.translate.instant('ALERTS.ORGANISATION_DELETE_FAIL'));
            }

          });
        }
      })
      .catch(() => {
        this.alertService.error(this.translate.instant('ALERTS.ORGANISATION_DELETE_FAIL'));
      });
  }

  newOrganisation(): void {
    this.router.navigate(['admin/organisation/create']).then();
  }

  editOrganisation(element: any): void {
    this.organisationService.organisationModified = element as unknown as Organisation;
    this.persistenceService.setItem('organisationModified', (element as unknown as Organisation).id.toString());
    this.router.navigate(['admin/organisation/edit']).then();
  }

  openActionList(id: number): void {
    this.openActionListId = this.openActionListId ? false : id;
  }

  private getOrganisationList(): void {
    this.organisationService.getAllOrganisations().subscribe(organisations => {
      this.organisations = organisations;
    });
  }
}
