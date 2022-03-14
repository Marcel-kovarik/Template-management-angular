import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  @Input() id: number;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  editAction(): void {
    this.edit.emit(this.id);
  }

  deleteAction(): void {
    this.delete.emit(this.id);
  }

}
