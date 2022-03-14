import {Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef} from '@angular/core';
import { ResourceSpec } from '../../../../classes/resource-spec';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import iro from '@jaames/iro';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @ViewChild('imageCropper') imageCropper: ElementRef;

  @Output() closeFn = new EventEmitter();
  @Output() update = new EventEmitter();

  @Input() resource: ResourceSpec;
  @Input() title: string;
  @Input() data: any;
  @Input() dual: boolean;

  bgColor: string;
  errorMessage = '';
  colorPicker: any;
  imageChangedEvent = '';

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    if (this.dual) {
      this.initColorPicker();
      this.bgColor = this.data[this.resource.settingsKeys[1]] ? this.data[this.resource.settingsKeys[1]] : '#F2F2F2';
    }
  }

  updateFile(e: any): void {
    this.errorMessage = '';
    this.imageChangedEvent = e;
    const file: File = e.target.files[0];
    const reader = new FileReader();
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    reader.addEventListener('load', (event: any) => {
      img.onload = () => {
        if (img.width === this.resource.width &&
          img.height === this.resource.height &&
          e.target.files[0].size <= this.resource.maxWeight * 1060) {
          this.data[this.resource.settingsKeys[0]] = event.target.result;
          this.update.emit(this.resource);
          this.closeFn.emit();
        } else if (img.width >= this.resource.width && img.height >= this.resource.height) {
          // open image cropper
          this.modalService.open(this.imageCropper, {size: 'xl'});
        } else {
          this.errorMessage = this.translate.instant('ALERTS.IMAGE_SIZE_IS_TOO_SMALL');
        }
      };
    });
    reader.readAsDataURL(file);
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

  setCroppedImage(baseImage: string, modal: NgbModalRef): void {
    this.data[this.resource.settingsKeys[0]] = baseImage;
    this.update.emit(this.resource);
    this.closeFn.emit();
    modal.close('close image component');
    // this.modalService.dismissAll()
  }
}

