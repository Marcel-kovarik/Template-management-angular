import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { PasswordUpdateComponent } from './password-update/password-update.component';

const routes: Routes = [
  {path: 'not-used', component: ProfileComponent},
  {path: 'password', component: PasswordUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
