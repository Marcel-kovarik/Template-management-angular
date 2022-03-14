import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnChanges, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as models from '../../../../interfaces/convflow-models';
import { ObjectID } from 'bson';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Loading, EditMode, AnswerCreate, SectionList } from '../../../../interfaces/node-editor-model';
import { FormControl, FormGroup } from '@angular/forms';
import { BuiltinService } from '../../../../services/builtin.service';
import { Builtin } from '../../../../classes/builtin';
import { TranslateService } from '@ngx-translate/core';
import { ConvNodeVM } from '../../../../classes/conversation/conv-nodeVM';
import { DialogService } from '../../../../services/dialog.service';
import { TextSection } from '../../../../classes/text-section';
import { AppService } from '../../../../services/app.service';

@Component({
  selector: 'app-node-editor',
  templateUrl: './node-editor.component.html',
  styleUrls: ['./node-editor.component.scss']
})
export class NodeEditorComponent implements OnInit, OnChanges {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<any>();
  @Output() updateLayout = new EventEmitter<any>();
  @Output() deleteNode = new EventEmitter<any>();
  @Input() editedNode: ConvNodeVM;
  @Input() conversationLang: string;

  @ViewChild('answerRef') answerRef: ElementRef;
  @ViewChild('linkRef') linkRef: ElementRef;
  @ViewChild('caution', { static: false }) private caution;
  @ViewChild('synonyms', { static: false }) private synonymsModal;

  form = new FormGroup({
    answerType: new FormControl(''),
  });

  editorLang: string;
  player = null;
  playing = [];
  sectionList: SectionList[];
  builtinList: Builtin[];
  builtinListLoaded = false;
  answerText: string;
  synonymsData: models.Synonyms;
  isLoading: Loading = { Audio: false, Image: false, Mp3: false };
  isEditMode: EditMode = { status: false, id: '', position: 0, index: 0 };
  answerCreat: AnswerCreate = { text: '', isCancel: false };
  synonymsCreat: AnswerCreate = { text: '', isCancel: false };
  sectionSelected = '';
  closeResult = '';
  answerId: string;
  active = 1;
  isEndNode: boolean;
  nodeName = new FormControl();
  editing = false;
  selectType = 'answer';
  isAnswerEdit = false;

  linkButton = { id: '4', name: 'ADD_LINK', type: 'Link', icon: 'icon-link' };
  linkError = false;
  linkLabelError = false;
  hasEndLink = false;
  answerEdit: models.AnswerEdit;

  textSection: TextSection = { text: '', audName: '', audSrc: '' };
  linkSection: models.LinkSection = { text: '', link: '' };
  imageSection: models.ImgSection = { src: '' };
  audioSection: models.AudSection = { audName: '', src: '', audSize: 0 };

  static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  constructor(
    private domSanitizer: DomSanitizer,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private builtinService: BuiltinService,
    private translate: TranslateService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    // this._initCheckEndLink();
    // get builtins
    this.editorLang = this.translate.defaultLang;
    this.builtinService.getBuiltins(this.editorLang).subscribe(list => {
      this.builtinList = list;
      this.builtinListLoaded = true;
    });
    this.synonymsData = { button: [], SynonymsItem: [] };
    this.sectionList = [
      { id: '1', name: 'ADD_TEXT', type: 'Text', icon: 'icon-text' },
      { id: '2', name: 'ADD_IMG', type: 'Image', icon: 'icon-picture' },
      { id: '3', name: 'ADD_SOUND', type: 'Audio', icon: 'icon-music' }
    ];
    if (this.editedNode.convNode.Sections.length === 0) {
      this.sectionSelected = 'Text';
    }
    if (this.editedNode.convNode.Answers.AnswerList.length > 0) {
      this.answerCreat = { ...this.answerCreat, isCancel: true };
    }
    // this.answerTypeSelected = this.editedNode.convNode.Answers.AnswerType;
    this.synonymsData = {
      button: [],
      SynonymsItem: []
    };
    this._checkAddLinkStatus();

    if (this.editedNode.convNode.Answers.AnswerType !== null
      && this.editedNode.convNode.Answers.AnswerType !== 'MultipleChoice') {
      this.builtinService.getBuiltinByCode(this.editedNode.convNode.Answers.AnswerType, this.editorLang, this.conversationLang)
        .subscribe(builtins => {
          this.editedNode.convNode.Answers.AnswerList[0].Builtin.nodeBuiltinOptions.forEach( (option, key) => {
            const defautlOption = builtins.nodeBuiltinOptions.find(e => e.codeOption === option.codeOption);
            this.editedNode.convNode.Answers.AnswerList[0].Builtin.nodeBuiltinOptions[key] = {...defautlOption, ...option};
          });
      });
    }
  }

