import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Creation } from '../classes/creation';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServerState } from '../classes/server-state';
import { PersistenceService } from './persistence.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreationService {


  private baseUrl = environment.apiUrl + '/creation';

  private currentCreationState = new BehaviorSubject<number>(null);
  private creationSubject = new BehaviorSubject<Creation>(new Creation());
  private creation: Observable<Creation>;

  constructor(
    private http: HttpClient,
    private persistenceService: PersistenceService) {
  }

  public getState(): number {
    if (this.currentCreationState.value === null || this.currentCreationState.value <= 1) {
      return 0;
    }
    return this.currentCreationState.value;
  }

  public getCurrentCreation(): Creation {
    if (Object.keys(this.creationSubject.value).length === 0) {
      const creation = this.persistenceService.checkCreation();
      if (creation) {
        return creation;
      }
    }
    return this.creationSubject.value;
  }

  setCurrentCreation(creation: Creation): void {
    this.creationSubject.next(creation);
    this.currentCreationState.next(creation.state);
    this.creation = this.creationSubject.asObservable();
    this.persistenceService.setItem('currentCreation', JSON.stringify(creation));
  }

  updateCurrentCreation(next?: (r) => void): void {
    const id = this.creationSubject.value.id;
    this.getCreationById(id).subscribe(r => {
      if (next) { next(r); }
    });
  }

  getCreationById(id: number): Observable<Creation> {
    return this.http.get<Creation>(environment.apiUrl + `/creation/${id}` )
      .pipe(map(creation => {
        this.setCurrentCreation(creation);
        return creation;
      }));
  }

  /**
   * Create creation
   * @param data must contain campaignId, creationType and name keys
   */
  create(data: Partial<Creation>): Observable<Creation> {
    return this.http.post<Creation>(this.baseUrl + '/create', data);
  }

  /**
   * Update creation
   * @param data must contain id of creation to update and name keys
   */
  update(data: Partial<Creation>): Observable<Creation> {
    return this.http.post<Creation>(this.baseUrl + '/updateName', data).pipe(map(creation => {
      this.setCurrentCreation(creation);
      return creation;
    }));
  }

  /**
   * Delete a creation by the id
   * @param creationId id of the creation
   */
  delete(creationId: number): Observable<ServerState> {
    return this.http.post<ServerState>(this.baseUrl + '/delete', {id: creationId});
  }

  publishCreation(creationId: number): Observable<ServerState> {
    return this.http.post<ServerState>(this.baseUrl + `/${creationId}/deploy`, {});
  }

  linkConversation(conversation: number, creation: number): Observable<ServerState> {
    return this.http.post<ServerState>(environment.apiUrl + '/link/creationToConversation',
      {conversationId: conversation, creationId: creation});
  }
}
