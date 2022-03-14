import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { Format } from '../../../../../classes/format';
import { ResourceSpec } from '../../../../../classes/resource-spec';

@Component({
  selector: 'app-responsive',
  templateUrl: './responsive.component.html',
  styleUrls: ['./responsive.component.scss']
})
export class ResponsiveComponent implements OnInit, OnDestroy {

  @ViewChild('contentBg') public contentBg: NgbPopover;
  @ViewChild('rightAvatarRef') public rightAvatarRef: NgbPopover;
  @ViewChild('leftAvatarRef') public leftAvatarRef: NgbPopover;
  @ViewChild('confirmModal', { read: TemplateRef }) public confirmModal:TemplateRef<any>;

  @Input() format: Format;
  @Input() edited: any = [];
  @Input() server: any = [];
  @Input() formatData: any = [];

  @Output() childTrigger = new EventEmitter<string>();

  // switch between 100% and fit screen
  isFitScreen = true;
  screenBackground: number;

  constructor( private modalService: NgbModal ) {}
  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(wid: number) {
    this.screenBackground = wid;
  }
  ngOnInit(): void {
    document.getElementById('content').style.padding = '0px';
    document.getElementById('content').style.overflow = 'hidden';
    const note: HTMLElement = document.querySelector('.main-container') as HTMLElement;
    note.style.overflow = 'auto';
    this.screenBackground = window.innerWidth;
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
    return this.format.formatSpec.resourceSpec.find(e => e.id === id);
  }

  updateFromCheckList({resource, parentResource}: any) : void{
    this.updateResource(resource, parentResource);
  }
  /**
   * Used to indicate recorded datas to user
   * @param resource any
   */
  updateResource(resource: any, parentResource: any): void {

    if(parentResource?.child?.length > 0) {
      this.edited[`${parentResource.id}_${resource.id}`] = true;
      this.server[`${parentResource.id}_${resource.id}`] = true;

      const parentUpdateStatus = parentResource.child.every(ele => this.edited[`${parentResource.id}_${ele.id}`] || this.server[`${parentResource.id}_${ele.id}`]);
      this.edited[parentResource.id] = parentUpdateStatus;
      this.server[parentResource.id] = parentUpdateStatus;
    } else {
      this.edited[resource.id] = true;
      this.server[resource.id] = true;
    }

  }
  checkComplated() : void {
    const complated = this.format.formatSpec.resourceSpec.every((ele: ResourceSpec) => (this.edited[ele.id] || this.server[ele.id]));
    if(complated) {
      this.openModal(this.confirmModal);
    }
  }
  checkComplatedOnlyRequired() : void {
    let complated = this.format.formatSpec.resourceSpec.every((ele: ResourceSpec) => ((ele.mandatory === true) ? (this.edited[ele.id] || this.server[ele.id]) : true));
    complated = complated && ((this.edited[1] || this.server[1]) || (this.edited[2] || this.server[2]));
    if(complated) {
      this.openModal(this.confirmModal);
    }
  }
  popverOverHidden() {
    this.checkComplated();
    // this.checkComplatedOnlyRequired();
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
  openModal(content: TemplateRef<any>): void {
    this.modalService.open(content, { windowClass: 'confirm-modal' }).result.then((result) => {
      // console.log('result', result);
    }, (reason) => {
      // console.log('reason', reason);
    });
  }
}
