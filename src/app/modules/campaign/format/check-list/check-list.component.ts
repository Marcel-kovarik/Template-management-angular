import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Format } from '../../../../classes/format';
import { ResourceSpec } from '../../../../classes/resource-spec';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({ display: 'table-row', height: '50px'})),
      state('closed', style({ display: 'none', height: '39px', })),

      transition('open => closed', [
        animate('.5s ease-out',  style({ opacity: 0 }))
      ]),
      transition('closed => open', [
        style({ display: 'table-row', opacity: 0 }),
        animate('.1s ease-out',  style({ height: '50px' })),
        animate('.5s linear',  style({ opacity: 1 })),
      ]),

      state('up', style({ transform: 'rotate(180deg)' })),
      state('down', style({ transform: 'rotate(0deg)' })),
    ]),
  ]
})
export class CheckListComponent implements OnInit {

  @Output() trigger = new EventEmitter();
  @Output() updateTrigger = new EventEmitter<{resource: any, parentResource: any}>();
  @Output() popverOverHiddenTrigger = new EventEmitter();
  @Input() checklist: ResourceSpec[] = [];
  @Input() edited: any = [];

  @Input() format: string;
  @Input() formatData: any = [];
  @Input() formatResource: Format;
  @Input() server: any = [];

  counter: any = [];
  dropChild: any = {};
  
  constructor() { }

  ngOnInit(): void {
    this.counter = this.elementCount();
  }

  editTrigger(resource: ResourceSpec): void {
    if (resource.child) {
      this.dropChild[resource.id] = !this.dropChild[resource.id];
    } else {
      if(resource.opener === "screenSection") {
        document.getElementById(resource.settingsKeys[0]).click();
      } else {
        this.trigger.emit(resource.opener);
      }
    }
  }
  getResource(id: number, childId?: String | null): ResourceSpec {
    const resource = this.formatResource.formatSpec.resourceSpec.find(e => e.id === id);
    return !childId ? resource : resource.child.find(c => c.id === childId)
  }

    /**
   * Used to indicate recorded datas to user
   * @param resource any
   * @param parentResource any | undefined
   */
  updateResourceTrigger(resource: any, parentResource: any): void {
    this.updateTrigger.emit({resource: resource, parentResource: parentResource});
  }
  popverOverHidden() {
    this.popverOverHiddenTrigger.emit();
  }
  private elementCount(): any {
    const counter = [];
    this.checklist.forEach(e => {
      if (counter[e.resourceType]) {
        counter[e.resourceType] += 1;
      } else {
        counter[e.resourceType] = 1;
      }
    });
    return counter;
  }
}
