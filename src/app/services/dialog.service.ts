import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WhatNextComponent } from '../components/what-next/what-next.component';
import { WhatNext } from '../classes/what-next';
import { Confirm } from '../classes/confirm';
import { ConfirmComponent } from '../components/confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private modal: NgbModal) { }

  /**
   * Conform dialog box
   * @param message string
   * @param options any {title: string, okButton: string, cancelButton: string, size: string(lg|sm)}
   */
  public confirm(message: string, options?: any): Promise<boolean> {
    const confirm = new Confirm({...options, message});
    const modalRef = this.modal.open(ConfirmComponent, { size: confirm.size });
    modalRef.componentInstance.title = confirm.title;
    modalRef.componentInstance.message = confirm.message;
    modalRef.componentInstance.btnOkText = confirm.okButton;
    modalRef.componentInstance.btnCancelText = confirm.cancelButton;

    return modalRef.result;
  }

  /**
   * Manage different route according to answer supplied
   * @param message string
   * @param options any {title: string, message: string, answers: WhatNextAnswer, size: string(lg|sm)}
   */
  public whatNext(message: string, options?: any): void {
    const next = new WhatNext({...options, message});
    const modalRef = this.modal.open(WhatNextComponent, { size: next.size });
    modalRef.componentInstance.title = next.title;
    modalRef.componentInstance.message = next.message;
    modalRef.componentInstance.answers = next.answers;
  }
}
