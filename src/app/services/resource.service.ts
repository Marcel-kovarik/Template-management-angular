import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as data from './data/formatSpec.json';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResourceSpec } from '../classes/resource-spec';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  resourcesSpecData: any = (data as any).default;

  constructor(private http: HttpClient) {
  }

  getResourcesByFormatSpecCode(code: string): ResourceSpec[] {
    return this.resourcesSpecData[code];
  }

  getResourceByFormatId(id: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl + `/resource/ofFormat/${id}`);
  }

  createOne(resource): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/resource/create', resource);
  }

  createBulk(resources): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/resource/createOrUpdateBulk', resources);
  }
}
