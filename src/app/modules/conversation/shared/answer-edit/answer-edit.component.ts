import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { AnswerCreate } from '../../../../interfaces/node-editor-model';
import * as models from '../../../../interfaces/convflow-models';
import { ObjectID } from 'bson';
import iro from '@jaames/iro';
import { ConvNodeVM } from '../../../../classes/conversation/conv-nodeVM';

@Component({
  selector: 'app-answer-edit',
  templateUrl: './answer-edit.component.html',
  styleUrls: ['./answer-edit.component.scss']
})
export class AnswerEditComponent implements OnInit, AfterViewInit {

  @ViewChild('answerRef') answerRef: ElementRef;
  @ViewChild('synonymsRef') synonymsRef: ElementRef;
  @Output() openSnackBar = new EventEmitter<any>();
  @Output() updateLayout = new EventEmitter<any>();
  @Input() answerText: string;
  @Input() answerId: string;
  @Input() editedNode: ConvNodeVM;
  @Input() answerEdit: models.AnswerEdit;

  collapsedStatus = {
    isSynonyms: true,
    isImage: true,
    isStyles: true
  };

  synonymsCreat: AnswerCreate = { text: '', isCancel: false };
  imageLoading = false;
  currentPickerActive: number;
  colorPicker: any;

  synonymSuggestions = [
    'Yeah', 'Ok', 'Of course'
  ];

  constructor() {
    // TODO : Manage input with reactiveFormModule instead of formModule ...
  }

  ngOnInit(): void {
    this.colorPickerInit(0);
    this.currentPickerActive = 0;
  }

  ngAfterViewInit(): void {
    this.answerRef.nativeElement.focus();
  }

  answerChanged(): void {
    this.editedNode.convNode.Answers.AnswerList.forEach(item => {
      if (item._id === this.answerId) {
        item.AnswerText = this.answerText;
      }
    });
    this.updateLayout.emit();
  }

  addSynCreateDisplay(): void {
    this.synonymsCreat = { ...this.synonymsCreat, isCancel: true };
    setTimeout(() => {
      if (this.synonymsRef?.nativeElement) {
        this.synonymsRef.nativeElement.focus();
      }
    }, 0);
  }

  addSynonymItem(): void {
    const item = { SynonymsId: new ObjectID().toHexString(), Text: this.synonymsCreat.text };
    this.answerEdit.synonyms.SynonymsItem.push(item);
    this.synonymsCreat = { isCancel: false, text: '' };
    this.updateLayout.emit();
  }

  synonymsInputRemove(): void {
    this.synonymsCreat = { ...this.synonymsCreat, isCancel: false };
  }

  /**
   * Set button by click a button
   * @param text string
   */
  isIncludeText(text): boolean {
    return this.answerEdit.synonyms.button.includes(text);
  }

  /**
   * Remove a synonyms by a click remove button
   * @param id string
   */
  removeSynonymsItem(id: string): void {
    const i = this.answerEdit.synonyms.SynonymsItem.findIndex( s => s.SynonymsId === id );
    this.answerEdit.synonyms.SynonymsItem.splice(i, 1);
    this.updateLayout.emit();
  }

  /**
   * Set button by click a button
   * @param text string
   */
  synonymsBtnEvent(text: string): void {
    const tempData = [...this.answerEdit.synonyms.button];

    if (this.answerEdit.synonyms.button.includes(text)) {
      const idx = this.answerEdit.synonyms.button.indexOf(text);
      tempData.splice(idx, 1);
    } else {
      tempData.push(text);
    }
    this.answerEdit.synonyms.button = tempData;
    this.updateLayout.emit();
  }

  /**
   * Save answer by a keyUp event on input
   * @param event KeyboardEvent
   */
  answerSaveByKeyUp(event: KeyboardEvent): void {
    if (this.synonymsCreat.text !== '' && event.code === 'Enter') { this.addSynonymItem(); }
  }

  /****** Image Upload ******/
  updateFile(e: any): void {
    this.imageLoading = true;
    const file: File = e.target.files[0];
    // image file size validation
    if (e.target.files[0].size > 10 * 1024) {
      this.openSnackBar.emit('ALERTS.IMG_TOO_HEAVY');
      this.imageLoading = false;
      return;
    }
    // image file size validation
    if (e.target.files[0].width > 200 || e.target.files[0].height > 200) {
      this.openSnackBar.emit('ALERTS.IMG_TOO_BIG');
      this.imageLoading = false;
      return;
    }

    const reader = new FileReader();
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    reader.addEventListener('load', (event: any) => {
      img.onload = () => {
        this.answerEdit.image.src = event.target.result;
        this.imageLoading = false;
      };
    });
    reader.readAsDataURL(file);
    this.updateLayout.emit();
  }

  imageRemove(): void {
    this.answerEdit.image = { src: '' };
    this.updateLayout.emit();
  }

  /**
   * Instantiate color picker by number
   * @param num number
   */
  colorPickerInit(num: number): void {
    if (num === this.currentPickerActive) {
      return;
    }
    this.currentPickerActive = num;
    setTimeout(() => {
      this.colorPicker = iro.ColorPicker(
        `#colorPicker${num}`,
        {
          width: 163,
          color: num === 0 ? this.answerEdit.styles.textColor : this.answerEdit.styles.bgColor
        });
      this.colorPicker.on('color:change', (color: any) => {
        if (num === 0) {
          this.answerEdit.styles.textColor = color.hexString;
        } else {
          this.answerEdit.styles.bgColor = color.hexString;
        }
        this.updateLayout.emit();
      });
    }, 1);
  }

  /**
   * Manual color update
   * @param e any
   */
  backgroundColorUpdate(e: any): void {
    // Validate input value
    const regExp = /[0-9A-Fa-f]{6}/g;
    if (!regExp.test(e.target.value)) {
      return;
    }
    // Update color picker value
    this.colorPicker.color.hexString = e.target.value;
  }

}
