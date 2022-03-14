import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  /**
   * NEW : not used for now (first bit) 1
   */
  NEW         = 0b1;

  /**
   * IN PROGRESS : the element is missing some required elements (second bit) 2
   */
  IN_PROGRESS = 0b10;

  /**
   * READY : all elements required are completed (third bit) 4
   */
  READY       = 0b100;

  /**
   * PUBLISHED : Element is published, accessible from outside (fourth bit) 8
   */
  PUBLISHED   = 0b1000;

  /**
   * PREVIEW : Element is ready to be previewed (fifth bit) 16
   */
  PREVIEW     = 0b10000;

  /**
   * UPDATED : Some changes have been made after publication (sixth bit) 32
   */
  UPDATED     = 0b100000;

  /**
   * DEPLOYMENT : State used while creation is being deployed on servers, before `PUBLISHED` (seventh bit) 64
   */
  DEPLOYMENT     = 0b1000000;

  /**
   * Receive default state of element
   * @private
   */
  private currentState: number;


  constructor() {
    /* tslint:disable:no-bitwise */
  }

  set state(state: number) {
    this.currentState = state;
  }

  get state(): number {
    return this.currentState;
  }

  isSet(k: number, n: number): boolean {
    return (k & n) === n;
  }

  hasNew(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k & this.NEW) === this.NEW;
  }

  hasInProgress(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k & this.IN_PROGRESS) === this.IN_PROGRESS;
  }

  hasReady(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k & this.READY) === this.READY;
  }

  hasXReady(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k === this.READY);
  }

  hasPublished(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k & this.PUBLISHED) === this.PUBLISHED;
  }

  hasXPublish(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k === this.PUBLISHED);
  }

  hasDeployment(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k & this.DEPLOYMENT) === this.DEPLOYMENT;
  }

  hasXDeployment(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k === this.DEPLOYMENT);
  }

  hasPreview(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k & this.PREVIEW) === this.PREVIEW;
  }

  hasUpdated(k?: number): boolean {
    k = k !== undefined ? k : this.currentState;
    return (k === undefined) ? false : (k & this.UPDATED) === this.UPDATED;
  }

}
