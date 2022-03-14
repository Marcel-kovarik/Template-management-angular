import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TextSection } from '../../../../classes/text-section';

@Component({
  selector: 'app-add-text',
  templateUrl: './add-text.component.html',
  styleUrls: ['./add-text.component.scss']
})
export class AddTextComponent implements OnInit {

  @Output() deleteText = new EventEmitter();
  @Output() sectionAdd = new EventEmitter();
  @Output() removeAudio = new EventEmitter();
  @Output() updateLayout = new EventEmitter();
  @Output() snackBar = new EventEmitter();
  @Output() updateParent = new EventEmitter();

  @Input() audionLoading: boolean;
  @Input() removeButton = {text: 'DELETE', icon: 'icon-delete'};
  @Input() textSection: TextSection = { text: '', audName: '', audSrc: '' };

  constructor(
    private domSanitizer: DomSanitizer,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {}

  addText(): void {
    this.sectionAdd.emit('Text');
  }

  removeText(): void {
    this.deleteText.emit();
  }

  addAudio(event: any): void {

    if (event.target.files && event.target.files[0]) {
      this.audionLoading = true;

      // Check audio size
      if (event.target.files[0].size > 3 * 1024 * 1024) {
        this.snackBar.emit(this.translate.instant('ALERTS.MP3_TOO_BIG'));
        this.audionLoading = false;
        return;
      }

      // File Preview
      this.textSection = { ...this.textSection, audName: event.target.files[0].name };
      const reader = new FileReader();
      reader.onload = () => {
        // @ts-ignore
        this.textSection = { ...this.textSection, audSrc: reader.result as string };
        this.audionLoading = false;
        this.updateParent.emit({type: 'Text', section: this.textSection});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.updateLayout.emit(); // update node layout
  }

  deleteAudio(): void {
    this.removeAudio.emit();
  }
}
