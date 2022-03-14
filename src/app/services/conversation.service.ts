import { Injectable } from '@angular/core';
import { Conversation } from '../classes/conversation';
import { Language } from '../classes/language';
import { Voice } from '../classes/voice';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConvFlowPack } from '../interfaces/convflow-models';
import { ConversationVersion } from '../classes/conversation-version';
import { map } from 'rxjs/operators';
import { UrlResponse } from '../interfaces/url-response';
import { ServerState } from '../classes/server-state';
import { PreviewResponse } from '../interfaces/preview-response';
import { FormatSettings } from '../classes/format-settings';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private baseUrl = environment.apiUrl + '/conversation';
  public hasSettingsUpdate = false;

  private currentFlowPack: ConvFlowPack;
  private currentConversation: Conversation;
  private currentVersion: ConversationVersion;

  private advancedSettingsSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) { }

  /**
   * return currently set conversation
   */
  getCurrentConversation(): Conversation {
    return this.currentConversation;
  }

  /**
   * Set conversation to current
   * @param conversation  Conversation
   */
  setCurrentConversation(conversation: Conversation): void {
    this.currentConversation = conversation;
  }

  /**
   * return latest version of conversation
   */
  getLatestVersion(): ConversationVersion {
    return this.currentVersion;
  }

  /**
   * Set latest version of current conversation
   * @param version  ConversationVersion
   */
  setLatestVersion(version: ConversationVersion): void {
    this.currentVersion = version;
  }

  /**
   * return packed conversation flow
   */
  getCurrentFlowPack(): ConvFlowPack {
    return this.currentVersion.representationModel;
  }

  /**
   * Set packed conversation flow to current
   * @param flowPack ConvFlowPack
   */
  setCurrentFlowPack(flowPack: ConvFlowPack): void {
    this.currentFlowPack = flowPack;
  }

  reset(): void {
    this.currentConversation = null;
    this.currentFlowPack = null;
  }

  /**
   * Return a the list of all conversations
   */
  getAllConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.baseUrl);
  }

  /**
   * Return a the list of all conversations
   */
  getAllUnlinkedConversations(): Observable<Conversation[]> {
    return this.http.post<Conversation[]>(this.baseUrl + '/unlinked', {});
  }

  /**
   * return conversation by requested ID
   * @param conversationId number
   */
  getConversationById(conversationId: number): Observable<Conversation> {
    return this.http.get<Conversation>(this.baseUrl + `/${conversationId}`)
      .pipe(map(conversation => {
        this.setCurrentConversation(conversation);
        return conversation;
      }));
  }

  /**
   * return latest flow version of current conversation
   */
  getLatestVersionOfConversation(): Observable<ConversationVersion> {
    return this.http.get<ConversationVersion>(this.baseUrl + `/${this.currentConversation.id}/version/latest`)
      .pipe(map(version => {
        this.setLatestVersion(version);
        return version;
      }));
  }

  /**
   * return all flow versions of current conversation
   */
  getAllVersionsOfConversation(): Observable<ConversationVersion[]> {
    return this.http.get<ConversationVersion[]>(this.baseUrl + `/${this.currentConversation.id}/version`);
  }

  /**
   * return one flow version of current conversation by version id
   * @param versionId number
   */
  getOneVersionByVersionId(versionId: number): Observable<ConversationVersion> {
    return this.http.get<ConversationVersion>(this.baseUrl + `/${this.currentConversation.id}/version/${versionId}`);
  }

  getPendingConversationErrors(conversationId: number, conversationVersionId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/${conversationId}/version/${conversationVersionId}/error`);
  }

  /**
   * Create the base object of a conversation
   * @param data any
   */
  createConversation(data: any): Observable<Conversation> {
    return this.http.post<Conversation>(this.baseUrl + '/create', data);
  }

  /**
   * Save the current conversation flow by creating a new version
   * @param id number
   * @param conversation ConvFlowPack
   */
  createConversationVersion(conversationId: number, conversation: ConvFlowPack, voice: string = ''): Observable<ConversationVersion> {
    // this.setLatestVersion(new ConversationVersion({representationModel : conversation, voiceId: voice}));
    return this.http.post<ConversationVersion>(this.baseUrl + `/${conversationId}/version/create`,
      new ConversationVersion({representationModel : conversation, voiceId: voice}))
      .pipe(map(response => {
        this.setLatestVersion(response);
        return response;
      }));
  }

  /**
   * Save the current conversation flow by creating a new version
   * @param id number
   * @param conversation ConvFlowPack
   */
  saveConversation(conversationId: number, conversation: ConvFlowPack, voice: string = ''): Observable<ConversationVersion> {
    // this.setLatestVersion(new ConversationVersion({representationModel : conversation, voiceId: voice}));
    return this.http.post<ConversationVersion>(this.baseUrl + `/${conversationId}/version/update`,
      new ConversationVersion({
        id: this.getLatestVersion().id,
        representationModel : conversation,
        voiceId: voice
      }))
      .pipe(map(response => {
        this.setLatestVersion(response);
        return response;
      }));
  }

  previewConversation(conversationId: number, versionId: number): Observable<PreviewResponse> {
    return this.http.post<PreviewResponse>(this.baseUrl + `/${conversationId}/version/${versionId}/preview`, {});
  }

  publishConversation(conversationId: number, versionId: number): Observable<ServerState> {
    return this.http.post<ServerState>(this.baseUrl + `/${conversationId}/version/${versionId}/production`, {});
  }

  /*****************************************************************
   * RELATED SERVICES
   *****************************************************************/

  /**
   * Get All languages available
   * @param appType string
   */
  getAvailableLanguage(appType: string): Observable<Language[]> {
    return this.http.post<Language[]>(this.baseUrl + '/language/available', {applicationType: appType});
  }

  /**
   * Get all voices for a selected language code and application type
   * @param appType string
   * @param code string
   */
  getVoicesByLanguageCode(appType: string, code: string): Observable<Voice[]> {
    return this.http.post<Voice[]>(this.baseUrl + '/voice/available', {applicationType: appType, languageCode: code});
  }

  /**
   * Get an audio voice sample. `data` contains languageCode, VoiceId and sentence to be read.
   * @param data any
   */
  getVoiceSample(data: any): Observable<string> {
    return this.http.post<UrlResponse>(environment.apiUrl + '/sampleaudio', data)
      .pipe(map( response => {
        return response.url;
      }));
  }

  public getSettings(): any {
    return this.advancedSettingsSubject.value;
  }

  setSettings(settings: any): void {
    this.advancedSettingsSubject.next(settings);
    this.hasSettingsUpdate = true;
  }

  getSettingsFromServer(conversationId: number, versionId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/${conversationId}/version/${versionId}/advancedsettings`)
      .pipe(map(settings => {
        this.advancedSettingsSubject.next(settings);
        return settings;
      }));
  }

  updateSettings(conversationId: number, versionId: number, data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/${conversationId}/version/${versionId}/advancedsettings`, data);
  }

  /**
   * Perform setting update on current version & conversation if setting recorded
   */
  recordCurrentSettings(): void {
    if (!this.hasSettingsUpdate) {
      return;
    }
    this.updateSettings(this.getCurrentConversation().id, this.getLatestVersion().id, this.getSettings()).subscribe();
  }

  resetCurrentConversationSettings(): Observable<ArrayBuffer> {
    const conversationId = this.getCurrentConversation().id;
    const versionId = this.getLatestVersion().id;
    return this.http.delete<ArrayBuffer>(this.baseUrl + `/${conversationId}/version/${versionId}/advancedsettings`)
      .pipe(map(response => {
        this.getSettingsFromServer(conversationId, versionId).subscribe();
        return response;
    }));
  }

}
