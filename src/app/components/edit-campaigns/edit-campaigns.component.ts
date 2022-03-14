import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../classes/campaign';
import { AlertService } from '../../services/alert.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-campaigns',
  templateUrl: './edit-campaigns.component.html',
  styleUrls: ['./edit-campaigns.component.scss']
})
export class EditCampaignsComponent implements OnInit {

  @Input() campaign;

  @Output() duplicate: EventEmitter<Campaign> = new EventEmitter<Campaign>();
  @Output() delete: EventEmitter<Campaign> = new EventEmitter<Campaign>();

  constructor(
    private alertService: AlertService,
    private campaignService: CampaignService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  edit(campaign: Campaign): void {
    // get selected campaign to update current and go to page
    this.campaignService.getCampaignById(campaign.id).subscribe(() => {
      this.router.navigate(['campaigns/edit']).then();
    });
  }

  sendDuplicate(campaign: Campaign): void {
    if (environment.production) {
      alert('Sorry, this function is temporarily deactivated.');
      return;
    }
    if (confirm('You are about to test DUPLICATE function. Only dev should do this.')) {
      this.duplicate.emit(campaign);
    }
  }

  sendDelete(campaign: Campaign): void {
    this.delete.emit(campaign);
  }
}
