import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  getLastStatistics(count: number): any {
    return [
      {id: 1, label: 'Tic Tac printemps 2020', type: 'crea-web', format: '300x600', engagement: 145865},
      {id: 2, label: 'Tic Tac printemps 2020', type: 'crea-web', format: '300x250', engagement: 201502},
      {id: 3, label: 'Recettes au Nutella', type: 'assistant', format: 'Alexa', engagement: 78543}
    ];
  }
}
