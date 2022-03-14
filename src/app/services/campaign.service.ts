import { Injectable } from '@angular/core';
import { Campaign } from '../classes/campaign';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ServerState } from '../classes/server-state';
import { map } from 'rxjs/operators';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private baseUrl = environment.apiUrl + '/campaign';

  private campaignSubject = new BehaviorSubject(new Campaign());
  public campaign: Observable<Campaign>;

  constructor(private http: HttpClient, private persistenceService: PersistenceService) {
  }

  public getCurrentCampaign(): Campaign {
    if (Object.keys(this.campaignSubject.value).length === 0) {
      const campaign = this.persistenceService.checkCampaign();
      if (campaign) {
        this.getCampaignById(campaign.id);
        return campaign;
      }
    }
    return this.campaignSubject.value;
  }

  public updateCurrentCampaign(): void {
    if (this.campaignSubject.value.id) {
      this.getCampaignById(this.campaignSubject.value.id).subscribe();
    }
  }

  /******************* CAMPAIGN METHODS *******************/
  /**
   * Get all campaigns form server
   */
  getAllCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.baseUrl);
  }

  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(this.baseUrl + `/${id}`).pipe(map( campaign => {
      this.setCurrentCampaign(campaign);
      return campaign;
    }));
  }

  /**
   * Place selected campaign to current
   * @param id campiang id
   */
  setCurrentCampaign(campaign: Campaign): void {
    this.campaignSubject.next(campaign);
    this.campaign = this.campaignSubject.asObservable();
    this.persistenceService.setItem('currentCampaign', JSON.stringify(campaign));
  }

  /**
   * Create new campaign
   * @param data string name of campaign
   */
  create(data: string): Observable<Campaign> {
    // Register new campaign
    return this.http.post<Campaign>(this.baseUrl + '/create', {name: data});
  }

  /**
   * Update campaign
   * @param data id & name to update
   */
  update(data: Partial<Campaign>): Observable<Campaign> {
    return this.http.post<Campaign>(this.baseUrl + '/updateName', data);
  }

  /**
   * Methode to duplicate a campaign
   * @param data id of campaign to duplicate & name of new copy
   */
  duplicateCampaign(data: Partial<Campaign>): Observable<Campaign> {
      return this.http.post<Campaign>(this.baseUrl + '/duplicate', data);
  }

  /**
   * Delete campaign with di
   * @param campaignId number
   */
  deleteCampaignById(campaignId: number): Observable<ServerState> {
    return this.http.post<ServerState>(environment.apiUrl + '/campaign/delete', {id: campaignId});
  }
}
