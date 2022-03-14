import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
// import { AudioModule, AudioEntry } from 'audio-module';
// import { StateModule, states, balancedTernary } from 'player-state-module';
// import { SpeechModule } from 'speech-module';
// import { EventBusModule } from 'event-bus-module';
// import { Util, MetaManager, PromiseUtil } from 'player-util-module';
// import { ServiceModule } from 'player-service-module';
import { Chat } from '../../../interfaces/chat';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {

  @Output() doClose = new EventEmitter();

  @Input() conversationUrl: string;
  @Input() conversationId: string;
  @Input() conversationLang: string;

  data: Chat[] = [{class: 'server waiting', text: '', type: 'standard'}];

  conversationData = null;
  azureTokenUrl = environment.azureTokenUrl;
  checkPlayerUrl = environment.checkPlayerUrl;

  finConversation: boolean;
  appInitialized: boolean;
  initialized: boolean;
  waitingOnResponse: boolean;
  azureToken: string;
  noopTriggered: boolean;

  recognizer;
  audioSignal;
  stuckInTactile;
  interactionSignal;

  // serviceModule: ServiceModule;
  // audioModule: AudioModule;
  // metaManager: MetaManager;
  // promiseUtil: PromiseUtil;

  form: FormGroup;

  // Todo: microphone on/off
  useMicrophone = true;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {

    this.form = this.formBuilder.group({
      text: [''],
      url: [null]
    });

  }

  ngOnDestroy(): void {
    this.recognizer.stopListening();
    this.recognizer.doDestroy();

    this.finConversation = false;
    this.appInitialized = false;
    this.initialized = false;
    this.waitingOnResponse = false;
    this.noopTriggered = false;

    // StateModule.getApplicationState()._initAllStates();
    // StateModule.getApplicationState()._initDefaults();
  }

  ngOnInit(): void {
    console.log('INIT');
    /**
     * Conversation modules instantiation
     * Service, Audio & MetaManager
     */
    // this._setUrls();
    // this.serviceModule = new ServiceModule({
    //   endpointUrl: this.conversationUrl,
    //   checkPlayerUrl: this.checkPlayerUrl,
    //   azureTokenUrl: this.azureTokenUrl,
    //   applicationType: 'BUILDER_PREVIEW'
    // });
    // this.audioModule = new AudioModule();
    // this.metaManager = new MetaManager();
    //
    // /**
    //  * Set variables default values
    //  */
    // this.finConversation = false;
    // this.initialized = false;
    // this.noopTriggered = false;
    // this.azureToken = '';
    // this.waitingOnResponse = false;
    // this.conversationData = null;
    //
    // try {
    //   SpeechModule.createRecognition(this, (Util.isEdge() || Util.isSafari()))
    //     .then( recognizer => this.recognizer = recognizer );
    // } catch (e) {
    //   console.log('Error on MediaDevices', e);
    //   StateModule.getApplicationState().setState(states.NO_ACCESS, balancedTernary.TRUE);
    // }
    //
    //
    // // Load listeners
    // this._initEventListener();
    //
    // // Hook the callbacks
    // this._hookCallbacks();
    //
    // // Init the meta manger
    // this._initMetaManager();
    //
    // // Init the thing
    // StateModule.getApplicationState();
    //
    // // Perform prechecks
    // // MicrophonePrechecks.perform(this.serviceModule, 'BUILDER_PREVIEW');
    //
    // this.initialize();
  }

  // closeConversation(): void {
  //   this.audioModule.stop();
  //   this.doClose.emit();
  // }

  /**************************************************************************
   *********************** CONVERSATION METHODS *****************************
   * Initialize the controller
   * @param params
   */
  // initialize(): void {
  //   console.log('Initializing the application');
  //
  //   if (this.initialized) {
  //     return;
  //   }
  //
  //   // this.viewManager.removeSplashScreen();
  //
  //   console.log('initializing');
  //   // this.viewManager.initEvents(this);
  //
  //   if (Util.isSafari()) {
  //     this.audioModule.toggleVolumeFast();
  //   }
  //
  //   // this.initialized = true;
  //
  //   const self = this;
  //   // TODO : Add check if token is needed (this.recognizer.getMode() === 'AZURE')
  //   this.serviceModule.getAzureToken().then((response) => {
  //     self.azureToken = response.data.token;
  //   }).catch((reason) => {
  //     console.log('Error while fetching azure token', reason);
  //   }).finally(() => {
  //       PromiseUtil.onlyFinally(self.microClick(), () => {
  //         self.triggerWelcomeMessage(false);
  //         });
  //   });
  //
  //   this.appInitialized = true;
  //   console.log('done initializing the application');
  // }
  //
  // /**
  //  * Handle a microphone click
  //  * @returns {Promise<void>}
  //  */
  // async microClick(): Promise<void> {
  //   if (!this.useMicrophone) {
  //     return;
  //   }
  //   console.log('Clicked on microphone');
  //   const state = StateModule.getApplicationState();
  //   const self = this;
  //
  //   if (state.getState(states.NO_ACCESS) === balancedTernary.UNKNOWN) {
  //     console.log('Initializing micro');
  //     // this.viewManager.footerDisplay('mic-only', false);
  //
  //     let wasPlaying = false;
  //     if (this.audioModule.isPlaying()) {
  //       wasPlaying = true;
  //       this.audioModule.pause();
  //     }
  //
  //     let ok = false;
  //     try {
  //       const result = this.recognizer.initialize({
  //           language: this.conversationLang,
  //           vocalToken: this.azureToken
  //         });
  //
  //       if (result) {
  //         state.setState(states.NO_ACCESS, balancedTernary.FALSE);
  //         // this.viewManager.footerDisplay('mic-only', true);
  //         ok = true;
  //       } else {
  //         console.log('Error initializing audio');
  //         state.setState(states.NO_ACCESS, balancedTernary.TRUE);
  //       }
  //     } catch (e) {
  //       console.log('Error initializing audio', e);
  //       state.setState(states.NO_ACCESS, balancedTernary.TRUE);
  //     } finally {
  //       if (wasPlaying) {
  //         this.audioModule.unpause();
  //       }
  //
  //       if (! state.isNoAccess()) {
  //         state.switchState(states.TACTILE);
  //         // this.viewManager.footerDisplay('mic-only', true);
  //       }
  //       // this.viewManager.toggleMicrophoneAnimation(true);
  //     }
  //
  //     if (this.waitingOnResponse && ok) {
  //       Util.startAsync(() => {
  //         self.recognizer.startListening();
  //       });
  //     }
  //   } else {
  //     state.switchState(states.TACTILE);
  //     // this.viewManager.footerDisplay('mic-only',  !state.getState(states.TACTILE));
  //     if (this.waitingOnResponse && !state.getState(states.TACTILE)) {
  //       Util.startAsync(() => {
  //         self.recognizer.startListening();
  //       });
  //     }
  //   }
  // }
  //
  // suggestionClick(e): void  {
  //   if (this.initialized) {
  //     // TODO: microphone close action when suggestion click
  //   }
  //   this._removeMessageByClass('waiting-on-speech');
  //   if (e.url && e.url !== 'null') {
  //     window.open(e.url, '_blank');
  //   } else {
  //     this.audioModule.stop();
  //     this._createChatDisplay('reply', e);
  //     this._sendReplyToServer(e.text);
  //   }
  // }
  //
  // /**
  //  * Interface methode to populate values to `suggestionClick()`
  //  */
  // inputResponse(): void {
  //   this.suggestionClick(this.form.getRawValue());
  //   this.form.setValue({text: '', url: null});
  // }
  //
  // /**
  //  * Trigger welcome message
  //  * @param query {any}
  //  */
  // triggerWelcomeMessage(query): void {
  //
  //   if (Util.isSafari()) {
  //     this.audioModule.toggleVolumeFast();
  //   }
  //
  //   const  self = this;
  //
  //   let welcomeQuery = '';
  //   if (query) {
  //     welcomeQuery = query;
  //   }
  //
  //   // Send parent message to pause
  //   // if (parent.window.length !== 0 && this._parts.pmtarget!== undefined) {
  //   //   parent.window.postMessage("adnai:conversation-started", this._parts.pmtarget)
  //   //   console.log('PostMessage Sent to ' + this._parts.pmtarget);
  //   // }
  //
  //   this.serviceModule.getWelcomeMessage(welcomeQuery, 'BUILDER_PREVIEW')
  //     .then((response) => {
  //       this._removeMessageByClass('waiting');
  //       self._handleServerOKResponse(response);
  //       this.conversationData = response.conversationdata;
  //     }).catch((reason) => {
  //       self._serverNOKResponse(reason);
  //
  //   });
  //   // Remove listener if exist
  //   // if (window.removeHeaderListeners) {
  //   //   window.removeHeaderListeners();
  //   // }
  //   // if (window.removeBodyListeners) {
  //   //   window.removeBodyListeners();
  //   // }
  // }
  //
  // /**
  //  * Kill Process
  //  */
  // doDestroy(): void {
  //   this.recognizer.doDestory();
  // }
  //
  // /**
  //  * Switch Sound Off
  //  */
  // soundClick(): void {
  //   StateModule.getApplicationState().switchState(states.NO_AUDIO);
  // }
  //
  // mediaEnded(): void {
  //   this.metaManager.afterDispatch();
  //
  //   // Do nothing if the conversation ended
  //   if (this.finConversation) {
  //     return;
  //   }
  //
  //   this.waitingOnResponse = true;
  //
  //   const state = StateModule.getApplicationState();
  //   console.log('STATE', state.getState(states.TACTILE));
  //   if (state.getState(states.TACTILE) || !this.metaManager.getStartMicrophone()) {
  //     // Continue on tactile mode
  //     this._createChatDisplay('reply waiting-on-speech', {text: '', type: 'standard'});
  //     this.metaManager.resetStartMicrophone();
  //   } else {
  //     // Start listening open microphone
  //     this.recognizer.startListening();
  //   }
  // }
  //
  // /**
  //  * Actions triggered before audio is played
  //  * @param message
  //  */
  // doBeforePlay(message): void {
  //   this._removeMessageByClass('waiting-on-server');
  //   this._createChatDisplay('server', message);
  // }
  //
  // /**
  //  * Actions triggered when audio finish to play
  //  * @param message
  //  */
  // doAfterPlay(message): void {
  //   if (this.finConversation) {
  //     this.recognizer.doDestroy();
  //   }
  // }
  //
  // /**
  //  * -----  RecognitionResultCallback implementation -----
  //  */
  // onResult(transcript): void {
  //   this.recognizer.stopListening();
  //   this._removeMessageByClass('waiting-on-speech');
  //   console.log('TRANSCRIPT', transcript);
  //   if (transcript === undefined && !this.appInitialized) {
  //     return;
  //   }
  //   this._createChatDisplay('reply', {text: transcript, type: 'standard'});
  //   this._createChatDisplay('server waiting-on-server', {text: '', type: 'standard'});
  //
  //   this._sendReplyToServer(transcript);
  // }
  //
  // onError(error): void {
  //   console.error('error during transcript', JSON.stringify(error));
  //   if (arguments.length >= 1 && error.error === 'aborted') {
  //     // Ignore
  //     return;
  //   }
  //   console.error('error during transcript');
  //   this._removeMessageByClass('waiting-on-speech');
  //   this._removeMessageByClass('waiting-on-server');
  //
  //   this._sendReplyToServer('NOOP');
  // }
  //
  // onSpeechEnded(): void {
  //   this._removeMessageByClass('waiting-on-speech');
  //   // this.viewManager.hideAwaitingResponse('speech');
  // }
  //
  // onStartListening(): void {
  //   // Start microphone animation & add awaiting bubble
  //   this.initialized = true;
  //   this._createChatDisplay('reply waiting-on-speech', {text: '', type: 'standard'});
  // }
  //
  // onStopListening(): void {
  //   // Stop microphone animation
  //   this.initialized = false;
  // }
  //
  // private _createChatDisplay(eClass, e): void {
  //   const next: Chat = {
  //     text: e.text,
  //     class: eClass,
  //     type: e.type ? e.type : 'standard'
  //   };
  //
  //   if (e.suggestions) {
  //     next.suggestions = e.suggestions;
  //   }
  //   this.data.push(next);
  //
  //   // Chat component needs to be fully loaded for scroll to be efficient.
  //   const self = this;
  //   setTimeout(() => { self._scrollDown(); }, 50);
  // }
  //
  // /**
  //  * Send a reply to the server
  //  * @param query {string} the value to send
  //  * @private
  //  */
  // private _sendReplyToServer(query): void {
  //   this.waitingOnResponse = false;
  //   const self = this;
  //   const options: ReplyOptions = {
  //     conversationId: this.conversationId,
  //     text: query,
  //     language: this.conversationLang,
  //     metadata: [{
  //       key: 'CREATYPE',
  //       value: '300x600' // TODO: check data to insert here or delete
  //     }]
  //   };
  //   // Send conversationData if initialized
  //   if (this.conversationData !== null) {
  //     options.conversationdata = this.conversationData;
  //   }
  //   this.serviceModule.sendReply(options).then((response) => {
  //     self._handleServerOKResponse(response);
  //     this.conversationData = response.conversationdata;
  //   }).catch((reason) => {
  //     self.recognizer.stopListening();
  //     self._serverNOKResponse(reason);
  //   });
  // }
  //
  // /**
  //  * Handle server response
  //  * @param data
  //  * @private
  //  */
  // private _handleServerOKResponse(data): void {
  //   /*
  //    *  Hide the spinner
  //    */
  //   // this.viewManager.removeAwaitingResponse('server');
  //   // TODO: add or remove this foreach to use to turn on/off microphone
  //   if (!this.useMicrophone) {
  //     data.metadata.forEach((e, i) => {
  //       if (e.action === 'microphone') {
  //         data.metadata[i].value = false;
  //       }
  //     });
  //   }
  //
  //   this.metaManager.setMetas(data.metadata);
  //
  //   this.conversationId = data.token;
  //   this.finConversation = data.finconversation;
  //
  //   const messages = data.message;
  //   const audioEntries = [];
  //
  //   if (Array.isArray(messages)) {
  //     if (messages.length > 0) {
  //       messages.forEach((msg) => {
  //         let source = '';
  //         let imgText = '';
  //         const imgMetas = [];
  //
  //         // Audio messages
  //         if (msg.audios !== undefined) {
  //           if (msg.audios.length >= 1) {
  //             source = msg.audios[0].url;
  //           }
  //         } else if (msg.audio) {
  //           if (msg.audio.url !== undefined) {
  //             source = msg.audio.url;
  //           } else {
  //             source = msg.audio.base64;
  //           }
  //         }
  //
  //         // Visuals
  //         if (msg.visuels && msg.visuels.length) {
  //           msg.visuels.forEach(img => {
  //             imgText += '<img src="' + img.url + '">';
  //             imgMetas.push({
  //               type: 'display',
  //               action: 'image',
  //               value: img.url,
  //               position: 'after'
  //             });
  //           });
  //         }
  //
  //         if (source !== '') {
  //           // add audios and visual to text if present
  //           msg.text += imgText;
  //           audioEntries.push(new AudioEntry(source, msg));
  //
  //         } else if (msg.visuels && msg.visuels.length) {
  //           // case if no audio, visual is displayed as meta
  //           this.metaManager.setMetas(imgMetas);
  //         }
  //       });
  //     } else if (data.metadata.length > 0) {
  //       // If no text is added this will trigger
  //       // the afterdispatch of metadata to display img or link.
  //       this.audioModule.stop();
  //       this.metaManager.afterDispatch();
  //     }
  //   }
  //
  //   if (audioEntries.length > 0) {
  //     this.audioModule.unmute();
  //     this.audioModule.play(audioEntries);
  //   }
  // }
  //
  // /**
  //  * Handle inappropriate response
  //  * @param status
  //  * @private
  //  */
  // private _serverNOKResponse(status): void {
  //   console.log('Server NOK response', status);
  //
  //   this.initialized = false;
  //   this.finConversation = true;
  //
  //   this._removeMessageByClass('waiting');
  //   this._removeMessageByClass('waiting-on-server');
  //   this._createChatDisplay('server', {text: this.translate.instant('CONVERSATION.PREVIEW_ERROR'), type: 'standard'});
  //
  //   // this._removeMessageByClass('waiting');
  //   // this.viewManager.removeAwaitingResponse('server');
  //   // this.viewManager.removeAwaitingResponse('speech');
  //   // this.viewManager.newMessage('Service indisponible, merci de revenir un peu plus tard.', 'sent');
  // }
  //
  // /**
  //  * Event listener
  //  */
  // private _initEventListener(): void {
  //   const controller = this;
  //   EventBusModule.getApplicationBus().subscribe('state-updated', () => {
  //     const state = StateModule.getApplicationState();
  //
  //     /**
  //      * Handle Audio
  //      */
  //     // controller.viewManager.toggleActionButtons('sound', state.isAudioEnabled() ? 'on' : 'off');
  //     let audioSignal: string;
  //     if (state.isAudioEnabled()) {
  //       controller.audioModule.unmute();
  //       audioSignal = 'AUDIO_ON';
  //     } else {
  //       controller.audioModule.mute();
  //       audioSignal = 'AUDIO_OFF';
  //     }
  //
  //     if (controller.audioSignal !== audioSignal) {
  //       controller.audioSignal = audioSignal;
  //
  //       if (controller[audioSignal]) {
  //         // audioSignal = 'ADD_' + audioSignal;
  //       } else {
  //         controller[audioSignal] = audioSignal;
  //       }
  //
  //     }
  //
  //     /**
  //      * Handle Micro
  //      */
  //     // controller.viewManager.toggleActionButtons('micro', state.isTactile() ? 'off': 'on');
  //     // controller.viewManager.setMicrophoneButtonVisible(! state.isstuckInTactile());
  //
  //     /**
  //      * Handle return to tactile
  //      */
  //     if (state.isTactile() && state.getState(states.NO_ACCESS) !== balancedTernary.FALSE) {
  //       // controller.recognizer.stopListening();
  //       controller.recognizer.stopListening();
  //     }
  //
  //     /**
  //      * Stats
  //      */
  //     if (state.isStuckInTactile()) {
  //       if (controller.stuckInTactile === undefined) {
  //         controller.stuckInTactile = true;
  //       }
  //     } else {
  //       const evt = state.isTactile() ? 'INTERACTION_TACTILE' : 'INTERACTION_MICRO';
  //       if (controller.interactionSignal !== evt) {
  //         controller.interactionSignal = evt;
  //       }
  //     }
  //   });
  // }
  //
  // /**
  //  * Hook on the callbacks
  //  * @private
  //  */
  // private _hookCallbacks(): void {
  //   this.audioModule.onMediaEndedCallback = this;
  //   this.audioModule.playCallback = this;
  // }
  //
  // /**
  //  * Initialize the meta data manager
  //  * @private
  //  */
  // private _initMetaManager(): void {
  //   this.metaManager = new MetaManager();
  //   const self = this;
  //   this.metaManager.metaDisplay = (meta) => {
  //     if (meta.action === 'link') {
  //       // Delay display to be displayed after text
  //       setTimeout(() => {
  //         self._metaDisplay(meta);
  //         }, 50);
  //     } else {
  //       self._metaDisplay(meta);
  //     }
  //   };
  //
  //   this.metaManager.destroyCallback = () => {
  //     self.doDestroy();
  //   };
  // }
  //
  // private _removeMessageByClass(targetClass: string): void {
  //   this.data = this.data.filter(e => !e.class.split(' ').includes(targetClass));
  // }
  //
  // private _setUrls(): void {
  //   this.azureTokenUrl = this.azureTokenUrl.replace('{{CONV_CODE}}', this.conversationId);
  //   this.checkPlayerUrl = this.checkPlayerUrl.replace('{{CONV_CODE}}', this.conversationId);
  // }
  //
  // /**
  //  * Display bubble from metadata with link
  //  * @param meta {Object}
  //  */
  // private _metaDisplay(meta): void {
  //
  //   let display: boolean;
  //   const e: Chat = {text: '', class: 'server sent-meta', type: 'metadata'};
  //
  //   if (meta.action === 'link') {
  //     let attribs = ' target="_blank"';
  //     if (meta.attr !== undefined && meta.attr.length > 0) {
  //       meta.attr.forEach( attr => {
  //         attribs += ` ${attr.name}="${attr.value}"`;
  //       });
  //     }
  //     e.text = `<a href="${meta.value}"${attribs}>${meta.text !== undefined ? meta.text : meta.value}</a>`;
  //     display = true;
  //   } else if (meta.action === 'image') {
  //     e.text = `<img src="${meta.value}">`;
  //     display = true;
  //   } else if (meta.action === 'inputtext') {
  //     // this.footerDisplay('text-only', meta.value !== '0');
  //     // li = null;
  //     display = false;
  //   } else {
  //     e.text = meta.value;
  //     display = true;
  //   }
  //
  //   if (display) {
  //     this._createChatDisplay(e.class, e);
  //   }
  // }
  //
  // /**
  //  * Scroll down in the view
  //  */
  // private _scrollDown(): void {
  //   const container = document.getElementById('messages');
  //   if (container) {
  //     container.scroll(0, container.scrollHeight);
  //   }
  // }
}

export interface ReplyOptions {
  conversationId: string;
  text: string;
  language: string;
  metadata: ReplyOptionsMetadata[];
  conversationdata?: string;
}

export interface ReplyOptionsMetadata {
  key: string;
  value: string;
}
