import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalDocument } from '../classes/legal-document';

@Injectable({
  providedIn: 'root'
})
export class LegalService {

  private baseUrl = environment.apiUrl + '/juridique';

  constructor(private http: HttpClient) { }

  getAll(): Observable<LegalDocument[]> {
    return this.http.get<LegalDocument[]>(this.baseUrl);
  }

  getDocumentById(id: number): Observable<LegalDocument> {
    return this.http.get<LegalDocument>(`${this.baseUrl}/${id}`);
  }

  updateDocument(id: number, data: LegalDocument): Observable<LegalDocument> {
    return this.http.put<LegalDocument>(`${this.baseUrl}/${id}`, data);
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  uploadDocument(document: LegalDocument): Observable<LegalDocument> {
    return this.http.post<LegalDocument>(this.baseUrl, document);
  }

  generateForm(document: LegalDocument): Observable<LegalDocument> {
    return this.http.post<LegalDocument>(this.baseUrl + `/${document.id}/rgpd/generate`, document.jsonData);
  }
}
