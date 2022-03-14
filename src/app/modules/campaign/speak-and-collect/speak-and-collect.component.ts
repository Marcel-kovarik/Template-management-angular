import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import iro from '@jaames/iro';
import { CampaignService } from '../../../services/campaign.service';
import { Campaign } from '../../../classes/campaign';
import { Crumb } from '../../../interfaces/crumb';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-speak-and-collect',
  templateUrl: './speak-and-collect.component.html',
  styleUrls: ['./speak-and-collect.component.scss']
})
export class SpeakAndCollectComponent implements OnInit {

  @ViewChild('titleDiv') titleDiv: ElementRef;

  campaign: Campaign;
  spcForm: FormGroup;
  crumbs: Crumb[] = [];
  dayToggleStatus: any;
  closedTime: any = '';
  loading = true;

  // banner section color
  bannarActive = 0;
  isBannarColor = false;
  bannarTxtColorPicker: any;
  bannarBgColorPicker: any;
  bannarColor: any = {
    txtColor: '#062D40',
    bgColor: '#FFFFFF'
  };

  // format box color
  boxActive = 0;
  isBoxColor = false;
  boxTxtColorPicker: any;
  boxbgColorPicker: any;
  boxColor: any = {
    txtColor: '#062D40',
    bgColor: '#FFFFFF'
  };

  // business color
  businessActive = 0;
  isBusinessColor = false;
  businessTxtColorPicker: any;
  businessBgColorPicker: any;
  businessColor: any = {
    txtColor: '#062D40',
    bgColor: '#FFFFFF'
  };