  ngOnChanges(): void {
    this.form.setValue({ answerType: this.editedNode.convNode.Answers.AnswerType || '' });
    this.isEndNode = this.editedNode.convNode.IsEndNode;
    this.nodeName.setValue(this.editedNode.convNode.Name);
    this.answerEdit = {
      synonyms: { SynonymsItem: [], button: [] },
      image: { src: '' },
      styles: { textColor: '#FFFFFF', bgColor: '#FFFFFF' }
    };
  }

  drop(event: CdkDragDrop<any>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.emptyElementRemove(); // empty array remove
    this.updateLayout.emit(); // node layout update
  }

  /**
   * Remove answer Item by a delete button click
   * @param id string
   */
  answerItemDel(id: string): void {
    const elementIdxToDel = this.editedNode.convNode.Answers.AnswerList.findIndex(x => x._id === id);
    this.editedNode.convNode.Answers.AnswerList.splice(elementIdxToDel, 1);
    const selectedItem = this.editedNode.network.convConnections.filter(item => item.srcAnswerConnector.answer._id === id)[0];
    if (selectedItem) {
      const index = this.editedNode.network.convConnections.indexOf(selectedItem);
      this.editedNode.network.convConnections.splice(index, 1);
    }

    // When last item is deleted the node is set back to as end node
    if (this.editedNode.convNode.Answers.AnswerList.length === 0) {
      this._setEndNode(true);
    }

    this.updateLayout.emit(); // node layout update
  }

  // answer creation element remove
  answerCancel(): void {
    if (this.editedNode.convNode.Answers.AnswerList.length === 0) {
      this.form.setValue({ answerType: '' });
    }
    this.answerCreat = { ...this.answerCreat, isCancel: true };
  }

  /***** answer creation element Set *****/
  answerSet(): void {
    if (this.editedNode.convNode.Answers.AnswerList.length > 2) {
      this.open(this.caution);
    } else {
      this.answerCreat = { ...this.answerCreat, isCancel: false };
      setTimeout(() => {
        if (this.answerRef?.nativeElement) {
          this.answerRef.nativeElement.focus();
        }
      }, 0);
    }
  }

  /****** caution continue button click ******/
  cautionContinue(): void {
    this.modalService.dismissAll();
    this.answerCreat = { ...this.answerCreat, isCancel: false };
    setTimeout(() => {
      if (this.answerRef?.nativeElement) {
        this.answerRef.nativeElement.focus();
      }
    }, 0);
  }

  /****** answer save ******/
  answerSave(): void {
    this.editedNode.convNode.Answers.AnswerList.push({
      _id: new ObjectID().toHexString(),
      AnswerText: this.answerCreat.text,
    });
    this._setEndNode(false);
    this.answerCreat = { text: '', isCancel: true };
    this.updateLayout.emit(); // node layout update
  }

