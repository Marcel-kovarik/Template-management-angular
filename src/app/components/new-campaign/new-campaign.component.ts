import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignService } from '../../services/campaign.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {

  campaignForm: FormGroup;
  campaignSubmitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private router: Router,
    private campaignService: CampaignService,
    private formBuilder: FormBuilder
  ) {
    this.campaignForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  campaignSubmit(): void {
    this.campaignSubmitted = true;
    // stop here if form is invalid
    if (this.campaignForm.invalid) {
      return;
    }
    // True if all the fields are filled
    if (this.campaignSubmitted) {
      this.activeModal.dismiss('form submitted');
      this.campaignService.create(this.campaignForm.controls['name'].value).subscribe(cmp => {
        this.campaignService.setCurrentCampaign(cmp);
        this.router.navigate(['campaigns/edit']).then();
      });
    }
  }

}
