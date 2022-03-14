import { Injectable } from '@angular/core';
import { Campaign } from '../classes/campaign';
import { Creation } from '../classes/creation';
import { FormatService } from './format.service';
import { Format } from '../classes/format';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {


  constructor() { }

  setItem(key: string, value: any): void {
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  getItem(key: string): any {
    return sessionStorage.getItem(key);
  }

  clearAllItems(): void {
    sessionStorage.clear();
  }

  checkCampaign(): Campaign {
    let campaign = this.getItem('currentCampaign');
    if (campaign !== undefined && campaign !== null) {
      campaign = JSON.parse(campaign);
    }
    return campaign;
  }

  checkCreation(): Creation {
    let creation = this.getItem('currentCreation');
    if (creation !== undefined && creation !== null) {
      creation = JSON.parse(creation);
    }
    return creation;
  }

  checkFormat(service: FormatService): Format {
    let format = this.getItem('currentFormat');
    if (format !== undefined && format !== null) {
      format = JSON.parse(format);
      service.setCurrentFormat(format);
    }
    return format;
  }

}
