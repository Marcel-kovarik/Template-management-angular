import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Credential } from '../classes/credential';
import { AuthResponse } from '../classes/auth-response';
import { ServerState } from '../classes/server-state';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public userModified: User;

  baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private persistenceService: PersistenceService
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(this.persistenceService.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValues(): User {
    return this.userSubject.value;
  }

  setUserObject(user: User): void {
    this.userSubject.next(user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + '/admin/users');
  }

  updateUserToken(newToken: string): void {
    this.userSubject.next({ ...this.userSubject.value, token: newToken });
  }

  basicAuth(credentials: Credential): Observable<User> {
    return this.http.post<AuthResponse>(this.baseUrl + '/auth/basic', credentials)
      .pipe(map(authResponse => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return this._setUser(authResponse);
      }));
  }

  oauthAuth(idToken: string): Observable<User> {
    return this.http.post<AuthResponse>(this.baseUrl + '/auth/oauth', { googleOAuthToken: idToken })
      .pipe(map(authResponse => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(authResponse);
        return this._setUser(authResponse);
      }));
  }

  googleCallBack(response: any): Observable<boolean> {
    return new Observable(observer => {
      this.oauthAuth(response.credential).subscribe(resp => {
        if (resp) {
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  logout(): void {
    // remove user from local storage and set current user to null
    this.persistenceService.clearAllItems();
    this.userSubject.next(null);
    // this.router.navigate(['/login']);
  }

  /**
   * Test if user is connected
   */
  isConnected(): boolean {
    return this.userSubject.value !== null;
  }

  private _setUser(authResponse: AuthResponse): User {
    authResponse.user.token = authResponse.token;
    authResponse.user.organisations = authResponse.organisations;
    authResponse.user = this.setCurrentOrganisation(authResponse.user);
    this.persistenceService.setItem('user', JSON.stringify(authResponse.user));
    this.setUserObject(authResponse.user);
    return authResponse.user;
  }

  deleteUserById(userId): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(environment.apiUrl + '/admin/users/' + userId);
  }

  newUser(user: User): Observable<ServerState> {
    return this.http.post<ServerState>(environment.apiUrl + '/admin/users',
      user);
  }

  updateUser(user: User): Observable<ArrayBuffer> {
    return this.http.put<ArrayBuffer>(environment.apiUrl + '/admin/users', user);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/admin/users/' + userId);
  }

  setCurrentOrganisation(user: User): User {
    // TODO: to be managed when multiple organisations
    user.currentOrganisation = user.organisations[0].id;
    return user;
  }

  updatePassword(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/user/password', data)
  }
}
