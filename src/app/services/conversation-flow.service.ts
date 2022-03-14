import { Injectable } from '@angular/core';
import { ConvFlowPack } from '../interfaces/convflow-models';

@Injectable({
  providedIn: 'root'
})
export class ConversationFlowService {

  private currentFlow: ConvFlowPack;

  constructor() { }

  getCurrentFlow(): ConvFlowPack {
    return this.currentFlow;
  }




}
