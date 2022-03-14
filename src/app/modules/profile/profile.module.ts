import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { PasswordUpdateComponent } from './password-update/password-update.component';


@NgModule({
  declarations: [ProfileComponent, PasswordUpdateComponent],
  imports: [
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
