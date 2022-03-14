import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Campaign } from '../../../classes/campaign';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignService } from '../../../services/campaign.service';
import { CreationService } from '../../../services/creation.service';
import { Router } from '@angular/router';
import { CreationTypePipe } from '../../../pipes/creation-type.pipe';
import { TranslateService } from '@ngx-translate/core';
import { Crumb } from '../../../interfaces/crumb';
import { AlertService } from '../../../services/alert.service';
import { PersistenceService } from '../../../services/persistence.service';
import { CreationFormatType } from '../../../classes/creation-format-type';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [CreationTypePipe]
})
export class EditComponent implements OnInit, OnDestroy {

  campaignName = new FormControl();

  newCreationForm: FormGroup;
  newCreationSubmitted = false;
  editing = false;
  openCreationEdit = 0;
  listenerFn: () => void;

  campaign: Campaign;

  closeResult = '';

  crumbs: Crumb[] = [];

  displayTypeChoice = false;
  availableTypes: CreationFormatType[] = [
    new CreationFormatType({type: 'CREAPUB', text: 'CREAPUB', icon: 'icon-crea_pub', display: true}),
    new CreationFormatType({type: 'ASSISTANT', text: 'ASSISTANT_APPS', icon: 'icon-assistants', display: false}),
    new CreationFormatType({type: 'VOICECOMM', text: 'VOICE_COMMERCE', icon: 'icon-voicecomm2', display: false}),
    new CreationFormatType({type: 'SPC', text: 'SPEAK_COLLECT', icon: 'icon-speak', display: false})
  ];

  constructor(
    private modalService: NgbModal,
    private campaignService: CampaignService,
    private creationService: CreationService,
    private persistenceService: PersistenceService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private alertService: AlertService,
    private dialogService: DialogService,
    private creationTypePipe: CreationTypePipe) {
  }

  ngOnInit(): void {
    this.campaign = this.campaignService.getCurrentCampaign();
    // redirect if no campaign
    if (Object.keys(this.campaign).length === 0) {
      this.router.navigate(['campaigns/list']);
    }

    this.updateCampaignName(this.campaign.name);

    // Configure new format type choice in creation form
    const test = this.availableTypes.filter(e => e.display);
    this.displayTypeChoice = test.length > 1;

    // Prepare Form values for new creation
    this.newCreationForm = this.formBuilder.group({
      campaignId: [this.campaign.id],
      name: ['', Validators.required],
      creationType: [(test.length === 1 ? test[0].type : ''), Validators.required]
    });

    // Add listener to close actions Poppins
    this.listenerFn = this.renderer.listen(document, 'click', (event) => {
      if (!event.target.closest('.card-action-btn')) {
        this.openCreationEdit = 0;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  openEdit(id: number): void {
    this.openCreationEdit = this.openCreationEdit ? 0 : id;
  }

  editAction(id: number): void {
    // Get selected creation by id
    const creation = this.campaign.creation.filter( e => {
      return e.id === id;
    });
    // ...set it as current and reset action opener
    this.creationService.getCreationById(creation[0].id).subscribe(() => {
      this.openCreationEdit = 0;
      this.router.navigate([this.creationTypePipe.transform(creation[0].creationType, 'route')]).then();
    });
  }

  delete(id: number): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_CREATION'))
      .then( confirm => {
        if (confirm) {
          this.creationService.delete(id).subscribe( resp => {
            if (resp.ok === true) {
              this.alertService.success(this.translate.instant('ALERTS.CREATION_DELETED'), {autoClose: true});
              this.campaignService.getCampaignById(this.campaign.id).subscribe(campaign => {
                this.campaignService.setCurrentCampaign(campaign);
                this.campaign = campaign;
              });
            } else {
              this.alertService.error(this.translate.instant('ALERTS.CREATION_DELETE_FAIL'));
            }
          });
        }
        this.openCreationEdit = 0;
      })
      .catch();
  }

  /****** Creat new Creator ******/
  newCreation(): void {
    this.newCreationSubmitted = true;
    // stop here if form is invalid
    if (this.newCreationForm.invalid) {
      return;
    }

    // True if all the fields are filled
    if (this.newCreationSubmitted) {
      this.modalService.dismissAll('modal close');
      const values = this.newCreationForm.getRawValue();
      this.creationService.create(values).subscribe(creation => {
        this.creationService.setCurrentCreation(creation);
        this.campaignService.updateCurrentCampaign();
        const route = this.creationTypePipe.transform(values.creationType, 'route');
        this.router.navigate([route]).then();
      });
    }
  }

  focusIn(): void {
    this.editing = true;
  }

  updateOrClose(name: any, close: boolean): void {
    if (!close) {
      // Update campaign name
      this.campaignService.update({name: this.campaignName.value, id: this.campaign.id})
        .subscribe( campaign => {
          if (campaign) {
            this.alertService.success(this.translate.instant('ALERTS.CAMPAIGN_UPDATE'), {autoClose: true});
            this.campaignService.updateCurrentCampaign();
            this.updateCampaignName(campaign.name);
          } else {
            this.alertService.error(this.translate.instant('ALERTS.CAMPAIGN_UPDATE_FAIL'));
          }
        });
    } else {
      // Reset campaign name
      this.updateCampaignName(this.campaign.name);
    }
    this.editing = false;
  }

  /****** open modal ******/
  openModal(content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /****** modal close ******/
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private updateCampaignName(campaignName: string): void {
    this.campaignName.setValue(campaignName);
    this.crumbs = [
      { route: '', text: campaignName }
    ];
  }

}
