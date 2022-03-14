import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-need-help',
  templateUrl: './need-help.component.html',
  styleUrls: ['./need-help.component.scss']
})
export class NeedHelpComponent implements OnInit {

  clicked = false;
  conversation = [];

  constructor() { }

  ngOnInit(): void {
    this.conversation = [
      {
        class: 'server',
        text: 'HELP.SERVER_MESSAGE',
        type: 'standardGE'
      },
      {
        class: 'reply recorder',
        text: 'RECORDER.STAND_BY',
        type: 'standard'
      }
    ];
  }

  triggerBot(): void {
    this.clicked = !this.clicked;
  }

}
