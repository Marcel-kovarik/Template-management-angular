import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Format } from '../../../../../classes/format';
import { ResourceSpec } from '../../../../../classes/resource-spec';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-f300x600',
  templateUrl: './f300x600.component.html',
  styleUrls: ['./f300x600.component.scss']
})

export class F300x600Component implements OnInit {
  @ViewChild('logoHeader') public logoHeader: NgbPopover;
  @ViewChild('contentBg') public contentBg: NgbPopover;
  @ViewChild('rightAvatarRef') public rightAvatarRef: NgbPopover;
  @ViewChild('leftAvatarRef') public leftAvatarRef: NgbPopover;

  @Input() format: Format;
  @Input() edited: any = [];
  @Input() server: any = [];
  @Input() formatData: any = [];

  constructor() {}

  ngOnInit(): void { }

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

  popoverClose(): void {
    this.logoHeader.close();
    this.contentBg.close();
    this.leftAvatarRef.close();
    this.rightAvatarRef.close();
  }
}
