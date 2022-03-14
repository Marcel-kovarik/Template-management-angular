import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StatesService } from '../../services/states.service';
import { AudioRecorderService } from '../../services/audio-recorder.service';
import { AudioRecord } from '../../classes/audio-record';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { SecToTimePipe } from '../../pipes/sec-to-time.pipe';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
  providers: [SecToTimePipe]
})
export class RecorderComponent implements OnInit {

  /**
   * Emitter to update parent message in chat
   */
  @Output() message = new EventEmitter();

  /**
   * recoreding time left
   */
  remaining: number;

  /**
   * Boolean triggered when sending audio to avoid double request.
   */
  sending = false;

  /**
   *  1 : Default
   *  2 : Recording
   *  4 : Recorded
   *  8 : Listening
   */
  audioState = 1;

  /**
   * Container id that will receive the created player
   */
  playerContainerId: string;

  /**
   * Player id to be able to manipulate it
   */
  playerId: string;


  constructor(
    private statesService: StatesService,
    private audioRecorder: AudioRecorderService,
    private userService: UserService,
    private alertService: AlertService,
    private translate: TranslateService,
    private secToTime: SecToTimePipe
  ) {
    // The audio recorder service provide the id's thru two public variables
    this.playerContainerId  = this.audioRecorder.containerId;
    this.playerId           = this.audioRecorder.playerId;
  }

  ngOnInit(): void {
  }

  record(): void {
    this.audioRecorder.startRecording();
    this.audioRecorder.isRecording.subscribe(state => {
      if (state) {
        this.audioState = 2;
        this.message.emit({message: this.translate.instant('RECORDER.RECORDING')});
        this._recordingTimer(90);
      }
    });
  }

  stopRecording(): void {
    this.audioRecorder.stopRecording();
    this.message.emit({message: this.translate.instant('RECORDER.RECORDING_STOP')});
    this.audioState = 4;
    this.remaining = null;
  }

  delete(): void {
    this.message.emit({message: this.translate.instant('RECORDER.STAND_BY')});
    this.audioState = 1;
  }

  listen(): void {
    const player = this._getPlayer();
    player.addEventListener('ended', () => {
      this.stopListening();
    });
    (player as any).play();
    this.audioState = 12;
  }

  stopListening(): void {
    (this._getPlayer() as any).pause();
    this.audioState = 4;
  }

  reset(): void {
    this._getPlayer().remove();
    this.message.emit({message: this.translate.instant('RECORDER.STAND_BY')});
    this.audioState = 1;
  }

  send(): void {
    if (this.sending) {
      return;
    }

    this.sending = true;
    const audio = new AudioRecord();
    audio.audiodata = this.audioRecorder.getBase64Data();
    audio.email = this.userService.userValues.email;
    this.audioRecorder.sendAudio(audio).subscribe(state => {
      if (state) {
        this.alertService.success('OK', {autoClose: true});
        this.audioState = 1;
        this.message.emit({sent: true, message: this.translate.instant('RECORDER.MESSAGE_SENT')});
      } else {
        this.alertService.error('KO');
      }
      // this.message.emit({sent: true, message: this.translate.instant('RECORDER.STAND_BY')});
      this.sending = false;
    });
  }

  isDefault(): boolean {
    return this.statesService.isSet(this.audioState, 1);
  }

  isRecording(): boolean {
    return this.statesService.isSet(this.audioState, 2);
  }

  isRecorded(): boolean {
    return this.statesService.isSet(this.audioState, 4);
  }

  isListening(): boolean {
    return this.statesService.isSet(this.audioState, 8);
  }

  private _recordingTimer(timeInSec: number): void {
    const self = this;
    if (timeInSec) {
      setTimeout(() => {
        this.remaining ? self._recordingTimer(timeInSec - 1) : null;
      }, 1000);
      this.message.emit({message: this.secToTime.transform(timeInSec)});
      this.remaining = timeInSec;
    } else {
      this.stopRecording();
    }
  }

  private _getPlayer(): any {
    return document.getElementById(this.playerId);
  }

}
