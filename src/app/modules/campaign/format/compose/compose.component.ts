import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Crumb } from '../../../../interfaces/crumb';
import { Format } from '../../../../classes/format';
import { Campaign } from '../../../../classes/campaign';
import { Creation } from '../../../../classes/creation';
import { CampaignService } from '../../../../services/campaign.service';
import { CreationService } from '../../../../services/creation.service';
import { PersistenceService } from '../../../../services/persistence.service';
import { ResourceService } from '../../../../services/resource.service';
import { FormatService } from '../../../../services/format.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { StatesService } from '../../../../services/states.service';
import { DialogService } from '../../../../services/dialog.service';
import { FormatSettings } from '../../../../classes/format-settings';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit, OnDestroy {

  crumbs: Crumb[] = [];
  advancedSettings: FormatSettings[] = [];
  format: Format;
  formatCode: string;
  campaign: Campaign;
  creation: Creation;
  edited: any = [];
  fromServer: any = [];
  formatData: any = [];
  missingKeys: any = [];
  timoutHandle: ReturnType<typeof setTimeout>;
  timout = 1500;
  saving = false;
  publishing = false;

  private READY_STATE = 4;
  private MODIFIED_STATE = 32;

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(): Observable<boolean> | boolean {
    return (this.edited.length === 0);
  }

  constructor(
    private dialogService: DialogService,
    private campaignService: CampaignService,
    private creationService: CreationService,
    private persistenceService: PersistenceService,
    private resourceService: ResourceService,
    private formatService: FormatService,
    private stateService: StatesService,
    private alertService: AlertService,
    private translate: TranslateService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    clearTimeout(this.timoutHandle);
  }

  ngOnInit(): void {
    // Get current format, if not referenced, try to resolve from localstorage
    this.format = this.formatService.getCurrentFormat();
    if (Object.keys(this.format).length === 0) {
      this.format = this.persistenceService.checkFormat(this.formatService);
      if (this.format === undefined) {
        this.router.navigate(['campaigns/list']).then();
        return;
      }
    }
    // Get current code, campaign and creation
    this.formatCode = this.format.formatSpec.code;
    this.campaign = this.persistenceService.checkCampaign();
    this.creation = this.persistenceService.checkCreation();
    // ...and create crumbs element
    this.crumbs = [
      {route: '/campaigns/edit', text: this.campaign.name},
      {route: '/campaigns/formats/edit', text: this.creation.name},
      {route: '', text: this.format.name + ' <small>(' + this.format.formatSpec.code + ')</small>'}
    ];

    // Set default data for the current format
    this.format.formatSpec.resourceSpec = this.resourceService.getResourcesByFormatSpecCode(this.format.formatSpec.code);
    this._setFormatData();
  }

  /**
   * Open color or image component by simulating a click
   * @param elementId string
   */
  editTrigger(elementId: string): void {
    window.scroll(0, 0);
    const element = document.getElementById(`${elementId}`) as HTMLElement;
    if (element !== null) {
      element.click();
    }
  }

  saveCurrentFormat(): void {
    const keyList = Object.keys(this.formatData);
    if (this.edited[0]) {
      // update settings and remove key to avoid data update
      this.edited.splice(0, 1);
      const settings = this.formatService.getAdvancedSettings();
      settings.forEach(setting => {
        if (setting.updated) {
          if (setting.value !== '') {
            this.formatService.updateAdvancedSettingsByFormatId(this.format.id, setting).subscribe();
          } else {
            this.formatService.deleteAdvancedSettingsById(this.format.id, setting.id).subscribe();
          }
        }
      });
      this.formatService.updateStateFormat(this.format.id, this.MODIFIED_STATE, true).subscribe( () => {
        this._updateFormat();
      });
    }

    // Check if there as been some update during session
    if (this.edited.length > 0) {
      this.alertService.clear();
      this.saving = true;
      const resourcesBulk: CreateResource[] = [];
      // run thru all keys
      keyList.forEach( key => {
        // ... and only process the updated ones
        if (this.edited[this._getIdByKey(key)]) {
          const send = new CreateResource({settingsKey: key});
          // switch between content and base64
          if (this.formatData[key].startsWith('#')) {
            send.content = this.formatData[key];
          } else if (this.formatData[key].startsWith('data:image')) {
            send.base64data = this.formatData[key];
          }
          resourcesBulk.push(send);
        }
      });

      // Send to backend and deal with response
      this.resourceService.createBulk({formatId: this.format.id, resources: resourcesBulk}).subscribe( resp => {
        if (resp.length > 0) {
          this.alertService.success(this.translate.instant('RESOURCES_UPDATED'), {autoClose: true});
          this.formatService.updateStateFormat(this.format.id, this.READY_STATE, this._isFormatReadyToPublish(keyList))
            .subscribe(() => {
              this._updateFormat();
            });
          this.edited = [];
        } else {
          this.alertService.error(this.translate.instant('RESOURCES_ERROR'));
        }
        this.saving = false;
      });
    } else {
      // this.alertService.info(this.translate.instant('NO_CHANGE_TO_SAVE'));
    }
  }

  publishFormat(): void {
    if (this.missingKeys.length) {
      return;
    }
    this.dialogService.confirm(this.translate.instant('FORMAT.PUBLISH_CONFIRM')).then(resp => {
      if (resp) {
        this.publishing = true;
        this.formatService.deployFormat(this.format.id).subscribe(state => {
          if (state.ok) {
            this.formatService.getFormatById(this.format.id).subscribe(format => {
              this.alertService.success(this.translate.instant('FORMAT.PUBLISHED'), {autoClose: true});
              this._updateFormat();
              this.publishing = false;
            });
          }
        });
      }
    });
  }

  private _updateAdvancedSettings(): void {
    const settings = this.formatService.getAdvancedSettings();
  }

  private _updateFormat(): void {
    this.formatService.getFormatById(this.format.id).subscribe(format => {
      this.format = format;
      this.format.formatSpec.resourceSpec = this.resourceService.getResourcesByFormatSpecCode(this.format.formatSpec.code);
      this._isFormatReadyToPublish(this.format.resource.map(e => e.settingsKey));
    });
  }

  private _setFormatData(): void {
    // Set missing keys to be displayed under publish btn
    this._isFormatReadyToPublish(this.format.resource.map(e => e.settingsKey));

    this.formatService.getAdvancedSettingsByFormatId(this.format.id).subscribe();

    // Do not process if there is no resource in current format
    if (this.format.resource.length === 0) {
      return;
    }
    // Populate server data to view
    this.format.formatSpec.resourceSpec.forEach( spec =>  {
      spec.settingsKeys.forEach( key => {
        const data = this.format.resource.filter(e => {
          return e.settingsKey === key;
        });
        if (data.length > 0) {
          this.fromServer[spec.id] = true;
          this.formatData[key] = (data[0].content && data[0].content !== '') ? data[0].content : data[0].url;
        }
      });
    });
  }

  private _getIdByKey(key: string): number {
    const result = this.format.formatSpec.resourceSpec.filter( e => {
      return e.settingsKeys.includes(key);
    });
    return result[0].id;
  }

  /**
   * Check if all required keys are populated
   * @param savedKeys any
   * @private
   */
  private _isFormatReadyToPublish(savedKeys: any): boolean {
    // Reset error list array
    this.missingKeys = [];
    let hasMandatoryMissing = false;

    // Check required keys
    this.format.formatSpec.resourceSpec.forEach(format => {
      if (format.mandatory) {
        const name = format.name;
        format.settingsKeys.forEach(key => {
          if (!savedKeys.includes(key) && this.missingKeys.indexOf(name) === -1 ) {
            hasMandatoryMissing = true;
            this.missingKeys.push(name);
          }
        });
      }
    });

    if (this.stateService.hasDeployment(this.format.state)) {
      this.timoutHandle = setTimeout(() => { this._updateFormat(); }, this.timout);
      this.timout += 1500;
      this.missingKeys = ['FORMAT.MISSING.PUBLICATION_REQUESTED'];
      return !hasMandatoryMissing;
    } else if (this.timoutHandle) {
      clearTimeout(this.timoutHandle);
    }

    // ... then check if conversation exist and state
    if (this.creationService.getCurrentCreation().conversation === null) {
      this.missingKeys.push('FORMAT.MISSING.CONVERSATION');
    } else if (!this.stateService.hasPublished(this.creationService.getCurrentCreation().conversation.state)) {
      this.missingKeys.push('FORMAT.MISSING.CONV_PUBLICATION');
    }

    // ... and check format if no missing keys
    if (!this.missingKeys.length) {
      if (this.stateService.hasXPublish(this.format.state)
        || (this.stateService.hasPublished(this.format.state) && !this.stateService.hasUpdated(this.format.state))) {
        this.missingKeys.push('FORMAT.MISSING.NOTHING');
      }
    }

    // If no required keys are missing then format is ready
    return !hasMandatoryMissing;
  }
}

class CreateResource {
  base64data: string;
  content: string;
  formatId: number;
  settingsKey: string;
  constructor(init?: Partial<CreateResource>) {
    Object.assign(this, init);
  }
}
