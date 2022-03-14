import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Campaign } from '../../classes/campaign';
import { Router } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewCampaignComponent } from '../new-campaign/new-campaign.component';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../services/alert.service';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { TranslateParamsPipe } from '../../pipes/translate-params.pipe';
import { StatesService } from '../../services/states.service';
import { User } from '../../classes/user';
import { UserService } from '../../services/user.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [TranslateParamsPipe]
})
export class HomeComponent implements OnInit, OnDestroy {

  openActionListId: number = null;
  listenerFn: () => void;

  campaigns;
  stats: any;
  statsDisplay = false;
  closeResult: string;
  user: User;

  constructor(
    private orderPipe: OrderByPipe,
    private renderer: Renderer2,
    private router: Router,
    private modalService: NgbModal,
    private stateService: StatesService,
    private translate: TranslateService,
    private translateParams: TranslateParamsPipe,
    private dialogService: DialogService,
    private alertService: AlertService,
    private statisticsService: StatisticsService,
    private campaignService: CampaignService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.getCampaignList();
    this.stats = this.statisticsService.getLastStatistics(3);
    this.user = this.userService.userValues;
    this.listenerFn = this.renderer.listen(document, 'click', (event) => {
      if (!event.target.closest('.card-action-btn')) {
        this.openActionListId = null;
      }
    });
  }

  getCampaignList(): void {
    // Retrieve data form services
    this.campaignService.getAllCampaigns().subscribe(cmp => {
      cmp = this.orderPipe.transform(cmp, 'creationDate', 'DESC');
      this.campaigns = cmp.slice(0, 3);
    });
  }

  deleteCampaign(campaign: Campaign): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_CAMPAIGN'))
      .then(resp => {
        if (resp) {
          this.campaignService.deleteCampaignById(campaign.id).subscribe( serverState => {
            if (serverState.ok === true) {
              this.alertService.success(this.translate.instant('ALERTS.CAMPAIGN_DELETE'));
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

  ngOnDestroy(): void {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  openActionList(id: number): void {
    if (this.openActionListId === id) {
      this.openActionListId = null;
    } else {
      this.openActionListId = id;
    }
  }

  open(): void {
    // const modalRef = this.modalService.open(NewCampaignComponent);
    // modalRef.componentInstance.name = 'World';
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
