import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [ListComponent, CreateComponent],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
