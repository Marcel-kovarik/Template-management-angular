import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2 } from '@angular/core';
import { SelectList } from '../../../../interfaces/node-editor-model';
import { ConvNodeVM } from '../../../../classes/conversation/conv-nodeVM';

@Component({
  selector: 'app-open-ended-select',
  templateUrl: './open-ended-select.component.html',
  styleUrls: ['./open-ended-select.component.scss']
})
export class OpenEndedSelectComponent implements OnInit, OnChanges {
  @Input() editedNode: ConvNodeVM;
  @Input() selectType: string;
  @Input() defaultValue: string;
  @Input() itemList: any;
  @Output() parentFunc = new EventEmitter<any>();

  isSubMenu = false;
  selectedItem: SelectList;
  selectList: SelectList[];
  listenerFn: () => void;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // TODO : merge multiple choice with bultins element to remove ngIf selecType
    /****** Close sub menu by a click event ******/
    this.listenerFn = this.renderer.listen(document, 'click', (event) => {
      if (!event.target.closest('.selected-item')) {
        this.isSubMenu = false;
      }
    });
  }

  ngOnChanges(): void {
    this.selectList = [];
    if (this.selectType === 'answer') {
      this.selectedItem = { name: 'CHOOSE_YOUR_ANSWER_TYPE', value: '' };
      this.selectList.push({ name: 'MULTIPLE_CHOICE', value: 'MultipleChoice' });
      if (this.editedNode.convNode.Answers.AnswerType === 'MultipleChoice') {
          this.selectedItem = { name: 'MULTIPLE_CHOICE', value: 'MultipleChoice' };
      }
      this.itemList.forEach(item => {
        this.selectList.push({ name: item.nodeBuiltinLabel, value: item.nodeBuiltinCode });
        if (this.editedNode.convNode.Answers.AnswerType === item.nodeBuiltinCode) {
          this.selectedItem = { name: item.nodeBuiltinLabel, value: item.nodeBuiltinCode };
        }
      });

    } else if (this.selectType === 'generic') {
      if (this.defaultValue === '' || this.defaultValue === undefined) {
        this.selectedItem = { name: 'CHOOSE_A_ITEM', value: '' };
      } else {
        const builtOption = this.itemList.filter(item => item.listValueCode === this.defaultValue)[0];
        this.selectedItem = { name: builtOption.listValueLabel, value: builtOption.listValueCode };
      }
      this.itemList.forEach(item => {
        this.selectList.push({ name: item.listValueLabel, value: item.listValueCode });
      });

    } else {
        this.selectedItem = { name: 'DEFAULT', value: '' };
    }

    this.toggleDeleteAnswerOption(this.selectedItem.value !== '');

  }

  /**
   * Set selected Item
   * @param value string
   */
  selectGeneric(value: string): void {
    // Update select list to be able to remove answers
    this.toggleDeleteAnswerOption((value !== 'DELETE'));
    if (value !== 'DELETE') {
      this.selectedItem = this.selectList.filter(item => item.value === value)[0];
    }
    this.parentFunc.emit(value);
  }

  toggleDeleteAnswerOption(value: boolean): void {
    if (this.selectType !== 'answer') {
      return;
    }
    // Check if DELETE element is present
    const found = this.selectList.findIndex(x => x.value === 'DELETE');
    if (value && found === -1) {
      this.selectList.unshift({ name: 'REMOVE_ANSWER', value: 'DELETE' });
    } else if (!value) {
      if (found !== -1) {
        this.selectList.splice(found, 1);
      }
      this.selectList.unshift({ name: 'CHOOSE_YOUR_ANSWER_TYPE', value: '' });
      this.selectedItem = { name: 'CHOOSE_YOUR_ANSWER_TYPE', value: '' };
    }
  }
}
