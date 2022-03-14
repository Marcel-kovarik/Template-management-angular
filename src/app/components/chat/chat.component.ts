import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Chat } from '../../interfaces/chat';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Output() suggestionClick = new EventEmitter();

  @Input() data: Chat[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  log(c): void {
    console.log(c);
  }

  setRecorderMessage(event: any): void {
    if (event.sent !== undefined && event.sent) {
      this.data.pop();
      this.data.push({
          class: 'reply',
          text: event.message
        });
    } else {
      this.data[1].text = event.message;
    }
  }

  triggerSuggestion(obj): void {
    this.suggestionClick.emit(obj);
  }

  hasImage(e): boolean {
    let result = false;
    if (e !== undefined && e.length > 0) {
      e.forEach(child => {
        if (child.image !== null) {
          result =  true;
        }
      });
    }
    return result;
  }

  scrollListener(event: WheelEvent): void {
    event.preventDefault();
    (event.target as Element).closest('.scroll-suggest').scrollLeft += event.deltaY;
  }

}
