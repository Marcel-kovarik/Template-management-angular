import { Injectable } from '@angular/core';
import { Builtin } from '../classes/builtin';
import { BuiltinOption } from '../classes/builtin-option';
import { ListValue } from '../classes/list-value';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuiltinService {

  private builtinSubject = new BehaviorSubject<Builtin>(new Builtin());

  private baseUrl = environment.apiUrl + '/builtin';

  constructor(private http: HttpClient) { }

  /**
   * Return current builtin
   */
  get builtin(): Observable<Builtin> {
    return this.builtinSubject.asObservable();
  }

  /**
   * Mark builtin as current
   * @param code builtin code
   */
  setCurrentBuiltin(builtin: Builtin): void {
    this.builtinSubject.next(builtin);
  }

  /**
   * Get all builtin with optional limit
   * @param limit fixe the limit to be returned (0 for all)
   */
  getBuiltins(editorLang: string): Observable<Builtin[]> {
    return this.http.post<Builtin[]>(this.baseUrl + '/list', {languageEditor: editorLang});
  }

  /**
   * Get builtin by code
   * @param code builtin code
   */
  getBuiltinByCode(code: string, editorLang: string, conversationLang: string): Observable<Builtin> {
    return this.http.post<Builtin>(this.baseUrl + '/detail',
      {nodeBuiltinCode: code, languageEditor: editorLang, languageConversation: conversationLang})
      .pipe(map(builtin => {
        this.setCurrentBuiltin(builtin);
        return builtin;
      }));
  }
}
