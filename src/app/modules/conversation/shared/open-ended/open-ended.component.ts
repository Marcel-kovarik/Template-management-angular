import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConvNodeVM } from '../../../../classes/conversation/conv-nodeVM';
import { BuiltinOption } from '../../../../classes/builtin-option';

@Component({
  selector: 'app-open-ended',
  templateUrl: './open-ended.component.html',
  styleUrls: ['./open-ended.component.scss']
})
export class OpenEndedComponent implements OnInit, OnChanges {
  @Input() editedNode: ConvNodeVM;
  @Output() updateLayout = new EventEmitter<any>();

  selectType = 'generic';
  selectedHelp: string;
  optionList: BuiltinOption[] = [];
  display = true;

  constructor(
    private domSanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.optionList = this.editedNode.convNode.Answers.AnswerList[0].Builtin.nodeBuiltinOptions;
    this.display = (this.optionList.length > 0);
  }

  ngOnChanges(): void {
    this.selectedHelp = '';
  }

  /**
   * Set builtin list value by a select change
   * @param selectValue ListValue
   */
  changeFn(selectValue: string): void {
    this.editedNode.convNode.Answers.AnswerList[0].Builtin.nodeBuiltinOptions.forEach(item => {
      if (item.typeDataOption === 'list') {
        item.defaultValue = selectValue;
      }
    });
    this.updateLayout.emit();
  }

  /**
   * Set builtin values by a input change
   * @param event any,
   * @param index boolean
   */
  handleInputChange(event: any, index: boolean): void {
    this.editedNode.convNode.Answers.AnswerList[0].Builtin.nodeBuiltinOptions.forEach(item => {
      if (item.codeOption === event.target.name) {
        item.defaultValue = index ? event.target.value : event.target.checked.toString();
      }
    });
    this.updateLayout.emit();
  }

  /**
   * Upload voice by input change
   * @param event any
   */
  voiceUpload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 3 * 1024 * 1024) {
        this.snackBar.open('Mp3 file size is too big!', 'X', {
          duration: 2000,
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.editedNode.convNode.Answers.AnswerList[0].Builtin.nodeBuiltinOptions.forEach(item => {
          if (item.codeOption === event.target.name) {
            item.defaultValue = this.domSanitizer.bypassSecurityTrustUrl(reader.result as string) as string;
          }
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * Display help by a click icon
   * @param event any,
   * @param name string
   */
  displayHelpString(event: any, name: string): void {
    event.preventDefault();
    this.selectedHelp = name;
  }
}
