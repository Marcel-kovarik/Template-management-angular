import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignService } from '../../../services/campaign.service';
import { NewCampaignComponent } from '../../../components/new-campaign/new-campaign.component';
import { Campaign } from '../../../classes/campaign';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';
import { Creation } from '../../../classes/creation';
import { CreationService } from '../../../services/creation.service';
import { CreationTypePipe } from '../../../pipes/creation-type.pipe';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [CreationTypePipe]
})
export class ListComponent implements OnInit, OnDestroy {

  openActionListId: any = false;
  listenerFn: () => void;
  closeResult: string;
  campaignForm: FormGroup;
  campaigns: Campaign[] = [];

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private alertService: AlertService,
    private dialogService: DialogService,
    private creationService: CreationService,
    private creationTypePipe: CreationTypePipe,
    private campaignService: CampaignService) {
    this.campaignForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCampaignList();
    this.listenerFn = this.renderer.listen(document, 'click', (event) => {
      if (!event.target.closest('.card-action-btn')) {
        this.openActionListId = null;
      }
    });
  }

  getCampaignList(): void {
    // Retrieve data form services
    this.campaignService.getAllCampaigns().subscribe( campaigns => {
      this.campaigns = campaigns;
    });
  }

  deleteCampaign(campaign: Campaign): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_CAMPAIGN'))
      .then(resp => {
        if (resp) {
          this.campaignService.deleteCampaignById(campaign.id).subscribe( serverState => {
            if (serverState.ok === true) {
                this.alertService.success(this.translate.instant('ALERTS.CAMPAIGN_DELETE'), {autoClose: true});
                this.getCampaignList();
            } else {
                this.alertService.error(this.translate.instant('ALERTS.CAMPAIGN_DELETE_FAIL'));
            }
          });
        }
      })
      .catch();
  }

  duplicateCampaign(campaign: Campaign): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DUPLICATE_CAMPAIGN'))
      .then(resp => {
        if (resp) {
          const data = {
            id: campaign.id,
            name: this.translate.instant('COPY') + ' ' + campaign.name
          };
          this.campaignService.duplicateCampaign(data).subscribe( newCampaign => {
            if (Object.keys(newCampaign).length > 0) {
              this.getCampaignList();
            }
          });
        }
      })
      .catch();
  }

  gotoCreation(campaign: Campaign, creation: Creation): void {
    // Set current campaign & current creation...
    this.campaignService.getCampaignById(campaign.id).subscribe(() => {
      this.creationService.getCreationById(creation.id).subscribe(() => {
        // ...then navigate to page
        this.router.navigate([this.creationTypePipe.transform(creation.creationType, 'route')]);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  openActionList(id: number): void {
    this.openActionListId = this.openActionListId ? false : id;
  }

  openModal(): void {
    this.modalService.open(NewCampaignComponent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      if (reason === ModalDismissReasons.ESC) {
        this.closeResult =  'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        this.closeResult =  'by clicking on a backdrop';
      } else {
        this.closeResult =  `with: ${reason}`;
      }
    });
  }
}