  /**
   * Save answer by a keyUp event on input
   * @param event KeyboardEvent
   * @param index string
   */
  answerSaveByKeyUp(event: KeyboardEvent, index: string): void {
    if (index === 'answer' && this.answerCreat.text !== '' && event.code === 'Enter') { this.answerSave(); }
    if (index === 'synonyms' && this.synonymsCreat.text !== '' && event.code === 'Enter') { this.addSynonymItem(); }
    this.updateLayout.emit(); // node layout update
  }

  /***** open snackBar for error message ******/
  openSnackBar(translateKey: string, action = 'X'): void {
    this.snackBar.open(this.translate.instant(translateKey), action, {
      duration: 5000,
    });
  }

  /**
   * close right panel editor
   */
  closeEditor(): void {
    this.close.emit();
  }

  /***
   * Close answer advance settings editor
    */
  closeAnswerEditBox(): void {
    this.editedNode.convNode.Answers.AnswerList.forEach(item => {
      if (item._id === this.answerId) {
        item.AnswerEdit = this.answerEdit;
      }
    });
    this.isAnswerEdit = false;
  }

  /**
   * Open or close section editor
   * @param type string
   */
  sectionSelect(type: string): void {
    // Close section on second click
    if (this.sectionSelected === type) {
      this.sectionSelected = '';
      if (type === 'Text') {
        this.clearTextSection();
      }
      return;
    }
    this.sectionSelected = type;
  }

  /**
   * Complete a section by Done button a click
   * @param sectionType string
   */
  sectionAdd(sectionType: string): void {
    this.sectionSelected = '';
    switch (sectionType) {
      case models.SectionType.Text:
        if (this.isEditMode.status) {
          this.editedNode.convNode.Sections[this.isEditMode.position][this.isEditMode.index].AddText = { ...this.textSection };
          this.isEditMode = { status: false, id: '', position: 0, index: 0 };
        } else {
          const textArray = new Array({
            SectionType: models.SectionType.Text,
            _id: new ObjectID().toHexString(),
            AddText: { ...this.textSection }
          });
          this.editedNode.convNode.Sections.push(textArray);
        }
        this.clearTextSection();
        break;
      case models.SectionType.Image:
        const imgArray = new Array({
          SectionType: models.SectionType.Image,
          _id: new ObjectID().toHexString(),
          AddImage: { ...this.imageSection }
        });
        this.editedNode.convNode.Sections.push(imgArray);
        this.clearImgSection();
        break;
      case models.SectionType.Audio:
        const audioArray = new Array({
          SectionType: models.SectionType.Audio,
          _id: new ObjectID().toHexString(),
          AddAudio: { ...this.audioSection }
        });
        this.editedNode.convNode.Sections.push(audioArray);
    }
    this._checkAddLinkStatus();
    this.updateLayout.emit(); // update node layout
  }

  /**
   * Edit a section by edit button a click
   * @param sectionInformation any
   */
  sectionEdit(sectionInformation: any): void {
    // Extract key and id of section to be edited
    const sectionKey = sectionInformation.sectionKey;
    const sectionId = sectionInformation.sectionId;

    const nodeIndex = this.editedNode.convNode.Sections[sectionKey].findIndex(x => x._id === sectionId);
    this.isEditMode = { status: true, id: sectionId, position: sectionKey, index: nodeIndex };

    this.sectionSelected = this.editedNode.convNode.Sections[sectionKey][nodeIndex].SectionType;
    if (this.sectionSelected === 'Text') {
      this.textSection = { ...this.editedNode.convNode.Sections[sectionKey][nodeIndex].AddText };
    }
    if (this.sectionSelected === 'Link') {
      this.linkSection = { ...this.editedNode.convNode.Sections[sectionKey][nodeIndex].AddLink };
    }
  }

  /**
   * Update section for child component (only used for add-text-component 'Text')
   * @param section any
   */
  sectionUpdate(section: any): void {
    if (section.type === 'Text') {
      this.textSection = section.section;
    }
    if (this.sectionSelected === 'Link') {
      this.linkSection = section.section;
    }
  }

