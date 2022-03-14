import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormatSpec } from '../../../../classes/format-spec';
import { Campaign } from '../../../../classes/campaign';
import { Creation } from '../../../../classes/creation';
import { CampaignService } from '../../../../services/campaign.service';
import { CreationService } from '../../../../services/creation.service';
import { TranslateService } from '@ngx-translate/core';
import { FormatService } from '../../../../services/format.service';
import { PersistenceService } from '../../../../services/persistence.service';
import { FormatTypePipe } from '../../../../pipes/format-type.pipe';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  formatList: FormatSpec[] = [];
  formatTitle = '';
  crumbs = [];

  campaign: Campaign;
  creation: Creation;
  selectedFormat: FormatSpec;

  frules = [];
  filterRule = {
    display: false,
    skin: false,
    video: false,
    loremIpsum: false
  };

  loading = true;
  formatSubmitted = false;
  closeResult = '';
  formatForm: FormGroup;

  constructor(
    private campaignService: CampaignService,
    private creationService: CreationService,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private modalService: NgbModal,
    private formatService: FormatService,
    private formBuilder: FormBuilder,
    private formatTypePipe: FormatTypePipe,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.campaign = this.campaignService.getCurrentCampaign();
    this.creation = this.creationService.getCurrentCreation();

    // Try to resolve campaign name from localstorage
    if (Object.keys(this.creation).length === 0) {
      this.creation = this.persistenceService.checkCreation();
      if (this.creation === undefined) {
        this.router.navigate(['campaigns/formats/edit']).then();
        return;
      }
      this.campaign = this.persistenceService.checkCampaign();
    }

    this.formatService.getAllFormatSpec().subscribe( formatSpec => {
      this.formatList = formatSpec;
      this.loading = false;
    });

    this.formatForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.crumbs = [
        {route: '/campaigns/edit', text: this.campaign.name},
        {route: '/campaigns/formats/edit', text: this.creation.name + ' <small>(Ads)</small>'},
        {route: '', text: this.translateService.instant('CREATE')}
      ];
  }

  /****** Add new format ******/
  formatAdd(): void {
    this.formatSubmitted = true;
    if (this.formatForm.invalid) {
      return;
    }

    const values = this.formatForm.getRawValue();
    values.formatSpecId = this.selectedFormat.id;
    values.creationId = this.creation.id;

    this.formatService.createFormat(values).subscribe( format => {
      this.formatService.setCurrentFormat(format);
      this.modalService.dismissAll('modal close');
      this.router.navigate([this.formatTypePipe.transform(format.formatSpec.code, 'route')]).then();
    });
  }

  /****** change checkbox for filter ******/
  onCheckboxChange(evt: any): void {
    const value = evt.target.value;
    const checked = evt.target.checked;

    const newFilterRule = { ...this.filterRule, [value]: checked ? true : false };
    this.filterRule = newFilterRule;
  }

  /****** open modal ******/
  openModal(content: any, format: FormatSpec): void {
    this.selectedFormat = format;
    this.formatTitle = format.code;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /****** modal close ******/
  private getDismissReason(reason: any): string {
    this.selectedFormat = null;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
