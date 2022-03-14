import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrganisationRoutingModule} from './organisation-routing.module';
import {ListComponent} from './list/list.component';
import {SharedModule} from '../../shared/shared.module';
import {CreateComponent} from './create/create.component';


@NgModule({
  declarations: [ListComponent, CreateComponent],
  imports: [
    CommonModule,
    OrganisationRoutingModule,
    SharedModule
  ]
})
export class OrganisationModule {
}
