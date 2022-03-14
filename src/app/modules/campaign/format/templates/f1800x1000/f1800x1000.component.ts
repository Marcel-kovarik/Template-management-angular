import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Format } from '../../../../../classes/format';
import { ResourceSpec } from '../../../../../classes/resource-spec';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-f1800x1000',
  templateUrl: './f1800x1000.component.html',
  styleUrls: ['./f1800x1000.component.scss']
})
export class F1800x1000Component implements OnInit, OnDestroy {

  @ViewChild('contentBg') public contentBg: NgbPopover;
  @ViewChild('rightAvatarRef') public rightAvatarRef: NgbPopover;
  @ViewChild('leftAvatarRef') public leftAvatarRef: NgbPopover;

  @Input() format: Format;
  @Input() edited: any = [];
  @Input() server: any = [];
  @Input() formatData: any = [];

  @Output() childTrigger = new EventEmitter<string>();

  // switch between 100% and fit screen
  isFitScreen = true;

  constructor() {}

  ngOnInit(): void {
    document.getElementById('content').style.padding = '0px';
    document.getElementById('content').style.overflow = 'hidden';
    const note: HTMLElement = document.querySelector('.main-container') as HTMLElement;
    note.style.overflow = 'auto';
  }

  ngOnDestroy(): void {
    document.getElementById('content').style.paddingLeft = '40px';
    document.getElementById('content').style.paddingRight = '40px';
    document.getElementById('content').style.overflow = 'initial';
    const note: HTMLElement = document.querySelector('.main-container') as HTMLElement;
    note.style.overflow = 'initial';
  }

  /**
   * Give a resource by his ID
   * @param id number
   */
    getResource(id: number): ResourceSpec {
    const resource = this.format.formatSpec.resourceSpec.filter(e => {
      return e.id === id;
    });
    return resource[0];
  }

  /**
   * Used to indicate recorded datas to user
   * @param resource any
   */
  updateResource(resource: any): void {
    this.edited[resource.id] = true;
    this.server[resource.id] = true;
  }

  /****** switch screen mode ******/
  switchMode(): void {
    this.isFitScreen = !this.isFitScreen;
  }

  /**
   * Call parent trigger function color or image component by simulating a click
   * @param elementId string
   */
  editTrigger(elementId: string): void {
    this.childTrigger.next(elementId);
  }

  popoverClose(): void {
    this.contentBg.close();
    this.rightAvatarRef.close();
    this.leftAvatarRef.close();
  }

}
