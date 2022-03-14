import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConversationService } from '../../../services/conversation.service';
import { TextSection } from '../../../classes/text-section';
import { DialogService } from '../../../services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-conversation-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent implements OnInit {

  @Output() closeMe = new EventEmitter();
  @Output() setUpdate = new EventEmitter();

  loaded = false;
  settings: any;
  textSection: TextSection = { text: '', textToAudio: '', audName: '', audSrc: '' };
  textSectionDisplay = false;
  errorEditingIndex: number;

  errorMsgList: TextSection[] = [];
  collapsedStatus = {
    isErrorCustom: false,
    isMacro: true,
    isTactile: true,
    isPmUrl: true
  };

  constructor(
    private translate: TranslateService,
    private dialogService: DialogService,
    private conversationService: ConversationService
  ) { }

  ngOnInit(): void {
    this.loaded = true;
    this.settings = this.conversationService.getSettings();
    this._setSettings();
  }

  hideMe(): void  {
    this.closeMe.emit();
  }

  closeEditor(): void {
    this.errorEditingIndex = null;
    this.textSectionDisplay = false;
  }

  editMessage(index: number): void {
    this.textSection = {...this.errorMsgList[index]};
    this.errorEditingIndex = index;
    this.textSectionDisplay = true;
  }

  sectionAdd(type: string): void {
    if (type === 'Text') {
      if (JSON.stringify(this.errorMsgList[this.errorEditingIndex]) !== JSON.stringify(this.textSection)) {
        this.errorMsgList[this.errorEditingIndex] = this.textSection;
        this._recordSettings(this.textSection);
      }
      this.errorEditingIndex = null;
      this.textSectionDisplay = false;
    }

  }

  sectionUpdate(section: any): void {
    this.textSection = section.section;
  }

  deleteAudio(): void {
    this.textSection = { ...this.textSection, audSrc: '', audName: ''};
  }

  resetSettings(): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_SETTINGS')).then( response => {
      if (!response) {
        return;
      }
      this.conversationService.resetCurrentConversationSettings().subscribe(e => {
        const self = this;
        setTimeout(() => {
          self.settings = self.conversationService.getSettings();
          this._setSettings();
        }, 200);
      });
    });
  }

  _setSettings(): void {
    this.errorMsgList = [];
    Object.keys(this.settings).forEach((key, i) => {
      this.settings[key].type = 'MESSAGES';
      this.settings[key].key = key;
      this.errorMsgList.push(this.settings[key]);
    });
  }

  _recordSettings(textSection: TextSection): void {
    Object.keys(this.settings[textSection.key]).forEach(key => {
      this.settings[textSection.key][key] = this.textSection[key];
      if (key === 'text') {
        this.settings[textSection.key].textToAudio = this.textSection[key];
      }
    });
    this.conversationService.setSettings(this.settings);
    this.setUpdate.emit(true);
  }
}
