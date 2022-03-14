import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { WhatNextAnswer } from '../../classes/what-next-answer';

@Component({
  selector: 'app-what-next',
  templateUrl: './what-next.component.html',
  styleUrls: ['./what-next.component.scss']
})
export class WhatNextComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() answers: WhatNextAnswer[] = [];

  constructor(private modal: NgbActiveModal, private router: Router) { }

  ngOnInit(): void {
  }

  answerClick(answer: string): void {
    this.modal.close(answer);
    this.router.navigate([answer]).then();
  }

  dismiss(): void {
    this.modal.dismiss();
  }

  mlog(x): void {
    console.log(x);
  }

}
