import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import iro from '@jaames/iro';
import { ResourceSpec } from '../../../../classes/resource-spec';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  @Output() update = new EventEmitter();
  @Output() closeFn = new EventEmitter();

  @Input() title: string;
  @Input() data: string;
  @Input() resource: ResourceSpec;
  @Input() dual: boolean;

  leftTabTitle: string;
  colorPicker: any;
  currentPickerActive: number;
  inputHex: any = [];

  constructor() { }

  ngOnInit(): void {
    // Init first color picker
    this.colorPickerInit(0);
    // Set component display data
    this.inputHex.push(this.data[this.resource.settingsKeys[0]] ? this.data[this.resource.settingsKeys[0]] : '#F2F2F2');
    if (this.dual) {
      this.inputHex.push(this.data[this.resource.settingsKeys[1]] ? this.data[this.resource.settingsKeys[1]] : '#F2F2F2');
    }
    this.leftTabTitle = this.title === 'LEFT_SUGGESTION_CHAT_BUBBLE' ? 'TEXT_COLOR' : 'ICON_COLOR';
  }

  /**
   * Instantiate color picker by number
   * @param num number
   */
  colorPickerInit(num: number): void {
    if (num === this.currentPickerActive) {
      return;
    }
    this.currentPickerActive = num;
    setTimeout(() => {
      this.colorPicker = iro.ColorPicker(`#colorPicker${num}`, {
        width: 160,
        handleRadius: 5,
        sliderMargin:5,
        sliderSize:18,
        color: this.inputHex[num],
        layout: [
          {
            component: iro.ui.Wheel,
          },
          {
            component: iro.ui.Slider
          },
          {
            component: iro.ui.Slider,
            options: {
              sliderType: 'alpha'
            }
          },
        ]
      });
      this.colorPicker.on('color:change', (color: any) => {
        this.update.emit(this.resource);
        this.data[this.resource.settingsKeys[num]] = color.hex8String;
        this.inputHex[num] = color.hex8String;
      });
    }, 1);
  }

  /**
   * Manual color update
   * @param e any
   */
  backgroundColorUpdate(e: any): void {
    // Validate input value
    const regExp = /[0-9A-Fa-f]{6}/g;
    if (!regExp.test(e.target.value)) {
      return;
    }
    // Update color picker value
    this.colorPicker.color.hexString = e.target.value;
  }

  /**
   * Close current component popup
   */
  closeTrigger(): void {
    this.closeFn.emit();
  }

}
