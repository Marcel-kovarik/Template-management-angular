import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Section } from '../../../../interfaces/convflow-models';

@Component({
  selector: 'app-node-section-list',
  templateUrl: './node-section-list.component.html',
  styleUrls: ['./node-section-list.component.scss']
})
export class NodeSectionListComponent implements OnInit {

  @Input() sections: Section[] = [];
  @Input() key: number;

  @Output() sectionEdit = new EventEmitter<any>();
  @Output() sectionRemove = new EventEmitter<any>();

  player = null;
  playing = [];

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Edit a section by edit button a click
   * @param key number
   * @param id string
   */
  edit(key: number, id: string): void {
    this.sectionEdit.emit({sectionKey: key, sectionId: id});
  }

  /**
   * Remove a section by remove button a click
   * @param key number
   * @param id string
   */
  remove(key: number, id: string): void {
    this.sectionRemove.emit({sectionKey: key, sectionId: id});
  }

  /**
   * Trigger audio with play, pause, restart button click
   * @param id string
   * @param action string
   * @param src string
   */
  audioControls(id: string, action: string, src?: string): void {
    // const audio = document.getElementById(id) as HTMLAudioElement;
    if (action === 'play') {
      if (this.player !== null) {
        this._resetPlayer();
      }
      this.player = new Audio(src);
      this.player.play();
      this.playing[id] = true;
      const self = this;
      this.player.addEventListener('ended', () => {
        self.playing = [];
      });
    } else if (this.player !== null) {
      if ('stop') {
        this._resetPlayer();
      } else if (action === 'restart') {
        this.player.currentTime = 0;
      }
    }
  }

  /**
   * clear all playing audio
   * @private
   */
  private _resetPlayer(): void {
    this.player.pause();
    this.player = null;
    this.playing = [];
  }

}
