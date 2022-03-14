import {Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ResourceSpec } from '../../../../classes/resource-spec';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import iro from '@jaames/iro';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Output() closeFn = new EventEmitter();
  @Output() update = new EventEmitter();

  @Input() resource: ResourceSpec;
  @Input() title: string;
  @Input() data: any;
  @Input() dual: boolean;

  bgColor: string;
  errorMessage = '';
  colorPicker: any;

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    if (this.dual) {
      this.initColorPicker();
      this.bgColor = this.data[this.resource.settingsKeys[1]] ? this.data[this.resource.settingsKeys[1]] : '#F2F2F2';
    }
  }

  updateFile(event: any): void {
    const file = event.target.files[0];
    const videoEl = document.createElement("video");
    videoEl.src = window.URL.createObjectURL(file);

    videoEl.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoEl.src);
      const { videoWidth, videoHeight } = videoEl;
      
      // if(videoWidth<=this.resource.width&&videoHeight<=this.resource.height){
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          this.data[this.resource.settingsKeys[0]] = reader.result.toString();
          this.update.emit(this.resource);
          this.closeFn.emit();
        };
      // } else {
      //   this.errorMessage = this.translate.instant('ALERTS.VIDEO_SIZE_IS_TOO_BIG');
      // }
    }
  }

  initColorPicker(): void {
    setTimeout(() => {
      this.colorPicker = iro.ColorPicker('#colorPicker', { width: 163, color: this.bgColor });
      this.colorPicker.on('color:change', (color: any) => {
        this.update.emit(this.resource);
        this.data[this.resource.settingsKeys[1]] = color.hexString;
        this.bgColor = color.hexString;
      });
    }, 1);
  }

  updateHex(e: any): void {
    const regExp = /[0-9A-Fa-f]{6}/g;
    if (!regExp.test(e.target.value)) {
      return;
    }
    this.colorPicker.color.hexString = e.target.value;
  }

  closeTrigger(): void {
    this.closeFn.emit();
  }

}
