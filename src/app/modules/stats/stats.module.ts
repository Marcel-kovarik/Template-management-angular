import { NgModule } from '@angular/core';

import { StatsRoutingModule } from './stats-routing.module';
import { SharedModule } from '../shared/shared.module';
import { StatsComponent } from './stats/stats.component';


@NgModule({
  declarations: [StatsComponent],
  imports: [
    SharedModule,
    StatsRoutingModule
  ]
})
export class StatsModule { }
