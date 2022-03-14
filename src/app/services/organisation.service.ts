import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Organisation} from '../classes/organisation';
import {Observable} from 'rxjs';
import {ServerState} from '../classes/server-state';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  baseUrl = environment.apiUrl;

  public organisationModified: Organisation;

  constructor(private http: HttpClient) {
  }

  getAllOrganisations(): Observable<Organisation[]> {
    return this.http.get<Organisation[]>(this.baseUrl + '/admin/organisations');
  }

  deleteOrganisationById(organisationId: number): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(environment.apiUrl + '/admin/organisations/' + organisationId);
  }

  newOrganisation(organisation: Organisation): Observable<ServerState> {
    return this.http.post<ServerState>(environment.apiUrl + '/admin/organisations/create',
      organisation);
  }

  updateOrganisation(organisation: Organisation): Observable<ArrayBuffer> {
    return this.http.put<ArrayBuffer>(environment.apiUrl + '/admin/organisations/update', organisation);
  }


  getOrganisationById(organisationId: number): Observable<Organisation> {
    return this.http.get<Organisation>(this.baseUrl + '/admin/organisations/' + organisationId);
  }
}