  /**
   * Remove a section by remove button a click
   * @param sectionInformation any
   */
  sectionRemove(sectionInformation: any): void {
    // Extract key and id of section to be removed
    const sectionKey = sectionInformation.sectionKey;
    const sectionId = sectionInformation.sectionId;

    const elementIdxToDel = this.editedNode.convNode.Sections[sectionKey].findIndex(x => x._id === sectionId);
    if (this.editedNode.convNode.Sections[sectionKey][elementIdxToDel].SectionType === 'Link') {
      this.editedNode.convNode.hasEndLink = this.hasEndLink = false;
    }

    this.editedNode.convNode.Sections[sectionKey].splice(elementIdxToDel, 1);
    // If section is currently editing hide section and reset all data
    if (this.sectionSelected !== '') {
      this.sectionSelected = '';
      this.isEditMode = { status: false, id: '', position: 0, index: 0 };
      this.clearAllSections();
    }

    this.emptyElementRemove(); // empty item remove
    if ((!this.editedNode.convNode.Sections || this.editedNode.convNode.Sections.length <= 0)) {
      this.editedNode.convNode.Answers.AnswerList = [];
      delete this.editedNode.convNode.Answers.AnswerType;
      this.editedNode.network.updateConvNodeConnections();
    }
    this._checkAddLinkStatus();
    this.updateLayout.emit(); // update node layout
  }

  /**
   * AddLink to section
   */
  addLink(): void {
    if (this.linkSection.link !== '') {
      this.linkError = !this.appService.macroUrlRegex(this.linkSection.link);
      this.linkLabelError = (this.linkSection.text === '');
      if (!this.linkError || this.linkLabelError) {
        this.linkSection.text = this.linkSection.text === '' ? this.linkSection.link : this.linkSection.text;
        if (this.isEditMode.status) {
          this.editedNode.convNode.Sections[this.isEditMode.position][this.isEditMode.index].AddLink = { ...this.linkSection };
          this.isEditMode = { status: false, id: '', position: 0, index: 0 };

        } else {
          const linkArray = new Array({
            SectionType: models.SectionType.Link,
            _id: new ObjectID().toHexString(),
            AddLink: { ...this.linkSection }
          });
          this.editedNode.convNode.Sections.push(linkArray);
          this.clearLinkSection();
          this.editedNode.convNode.IsEndNode = true;
          this.isEndNode = true;
          this.editedNode.convNode.hasEndLink = true;
          this.hasEndLink = true;
          const index = this.sectionList.findIndex(x => x.id === '4');
          this.sectionList.splice(index, 1);
        }
        this.sectionSelected = '';
        this._checkAddLinkStatus();
        this.updateLayout.emit();
      }
    }
  }