  // big button color
  bigBtnActive = 0;
  isBigBtnColor = false;
  bigBtnTxtColorPicker: any;
  bigBtnBgColorPicker: any;
  bigBtnColor: any = {
    txtColor: '#062D40',
    bgColor: '#FFFFFF'
  };

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private campaignService: CampaignService,
    private renderer: Renderer2,
    private translateService: TranslateService) {

    this.campaign = this.campaignService.getCurrentCampaign();
    if (Object.keys(this.campaign).length < 1) {
      this.location.back();
    }
    this.crumbs = [
      {route: '/campaigns/edit', text: this.campaign.name},
      {route: '', text: this.translateService.instant('SPEAK_COLLECT')}
    ];

    this.spcForm = this.formBuilder.group({
      bannerTitle: ['', Validators.required],
      mainTitle: ['', Validators.required],
      businessName: ['', Validators.required],
      address: ['', Validators.required],
      postalcode: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dayToggleStatus = [
      {id: 1, key: 'monday', isShowHour: false, isAddHour: false, start1: '', end1: '', start2: '', end2: ''},
      {id: 2, key: 'tuesday', isShowHour: false, isAddHour: false, start1: '', end1: '', start2: '', end2: ''},
      {id: 3, key: 'wenesday', isShowHour: false, isAddHour: false, start1: '', end1: '', start2: '', end2: ''},
      {id: 4, key: 'thursday', isShowHour: false, isAddHour: false, start1: '', end1: '', start2: '', end2: ''},
      {id: 5, key: 'friday', isShowHour: false, isAddHour: false, start1: '', end1: '', start2: '', end2: ''},
      {id: 6, key: 'saturday', isShowHour: false, isAddHour: false, start1: '', end1: '', start2: '', end2: ''},
      {id: 7, key: 'sunday', isShowHour: false, isAddHour: false, start1: '', end1: '', start2: '', end2: ''},
    ];
  }

  /****** go to prev page ******/
  backClicked(): void {
    this.location.back();
  }

  /****** toggle button switch ******/
  switchBtn(itemKey: string): void {
    const Item = this.dayToggleStatus.filter(x => x.key === itemKey)[0];
    let updateItem;
    if (Item.isShowHour) {
      updateItem = {...Item, isShowHour: !Item.isShowHour, isAddHour: false, start1: '', start2: '', end1: '', end2: ''};
    } else {
      updateItem = {...Item, isShowHour: !Item.isShowHour};
    }
    const index = this.dayToggleStatus.indexOf(Item);
    this.dayToggleStatus[index] = updateItem;
  }

  /****** bannar text color and background color change ******/
  bannarColorPickerChange(active: number, isInit: boolean = false): void {
    if (this.bannarActive === active && !isInit) {
      return;
    }
    this.bannarActive = active;
    if (active === 1) {
      setTimeout(() => {
        this.bannarTxtColorPicker = iro.ColorPicker('#bannarTxtColorPicker', { width: 163, color: this.bannarColor.txtColor });
        this.bannarTxtColorPicker.on('color:change', (color: any) => {
          this.isBannarColor = true;
          this.bannarColor = { ...this.bannarColor, txtColor: color.hexString };
        });
      }, 1);
    } else if (active === 2) {
      setTimeout(() => {
        this.bannarBgColorPicker = iro.ColorPicker('#bannarBgColorPicker', { width: 163, color: this.bannarColor.bgColor });
        this.bannarBgColorPicker.on('color:change', (color: any) => {
          this.isBannarColor = true;
          this.bannarColor = { ...this.bannarColor, bgColor: color.hexString };
        });
      }, 1);
    }
  }

  /****** bannar text color and background color input *******/
  bannarColorInput(val: string, isFlag: number): void {
    const re = /[0-9A-Fa-f]{6}/g;
    if (!re.test(val)) {
      return;
    }
    if (isFlag === 1) {
      this.bannarTxtColorPicker.color.hexString = val;
    } else if (isFlag === 2) {
      this.bannarBgColorPicker.color.hexString = val;
    }
  }

  /****** format box text color and background color change ******/
  boxColorPickerChange(active: number, isInit: boolean = false): void {
    if (this.boxActive === active && !isInit) {
      return;
    }
    this.boxActive = active;
    if (active === 1) {
      setTimeout(() => {
        this.boxTxtColorPicker = iro.ColorPicker('#boxTxtColorPicker', { width: 163, color: this.boxColor.txtColor });
        this.boxTxtColorPicker.on('color:change', (color: any) => {
          this.isBoxColor = true;
          this.boxColor = { ...this.boxColor, txtColor: color.hexString };
        });
      }, 1);
    } else if (active === 2) {
      setTimeout(() => {
        this.boxbgColorPicker = iro.ColorPicker('#boxBgColorPicker', { width: 163, color: this.boxColor.bgColor });
        this.boxbgColorPicker.on('color:change', (color: any) => {
          this.isBoxColor = true;
          this.boxColor = { ...this.boxColor, bgColor: color.hexString };
        });
      }, 1);
    }
  }

  /****** bannar text color and background color input *******/
  boxColorInput(val: string, isFlag: number): void {
    const re = /[0-9A-Fa-f]{6}/g;
    if (!re.test(val)) {
      return;
    }
    if (isFlag === 1) {
      this.boxTxtColorPicker.color.hexString = val;
    } else if (isFlag === 2) {
      this.boxbgColorPicker.color.hexString = val;
    }
  }


  /****** business text color and background color change ******/
  businessColorPickerChange(active: number, isInit: boolean = false): void {
    if (this.businessActive === active && !isInit) {
      return;
    }
    this.businessActive = active;
    if (active === 1) {
      setTimeout(() => {
        this.businessTxtColorPicker = iro.ColorPicker('#businessTxtColorPicker', { width: 163, color: this.businessColor.txtColor });
        this.businessTxtColorPicker.on('color:change', (color: any) => {
          this.isBusinessColor = true;
          this.businessColor = { ...this.businessColor, txtColor: color.hexString };
        });
      }, 1);
    } else if (active === 2) {
      setTimeout(() => {
        this.businessBgColorPicker = iro.ColorPicker('#businessBgColorPicker', { width: 163, color: this.businessColor.bgColor });
        this.businessBgColorPicker.on('color:change', (color: any) => {
          this.isBusinessColor = true;
          this.businessColor = { ...this.businessColor, bgColor: color.hexString };
        });
      }, 1);
    }
  }

  /****** business text color and background color input *******/
  businessColorInput(val: string, isFlag: number): void {
    const re = /[0-9A-Fa-f]{6}/g;
    if (!re.test(val)) {
      return;
    }
    if (isFlag === 1) {
      this.businessTxtColorPicker.color.hexString = val;
    } else if (isFlag === 2) {
      this.businessBgColorPicker.color.hexString = val;
    }
  }

  /****** big button text color and background color change ******/
  bigBtnColorPickerChange(active: number, isInit: boolean = false): void {
    if (this.bigBtnActive === active && !isInit) {
      return;
    }
    this.bigBtnActive = active;
    if (active === 1) {
      setTimeout(() => {
        this.bigBtnTxtColorPicker = iro.ColorPicker('#bigBtnTxtColorPicker', { width: 163, color: this.bigBtnColor.txtColor });
        this.bigBtnTxtColorPicker.on('color:change', (color: any) => {
          this.isBigBtnColor = true;
          this.bigBtnColor = { ...this.bigBtnColor, txtColor: color.hexString };
        });
      }, 1);
    } else if (active === 2) {
      setTimeout(() => {
        this.bigBtnBgColorPicker = iro.ColorPicker('#bigBtnBgColorPicker', { width: 163, color: this.bigBtnColor.bgColor });
        this.bigBtnBgColorPicker.on('color:change', (color: any) => {
          this.isBigBtnColor = true;
          this.bigBtnColor = { ...this.bigBtnColor, bgColor: color.hexString };
        });
      }, 1);
    }
  }

  /****** business text color and background color input *******/
  bigBtnColorInput(val: string, isFlag: number): void {
    const re = /[0-9A-Fa-f]{6}/g;
    if (!re.test(val)) {
      return;
    }
    if (isFlag === 1) {
      this.bigBtnTxtColorPicker.color.hexString = val;
    } else if (isFlag === 2) {
      this.bigBtnBgColorPicker.color.hexString = val;
    }
  }

  /****** add title input element ******/
  addTitleElement(evt: any): void {
    const len = this.titleDiv.nativeElement.querySelectorAll('input').length;
    const input: HTMLParagraphElement = this.renderer.createElement('input');
    input.className += 'form-control';
    this.renderer.appendChild(this.titleDiv.nativeElement, input);
    if (len === 2) {
      evt.target.closest('.add-title').remove();
      return; }
  }

  /****** add hours input element ******/
  addInputElement(id: any): void {
    const Item = this.dayToggleStatus.filter(x => x.id === id)[0];
    const updateItem = { ...Item, isAddHour: true };
    const index = this.dayToggleStatus.indexOf(Item);
    this.dayToggleStatus[index] = updateItem;
  }

  /****** input change in hour ******/
  handleChange(evt: any, isStart: string, id: string): void {
    if (isStart === 'end1' || isStart === 'end2') {
      this.closedTime = evt.target.value;
    }
    const Item = this.dayToggleStatus.filter(x => x.id === id)[0];
    const updateItem = { ...Item, [isStart]: evt.target.value };
    const index = this.dayToggleStatus.indexOf(Item);
    this.dayToggleStatus[index] = updateItem;
  }

}
