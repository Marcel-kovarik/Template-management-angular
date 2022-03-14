import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { Format } from '../../../../../classes/format';
import { ResourceSpec } from '../../../../../classes/resource-spec';

@Component({
  selector: 'app-f300x600intro-image',
  templateUrl: './f300x600intro-image.component.html',
  styleUrls: ['./f300x600intro-image.component.scss'],
})
export class F300x600introImageComponent implements OnInit {
  @ViewChild('logoHeader') public logoHeader: NgbPopover;
  @ViewChild('backgroundRef') public backgroundRef: NgbPopover;
  @ViewChild('introductionBgRef') public introductionBgRef: NgbPopover;
  @ViewChild('rightAvatarRef') public rightAvatarRef: NgbPopover;
  @ViewChild('leftAvatarRef') public leftAvatarRef: NgbPopover;
  @ViewChild('confirmModal', { read: TemplateRef }) public confirmModal:TemplateRef<any>;

  @Input() format: Format;
  @Input() edited: any = [];
  @Input() server: any = [];
  @Input() formatData: any = [];

  slideNo: Boolean = true;

  constructor( private modalService: NgbModal ) {}

  ngOnInit(): void {
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
  checkComplated() : void{
    const complated = this.format.formatSpec.resourceSpec.every((ele: ResourceSpec) => (this.edited[ele.id] || this.server[ele.id]));
    if(complated) {
      this.openModal(this.confirmModal);
    }
  }
  checkComplatedOnlyRequired() : void {
    let complated = this.format.formatSpec.resourceSpec.every((ele: ResourceSpec) => ((ele.mandatory === true) ? (this.edited[ele.id] || this.server[ele.id]) : true));
    if(complated) {
      this.openModal(this.confirmModal);
    }
  }
  popverOverHidden() {
    this.checkComplated();
    // this.checkComplatedOnlyRequired();
  }
  /**
   * Used to indicate recorded datas to user
   * @param resource any
   */
  updateResource(resource: any): void {
    this.edited[resource.id] = true;
    this.server[resource.id] = true;
  }

  popoverClose(): void {
    this.logoHeader.close();
    if(this.slideNo){
      this.introductionBgRef.close();
    } else {
      this.backgroundRef.close();
      this.rightAvatarRef.close();
      this.leftAvatarRef.close();
    }
  }
  openModal(content: TemplateRef<any>): void {
    this.modalService.open(content, { windowClass: 'confirm-modal' }).result.then((result) => {
      // console.log('result', result);
    }, (reason) => {
      // console.log('reason', reason);
    });
  }

  changeSlide(v: Boolean): void{
    this.slideNo = v;
  }

}
