import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from '../../services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

  private closeResult: string;

  icons = ['icon-fake_player', 'icon-radiobox-on', 'icon-radiobox-off', 'icon-responsive', 'icon-checkbox-off', 'icon-checkbox-on',
    'icon-podcast', 'icon-social-network', 'icon-mic-pause', 'icon-mic-play', 'icon-mic-sent', 'icon-mic-stop', 'icon-600-equal',
    'icon-600-intro', 'icon-hero_section', 'icon-250', 'icon-flag-fr', 'icon-flag-us', 'icon-dictionnary', 'icon-qr_code', 'icon-keyboard',
    'icon-operator', 'icon-man', 'icon-micro-on', 'icon-micro-wave', 'icon-random', 'icon-circle_full', 'icon-move', 'icon-crop',
    'icon-basket_spc', 'icon-sandglass', 'icon-publish-launch', 'icon-publish-prelaunch', 'icon-600-video', 'icon-250-video',
    'icon-voicecomm2', 'icon-creations', 'icon-inprogress', 'icon-600-splitscreen', 'icon-more', 'icon-rgpd', 'icon-arbo', 'icon-sent-big',
    'icon-thumbup', 'icon-mic-logo', 'icon-voice_commerce', 'icon-time', 'icon-basket', 'icon-tv', 'icon-display', 'icon-radio',
    'icon-car', 'icon-internet_box', 'icon-speak', 'icon-news', 'icon-box', 'icon-design', 'icon-reduce', 'icon-expend', 'icon-minus-round',
    'icon-minus', 'icon-assistants', 'icon-crea_pub', 'icon-1000', 'icon-600', 'icon-2501', 'icon-cancel-big', 'icon-add-round', 'icon-add',
    'icon-address_book', 'icon-address', 'icon-alert-off', 'icon-alert-on', 'icon-amazon_alexa', 'icon-archive', 'icon-arrow-down',
    'icon-arrow-left', 'icon-arrow-right', 'icon-arrow-up', 'icon-assign-off', 'icon-assign-on', 'icon-back-round', 'icon-back',
    'icon-borne', 'icon-browser', 'icon-bubble-minus', 'icon-bubble-plus', 'icon-calendar', 'icon-camera', 'icon-campaign',
    'icon-cancel-round', 'icon-cancel', 'icon-center', 'icon-circle', 'icon-clock', 'icon-cloud', 'icon-comments', 'icon-database',
    'icon-delete', 'icon-down-round', 'icon-down', 'icon-download', 'icon-duplicate', 'icon-edit', 'icon-email', 'icon-file-audio',
    'icon-file-picture', 'icon-file-ppt', 'icon-file-text', 'icon-file-video', 'icon-file-xls', 'icon-file', 'icon-filter-cancel',
    'icon-filter', 'icon-finish', 'icon-folder-empty', 'icon-folder-full', 'icon-forward', 'icon-front-round', 'icon-front',
    'icon-google_home', 'icon-history', 'icon-house', 'icon-info', 'icon-left', 'icon-library', 'icon-link', 'icon-list', 'icon-lock',
    'icon-map', 'icon-media_library', 'icon-micro-off', 'icon-mobile', 'icon-moderation', 'icon-mosaic', 'icon-music', 'icon-no_input',
    'icon-pause', 'icon-percentage', 'icon-phone', 'icon-picture', 'icon-pie_chart', 'icon-pin', 'icon-play', 'icon-print', 'icon-profil',
    'icon-publish', 'icon-question', 'icon-quit', 'icon-quiz', 'icon-record', 'icon-redo', 'icon-refresh', 'icon-rewind', 'icon-right',
    'icon-save', 'icon-screen', 'icon-search', 'icon-see', 'icon-send_text', 'icon-send-round', 'icon-send', 'icon-sent', 'icon-settings',
    'icon-sms-off', 'icon-sms-on', 'icon-sms-speaking', 'icon-sort-az', 'icon-sort-list-1', 'icon-sort-list-2', 'icon-sort-za',
    'icon-sound-max', 'icon-sound-min', 'icon-sound-off', 'icon-sound', 'icon-square', 'icon-star-off', 'icon-star-on', 'icon-stats',
    'icon-stop', 'icon-tag', 'icon-target', 'icon-team', 'icon-text', 'icon-g-on', 'icon-timer', 'icon-tools', 'icon-triangle', 'icon-undo',
    'icon-unlock', 'icon-unsee', 'icon-unzoom', 'icon-up-round', 'icon-up', 'icon-upload', 'icon-video', 'icon-warning', 'icon-wifi-off',
    'icon-wifi-on', 'icon-zoom', 'icon-g-off', 'icon-custom-size', 'icon-480'];

  constructor(
    private translate: TranslateService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  whatNext(): void {
    this.dialogService.whatNext('Where do you want to go next : <br>Back to the home page or See the campaing list ?', {answers: [
      {text: 'HOME', route: '/'}, {text: 'CAMPAIGN', route: '/campaigns/list'}]});
  }

  confirmDialog(): void {
    this.dialogService.confirm(this.translate.instant('Message to display'))
      .then(resp => {
        if (resp) {
          this.alertService.success('You clicked YES !!!', {autoClose: true});
        } else {
          this.alertService.error('You clicked NO !!! :( ', {autoClose: true});
        }
      }).catch();
  }

  displayAlert(type): void {
    if (type === 'success') {
      this.alertService.success('This is a <b>Success</b> Alert');
    } else if (type === 'info') {
      this.alertService.info('This is a <b>Info</b> Alert');
    } else if (type === 'warning') {
      this.alertService.warn('This is a <b>Warning</b> alert');
    } else if (type === 'error') {
      this.alertService.error('This is an <b>ERROR</b> alert');
    }
  }

  openModal(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log('result', result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      console.log('reason', reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