  /**
   * Upload image file by input change
   * @param event any
   * @param isAud string
   */
  addAudio(event: any, isAud: string): void {
    if (event.target.files && event.target.files[0]) {
      this.isLoading = { ...this.isLoading, Audio: true };
      if (event.target.files[0].size > 3 * 1024 * 1024) {
        this.openSnackBar('ALERTS.MP3_TOO_BIG', 'X');
        this.isLoading = { ...this.isLoading, Audio: false };
        return;
      }
      // File Preview
      if (isAud === 'text') {
        this.textSection = { ...this.textSection, audName: event.target.files[0].name };
      } else {
        const fileSize = Math.round(event.target.files[0].size / 1024);
        this.audioSection = { ...this.audioSection, audName: event.target.files[0].name, audSize: fileSize };
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (isAud === 'text') {
          // // @ts-ignore
          this.textSection = { ...this.textSection, audSrc: reader.result.toString() };
        } else {
          this.audioSection = { ...this.audioSection, src: reader.result.toString() };
          this.sectionAdd(models.SectionType.Audio);
        }
        this.isLoading = { ...this.isLoading, Audio: false };
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.updateLayout.emit(); // update node layout
  }

  /**
   * Upload image to section
   * @param e any
   */
  addImage(e: any): void {
    this.isLoading = { ...this.isLoading, Image: true };
    const file: File = e.target.files[0];
    // image file size validation
    if (e.target.files[0].size > 3 * 1024 * 1024) {
      this.openSnackBar('ALERTS.IMG_TOO_HEAVY', 'X');
      this.isLoading = { ...this.isLoading, Image: false };
      return;
    }

    const reader = new FileReader();
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    reader.addEventListener('load', (event: any) => {
      img.onload = () => {
        this.imageSection.src = event.target.result;
        this.isLoading = { ...this.isLoading, Image: false };
        this.sectionAdd(models.SectionType.Image);
      };
    });
    reader.readAsDataURL(file);
    this.updateLayout.emit(); // update node layout
  }

  /**
   * Clear Section objects TEXT
   */
  clearTextSection(): void {
    this.textSection = {text: '', audName: '', audSrc: ''};
  }

  removeCustomAudio(): void {
    this.textSection = { ...this.textSection, audSrc: '', audName: ''};
    this.updateLayout.emit(); // update node layout
  }

  /**
   * Clear Section objects LINK
   */
  clearLinkSection(): void {
    this.linkSection = { text: '', link: '' };
  }

  /**
   * Clear Section objects IMAGE
   */
  clearImgSection(): void {
    this.imageSection = { src: '' };
  }

  /**
   * Clear Section objects AUDIO
   */
  clearAudioSection(): void {
    this.audioSection = { audName: '', src: '', audSize: 0 };
  }

  /**
   * Clear Section objects ALL
   */
  clearAllSections(): void {
    this.clearTextSection();
    this.clearLinkSection();
    this.clearImgSection();
    this.clearAudioSection();
  }

  /***** Remove Add text section ******/
  removeAddText(): void {
    this.sectionSelected = '';
    this.clearTextSection();
    this.updateLayout.emit(); // update node layout
  }

  /****** empty array remove ******/
  emptyElementRemove(): void {
    for (let i = 0; i < this.editedNode.convNode.Sections.length; i++) {
      if (this.editedNode.convNode.Sections[i].length === 0) {
        // remove a section from a node
        this.editedNode.convNode.Sections.splice(i, 1);
      }
    }
  }

  /****** remove all contents in editor ******/
  removeContent(): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_NODE')).then(resp => {
      if (resp) {
        this.close.emit();
        this.deleteNode.emit();
      }
    }).catch();
  }

  /****** Open modal ******/
  open(content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${NodeEditorComponent.getDismissReason(reason)}`;
    });
  }

  /**
   * Open synonyms Modal by click answer content
   * @param text string,
   * @param id string
   */
  synonymsOpen(text: string, id: string): void {
    this.answerText = text;
    this.answerId = id;
    this.editedNode.convNode.Answers.AnswerList.forEach(item => {
      if (item._id === this.answerId) {
        const tempArr = {
          synonyms: { SynonymsItem: [], button: [] },
          image: { src: '' },
          styles: { textColor: '#FFFFFF', bgColor: '#FFFFFF' }
        };
        this.answerEdit = item?.AnswerEdit || tempArr;
      }
    });
    this.isAnswerEdit = true;
  }

  /****** Add a synonym ******/
  addSynonymItem(): void {
    this.synonymsCreat = { ...this.synonymsCreat, isCancel: false };
    const item = { SynonymsId: new ObjectID().toHexString(), Text: this.synonymsCreat.text };
    // add a synonyms item in a node
    this.synonymsData.SynonymsItem.push(item);
  }

  /**
   * Set answer Type by a click selection
   * @param type any
   */
  changeFn(type: any): void {
    if (type === 'DELETE') {
      this.editedNode.convNode.Answers.AnswerList = [];
      delete this.editedNode.convNode.Answers.AnswerType;
      this._updateCanvas();
      this._setEndNode(true);
    } else {
      this.editedNode.convNode.Answers.AnswerType = type;
      this.editedNode.convNode.Answers.AnswerList = [];
      if (models.AnswerType.MultipleChoice === type) {
        setTimeout(() => {
          if (this.answerRef?.nativeElement) {
            this.answerRef.nativeElement.focus();
          }
        }, 0);
        this._updateCanvas();
      } else {
        this.builtinService.getBuiltinByCode(type, this.editorLang, this.conversationLang).subscribe(builtin => {
          this.editedNode.convNode.Answers.AnswerList.push({
            _id: new ObjectID().toHexString(),
            BuiltinLabel: this.translate.instant(builtin.nodeBuiltinLabel),
            Builtin: builtin
          });
          this._setEndNode(false);
          this._updateCanvas();
        });
      }
    }
  }

  setEndedNode(evt: any): void {
    if (this.editedNode.convNode.hasEndLink) {
      evt.preventDefault();
      this.openSnackBar('CONVERSATION.NODE_EDITOR.FINAL_WITH_LINK_ERROR', 'X');
      return;
    }
    this._setEndNode(evt.target.checked);

    if (this.isEndNode) {
      this.editedNode.convNode.Answers.AnswerList = [];
      delete this.editedNode.convNode.Answers.AnswerType;
    }
    // Update layout
    this.updateLayout.emit();
  }

  focusIn(): void {
    this.editing = true;
  }

  updateOrClose(close: boolean): void {
    if (!close) {
      // Update campaign name
      this.editedNode.convNode.Name = this.nodeName.value;
    } else {
      this.nodeName.setValue(this.editedNode.convNode.Name);
    }
    this.editing = false;
  }

  _setEndNode(value: boolean): void {
    this.editedNode.convNode.IsEndNode = value;
    this.isEndNode = value;
  }

  _updateCanvas(): void {
    this.editedNode.network.updateConvNodeConnections();
    this.updateLayout.emit(); // update node layout
  }

  /**
   *
   * @private
   */
  private _checkAddLinkStatus(): void {
    let updateEndLink = true;
    let addButton = false;

    if (this.editedNode.convNode.hasEndLink !== undefined && this.editedNode.convNode.hasEndLink) {
      // Has end link and link is last section remove it
      if (this.editedNode.convNode.Sections.length === 1) {
        this.editedNode.convNode.Sections = [];
        this.editedNode.convNode.hasEndLink = this.hasEndLink = false;
        updateEndLink = false;
      }

    } else {
      // No end link recorded check elements
      if (this.isEndNode && this.editedNode.convNode.Sections.length > 0) {
        addButton = true;
      }
      updateEndLink = false;
    }

    if (addButton && this.sectionList.length === 3) {
      this.sectionList.push(this.linkButton);
    }
    if (!addButton && this.sectionList.length === 4) {
      this.sectionList.pop();
    }
    if (updateEndLink) {
      this._updateEndLinkInSection();
    }
  }

  /**
   * Function used to keep link element at the end of section array
   * since it is a meta data and will always be displayed at the end.
   * @private
   */
  private _updateEndLinkInSection(): void {
    this.editedNode.convNode.Sections
      .push(this.editedNode.convNode.Sections
        .splice(this.editedNode.convNode.Sections
          .findIndex(x => x[0].SectionType === 'Link'), 1)[0]);
  }

  _initCheckEndLink(): void {
    // 01/12/2021 to be removed when passed
    if (this.editedNode.convNode.hasEndLink === undefined) {
      let hasEndLink = false;
      this.editedNode.convNode.Sections.forEach( section => {
        section.forEach(e => {
          if (e.SectionType === 'Link') {
            hasEndLink = true;
          }
        });
      });
      this.editedNode.convNode.hasEndLink = hasEndLink;
    }
  }
}
