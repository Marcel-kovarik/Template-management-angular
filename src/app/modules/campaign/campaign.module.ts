import { NgModule } from '@angular/core';

import { CampaignRoutingModule } from './campaign-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { SpeakAndCollectComponent } from './speak-and-collect/speak-and-collect.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { AdvancedSettingsComponent } from './advanced-settings/advanced-settings.component';


@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    SpeakAndCollectComponent,
    BreadcrumbComponent,
    AdvancedSettingsComponent
  ],
  exports: [
    BreadcrumbComponent
  ],
  imports: [
    SharedModule,
    CampaignRoutingModule
  ]
})
export class CampaignModule { }
