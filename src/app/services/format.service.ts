import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormatSpec } from '../classes/format-spec';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Format } from '../classes/format';
import { ServerState } from '../classes/server-state';
import { map } from 'rxjs/operators';
import { FormatSettings } from '../classes/format-settings';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  private formatSubject = new BehaviorSubject<Format>(new Format());
  private format: Observable<Format>;
  private advancedSettingSubject = new BehaviorSubject<FormatSettings[]>([]);

  constructor(
    private http: HttpClient,
    private persistenceService: PersistenceService) {
  }

  public getCurrentFormat(): Format {
    return this.formatSubject.value;
  }

  public getAdvancedSettings(): FormatSettings[] {
    return this.advancedSettingSubject.value;
  }

  setCurrentFormat(format: Format): void {
    this.formatSubject.next(format);
    this.format = this.formatSubject.asObservable();
    this.persistenceService.setItem('currentFormat', JSON.stringify(format));
  }

  createFormat(data: any): Observable<Format> {
    return this.http.post<Format>(environment.apiUrl + '/format/create', data);
  }

  updateCurrentFormat(next?: () => any): void {
    this.getFormatById(this.formatSubject.value.id).subscribe( format => {
      this.setCurrentFormat(format);
      if (next) {
        next();
      }
    });
  }

  delete(formatId: number): Observable<ServerState> {
    return this.http.post<ServerState>(environment.apiUrl + '/format/delete', {id: formatId});
  }

  getFormatById(id: number): Observable<Format> {
    return this.http.get<Format>(environment.apiUrl + `/format/${id}`)
      .pipe(map(format => {
        this.setCurrentFormat(format);
        return format;
      }));
  }

  getAllFormatsByCreationId(id: number): Observable<Format[]> {
    return this.http.get<Format[]>(environment.apiUrl + `/format/forCreation/${id}`);
  }

  getAllFormatSpec(): Observable<FormatSpec[]> {
    return this.http.get<FormatSpec[]>(environment.apiUrl + '/format/spec');
  }

  updateStateFormat(id: number, stateToUpdate: number, newValue: boolean): Observable<Format> {
    return this.http.post<Format>(environment.apiUrl + `/etat/format/${id}`, { state: stateToUpdate, value: newValue ? 1 : 0 })
      .pipe(map(format => {
        this.getFormatById(id).subscribe();
        return format;
      }));
  }

  deployFormat(id: number): Observable<ServerState> {
    return this.http.post<ServerState>(environment.apiUrl + `/format/${id}/deploy`, {});
  }

  setAdvancedSettings(settings: FormatSettings[]): void {
    this.advancedSettingSubject.next(settings);
  }

  getAdvancedSettingsByFormatId(id: number): Observable<FormatSettings[]>{
    return this.http.get<FormatSettings[]>(environment.apiUrl + `/format/${id}/advancedsetting`)
      .pipe(map(settings => {
        this.advancedSettingSubject.next(settings);
        return settings;
        }
      ));
  }

  updateAdvancedSettingsByFormatId(id: number, setting: FormatSettings): Observable<FormatSettings> {
    let callUri = environment.apiUrl + `/format/${id}/advancedsetting`;
    if (setting.id && setting.id !== 0) {
      callUri += `/${setting.id}`;
      delete setting.id;
      delete setting.formatId;
    }
    return this.http.post<FormatSettings>(callUri, setting);
  }

  deleteAdvancedSettingsById(formatId: number, settingId: number): Observable<ServerState> {
    return this.http.delete<ServerState>(environment.apiUrl + `/format/${formatId}/advancedsetting/${settingId}`);
  }

}
