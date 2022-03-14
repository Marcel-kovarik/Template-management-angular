import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-trigger-action',
  templateUrl: './trigger-action.component.html',
  styleUrls: ['./trigger-action.component.scss']
})
export class TriggerActionComponent implements OnInit {

  @Input() element;
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Input() canDuplicate = true;

  @Output() duplicate: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  sendEdit(element: any): void {
    this.edit.emit(element);
  }

  sendDuplicate(element: any): void {
    this.duplicate.emit(element);
  }

  sendDelete(element: any): void {
    this.delete.emit(element);
  }
}
