import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormatService } from '../../../services/format.service';
import { FormatSettings } from '../../../classes/format-settings';
import { AlertService } from '../../../services/alert.service';
import { DialogService } from '../../../services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-campaign-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent implements OnInit {
  @ViewChild('newMacroInput') newMacroInput: ElementRef;

  @Output() closeMe = new EventEmitter();

  @Input() formatId: number;
  @Input() edited: any = [];


  settingsList: FormatSettings[] = [];
  deletedSettingsList: FormatSettings[] = [];
  macroListObj: FormatSettings[] = [];
  macroRef: FormatSettings;
  macroObj: FormatSettings = {type: 'TAG', field: 'MACRO', key: '', value: ''};
  bgLinkObj: FormatSettings = {type: 'SETTING', field: 'BG_LINK', key: '', value: ''};
  pmLinkObj: FormatSettings = {type: 'SETTING', field: 'PM_LINK', key: '', value: ''};
  topScriptObj: FormatSettings = {type: 'SCRIPT', field: 'TOP_SCRIPT', key: 'head', value: ''};
  bottomScriptObj: FormatSettings = {type: 'SCRIPT', field: 'BOTTOM_SCRIPT', key: 'body', value: ''};
  tactileObj: FormatSettings = {type: 'TAG', field: 'TACTILE', key: '', value: ''};

  form = new FormGroup({
    bgLink: new FormControl(''),
  });

  updates = false;
  addMacroField = false;
  macroFormat = '0';
  macroFormatList = ['${TEXT}', '%%TEXT%%', '[TEXT]'];
  errorList = {PM_LINK: [], BG_LINK: [], MACRO: [], TOP_SCRIPT: [], BOTTOM_SCRIPT: []};
  collapsedStatus = {
    isBgUrl: true,
    isMacro: true,
    isTactile: true,
    isPmUrl: true,
    isScript: true
  };

  constructor(
    private formatService: FormatService,
    private renderer: Renderer2,
    private alertService: AlertService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.settingsList = this.formatService.getAdvancedSettings();
    this._updateDisplay();
  }

  /**
   * Update settings with different action according to field type
   * @param setting FormatSettings
   * @param stayOpen boolean (for macro only)
   */
  update(setting: FormatSettings, stayOpen?: boolean): void {
    // replace true/false by TACTILE or empty string
    if (setting.field === 'TACTILE') {
      setting.key = setting.value ? 'mode' : '';
      setting.value = setting.value ? 'TACTILE' : '';
    }

    if (setting.value !== '') {
      // if xx_LINK setting, perform url format validation
      if (setting.field.includes('_LINK')) {
        this.errorList[setting.field] = [];
        let regex = /^(https:\/\/)/g ;
        let errorMessageKey = 'FORM_ERRORS.INVALID_LINK';
        if (setting.field === 'BG_LINK') {
          setting.key = 'header.url,body.url';
          regex = null ;
          errorMessageKey = 'FORM_ERRORS.LINK_FORMAT_ERROR';
        }
        if (!this.appService.macroUrlRegex(setting.value, regex)) {
          this.errorList[setting.field].push(errorMessageKey);
          return;
        }
      }
      if (setting.field.includes('_SCRIPT')) {
        const regex = /<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/g ;
        if (!regex.test(setting.value)) {
          this.errorList[setting.field].push('FORM_ERRORS.INVALID_SCRIPT');
          return;
        }
      }
    }


    // Set value for all the above fields
    let update = this._checkItemInList(setting);

    // for MACRO
    if (setting.field === 'MACRO') {
      console.log('FORMAT : ', this.macroFormatList[this.macroFormat]);
      // add lower case key and surroundings characters
      setting.key = setting.value.toLowerCase();
      setting.value = this.macroFormatList[this.macroFormat].replace(/TEXT/gi, setting.value);
      // perform if_exist
      if (this.settingsList.find(e => e.value === setting.value)) {
        this.errorList.MACRO.push('FORM_ERRORS.ALREADY_EXIST');
        return;
      }
      // If macroRef => update recorded macro else add to list
      if (this.macroRef) {
        this.macroRef.value = setting.value;
        this.macroRef.key = setting.key;
        delete this.macroRef;
        update = true;
      } else {
        this.macroListObj.push(setting);
      }
      // reset temp object and manage add field display
      this.macroObj = {type: 'TAG', field: 'MACRO', key: '', value: ''};
      this.addMacroField = stayOpen;
    }

    // add key to perform saving
    // and publish after settings udpate
    this.edited[0] = true;

    // check if this setting is present in values.
    // If not push it into array or mark it as updated.
    const originalSetting = this.settingsList.find(e => (e.id && e.id === setting.id));
    if (!originalSetting && !update) {
      setting.updated = true;
      this.settingsList.push(setting);
      return;
    } else if (originalSetting ) {
      originalSetting.updated = true;
    }
  }

  /**
   * poppulate needed object to update macro
   * @param setting
   */
  editMacro(setting: FormatSettings): void {
    this.macroObj = {...setting};
    this.macroRef = setting;
    this.formatMacro();
    this.addMacroField = true;
  }

  /**
   * Set macro to be deleted on record and remove from display list
   * @param setting
   * @param index
   */
  deleteMacro(setting: FormatSettings, index: number): void {
    const i = this.settingsList.findIndex(e => (JSON.stringify(e) === JSON.stringify(setting)));
    if (!this.settingsList[i].id) {
      // if it hasn't been recorded remove form list
      this.settingsList.splice(i, 1);
    } else {
      // otherwise set value to empty string & mark as updated
      this.settingsList[i].value = '';
      this.settingsList[i].updated = true;

    }
    this.macroListObj.splice(index, 1);
    this.edited[0] = true; // to be able to save and publish
  }

  /**
   * Empty link field
   * @param setting FormatSettings
   */
  clearLink(setting: FormatSettings): void {
    setting.value = '';
    setting.updated = true;
    this.errorList[setting.field] = [];

    this._checkItemInList(setting);
    this.edited[0] = true;
  }

  /**
   * delete all recorded settings
   */
  resetSettings(): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_SETTINGS')).then(response => {
      if (!response) {
        return;
      }
      this.formatService.getAdvancedSettingsByFormatId(this.formatId).subscribe(datas => {
        datas.forEach( data => {
          this.formatService.deleteAdvancedSettingsById(this.formatId, data.id).subscribe();
        });
        // reset display and empty list
        this._resetDisplay();
        this.settingsList = [];
        this.formatService.setAdvancedSettings(this.settingsList);
      });
    });
  }

  /**********************************************************
   * FUNCTIONAL METHODS
   **********************************************************/
  /**
   * trigger parent method to closer settings panel
   */
  hideMe(): void {
    this.closeMe.emit();
  }

  /**
   * Used to format macro to upper case and snake case on the fly
   * @param e any
   */
  formatMacro(): void {
    this.macroObj.value = this.macroObj.value.replace(/ +/g, '_').replace(/\W+/g, '').toUpperCase();
  }

  /**
   * display input field to add new macro and set as focused.
   */
  showMacroField(): void {
    this.addMacroField = true;
    setTimeout(() => {
      this.newMacroInput.nativeElement.focus();
    }, 0);
  }

  /**
   * Hide and empty new macro input field
   */
  hideMacroField(): void {
    this.errorList.MACRO = [];
    this.macroObj = {type: 'TAG', field: 'MACRO', key: '', value: ''};
    this.addMacroField = false;
  }

  /**
   * Set all setting for display and reset datas if needed (delete all settings action)
   * @private
   */
  private _updateDisplay(): void {
    this.settingsList.forEach( (setting, key) => {
      if (setting.field === 'MACRO' && setting.value !== '') {
        this.macroListObj.push(setting);
      } else {
        this[this._getObjectNameByFieldName(setting.field)] = setting;
      }
    });
  }

  /**
   * Reset all display values after delete
   * @private
   */
  private _resetDisplay(): void {
    this.macroListObj = [];
    this.macroObj = {type: 'TAG', field: 'MACRO', key: '', value: ''};
    this.bgLinkObj = {type: 'SETTING', field: 'BG_LINK', key: '', value: ''};
    this.pmLinkObj = {type: 'SETTING', field: 'PM_LINK', key: '', value: ''};
    this.tactileObj = {type: 'TAG', field: 'TACTILE', key: '', value: ''};
    this.topScriptObj = {type: 'SCRIPT', field: 'TOP_SCRIPT', key: 'head', value: ''};
    this.bottomScriptObj = {type: 'SCRIPT', field: 'BOTTOM_SCRIPT', key: 'body', value: ''};
  }

  /**
   * change field value into obj name
   * @param field
   */
  _getObjectNameByFieldName(field: string): string {
    return this._toCamel(field.toLowerCase()) + 'Obj';
  }

  /**
   * Check if item is already part of the list to manage update of unsaved values
   * @param setting FormatSettings
   * @private
   */
  private _checkItemInList(setting: FormatSettings): boolean {
    const i = this.settingsList.findIndex(e => e.field === setting.field);
    // if item not found or item is MACRO field return false (MACRO are managed differently)
    if (i < 0 || setting.field === 'MACRO') {
      return false;
    }
    // remove entry if new add entry and remove before saving
    if (this.settingsList[i].id === undefined && this.settingsList[i].value === '') {
      this.settingsList.splice(i, 1);
    }
    return true;
  }

  /**
   * change string format from snake_case to camelCase
   * @param s string
   * @private
   */
  private _toCamel(s: string): string {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }
}
