import { Injectable } from '@angular/core';
import AudioRecorder from 'audio-recorder-polyfill';
import { BehaviorSubject, Observable } from 'rxjs';
import { AudioRecord } from '../classes/audio-record';
import { ServerState } from '../classes/server-state';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const MediaRecorder = AudioRecorder;

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {

  public playerId     = 'audio-player';
  public containerId  = 'player-container';

  private recorded;
  private recording       = new BehaviorSubject<boolean>(false);
  public isRecording: Observable<boolean> = this.recording.asObservable();

  private startTime: number;
  private endTime: number;

  private base64Audio;
  private stream;
  private recorder;
  private audio;

  constructor(private http: HttpClient) {}

  startRecording(): void {
    if (this.recorder) {
      return;
    }
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      this._setAudioElement();
      const self = this;
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        self.stream = stream;
        self.recorder =  new MediaRecorder(stream, {audioBitsPerSecond : 128000});

        this.recorder.addEventListener('dataavailable', e => {
          self.audio.src = URL.createObjectURL(e.data);
          document.getElementById(self.containerId).appendChild(self.audio);
          self._setData(e.data);
        });
        this.startTime = Date.now();
        this.recorder.start();
        this.recording.next(true);
      }).catch( error => {
        this.recorder = null;
        this.recording.next(false);
      });
    } else {
      // this.dashboardService.unsupportedPlatforms().subscribe(result => {
      //   let errorName = 'BrowserTooOld';
      //   let event = 'issue_incompatible';
      //   if (result.webview) {
      //     errorName = 'InWebApp';
      //     event = 'issue_webview';
      //   }
      //   this._manageErrorMessage({name: errorName});
      //   this.dashboardService.eventRecorder(event).subscribe();
      // });
    }
  }

  stopRecording(): void {
      this.recorder.stop();
      this.endTime = Date.now();
      this.recorder.stream.getTracks().forEach(i => i.stop());
      this.recording.next(false);
      this.recorder = null;
  }

  closeMicrophone(): void {
      // this.cloneStream.getTracks().forEach(i => i.stop());
      // this.cloneStream = null;
  }

  sendAudio(audio: AudioRecord): Observable<ServerState> {
    return this.http.post<ServerState>('https://borne.dna-i.com/borne/api/savequestiontalkin', audio);
  }

  getBase64Data(): string {
    return this.base64Audio;
  }

  getMessageTime(): number {
    return Math.round((this.endTime - this.startTime) / 1000);
  }

  private _setAudioElement(): void {
    this.audio          = document.createElement('audio');
    this.audio.id       = this.playerId;
    this.audio.controls = 'controls';
    this.audio.type     = 'audio/wave';
  }

  private _setData(data): void {
    this.recorded = new FileReader();
    this.recorded.readAsDataURL(data);

    const self = this;
    this.recorded.onloadend = () => {
      self.base64Audio = self.recorded.result;
    };
  }

}
