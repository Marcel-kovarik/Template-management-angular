import { Component, OnInit, Output, EventEmitter, Input, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Voice } from '../../../classes/voice';
import { ConversationService } from '../../../services/conversation.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-conv-breadcrumb',
  templateUrl: './conv-breadcrumb.component.html',
  styleUrls: ['./conv-breadcrumb.component.scss']
})
export class ConvBreadcrumbComponent implements OnInit {

  @Output() save = new EventEmitter();
  @Output() newNode = new EventEmitter();
  @Output() voiceSelect = new EventEmitter();
  @Output() preview = new EventEmitter();
  @Output() publish = new EventEmitter();
  @Output() setUpdated = new EventEmitter();

  @Input() voiceList: Voice[] = [];
  @Input() voiceId: string;
  @Input() demoLang: string;
  @Input() saving: boolean;
  @Input() previewing: boolean;
  @Input() publishing: boolean;
  @Input() saveButtonActive: boolean;
  @Input() previewButtonActive: boolean;
  @Input() publishButtonActive: any;
  @Input() isChooseVoice: boolean;

  listenerFn: () => void;
  playing: HTMLAudioElement;
  displayErrorContainer = false;
  advancedSettings = false;


  constructor(
    private location: Location,
    private renderer: Renderer2,
    private translate: TranslateService,
    private alertService: AlertService,
    private conversationService: ConversationService
  ) { }

  ngOnInit(): void {
    /****** choose voice submenu close with click ******/
    this.listenerFn = this.renderer.listen(document, 'click', (event) => {
      if (!event.target.closest('.menu-item')) {
        this.closeVoiceSelector();
      }
    });
  }

  backClicked(): void {
    this.location.back();
  }

  addNewNode(): void {
    this.newNode.emit();
  }

  showVoiceSelector(): void {
    this.isChooseVoice = true;
  }

  toggleSettings(): void {
    this.advancedSettings = !this.advancedSettings;
  }

  previewAction(): void {
    if (this.previewButtonActive && !this.previewing) {
      this.preview.emit();
    }
  }

  saveAction(): void {
    if (this.saveButtonActive && !this.saving) {
      this.save.emit();
    }

  }

  publishAction(): void {
    if (this.publishButtonActive.length === 0 && !this.publishing) {
      this.publish.emit();
    }
  }

  setUpdate(hasUpdate: boolean): void {
    this.setUpdated.emit(hasUpdate);
  }

  displayErrors(display: boolean): void {
    this.displayErrorContainer = display;
  }

  playVoice(e, voice: Voice, text?: string): void {
    if (!text) {
      this._getDemoSentence(e, voice, this.demoLang);
      return;
    }
    if (this.playing) {
      this.stopPlayer();
    }
    this.conversationService.getVoiceSample({
      sentence: text,
      languageCode: voice.languageCode,
      voiceId: voice.voiceId
    }).subscribe(url => {
      this.playing = new Audio(url);
      this.playing.src = url;
      this.playing.play();
      this.playing.addEventListener('ended', () => { this.stopPlayer(); });
    });
    e.stopPropagation();
  }

  /**
   * Get menu click event by label,
   * @param label string
   */
  menuItemClick(label: string): any {
    if (label === 'Choose voice') { this.isChooseVoice = true; }
    if (label === 'New node') { this.newNode.emit(); }
  }

  /**
   * Change choose voice
   * @param id number,
   * @param evt any
   */
  chooseVoiceChanged(voice: Voice): void {
    this.voiceId = voice.voiceId;
    this.voiceSelect.emit(voice.voiceId);
  }

  closeVoiceSelector(): void {
    this.isChooseVoice = false;
  }

  private stopPlayer(): void {
    this.playing.pause();
    this.playing = null;
  }

  /**
   * Get the sentence used for voice demo
   * @param lang string
   * @private
   */
  private _getDemoSentence(e, voice: Voice, lang: string): void {
    // Test if language has translation and is activated for builder
    if (this.translate.getLangs().includes(lang)) {
      this.translate.getTranslation(lang).subscribe(translation => {
        // Check if key has been translated
        if (translation.CONVERSATION.VOICE_SAMPLE) {
          this.playVoice(e, voice, translation.CONVERSATION.VOICE_SAMPLE);
        }
      });
    } else {
      // Warn user that sentence will be in editor language
      this.alertService.warn(this.translate.instant('CONVERSATION.VOICE_SAMPLE_NOT_SUPPORTED'));
    }
  }
}
