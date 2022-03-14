import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleComponent } from './components/sample/sample.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './_guard/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'sample', component: SampleComponent, canActivate: [AuthGuard]},
  {
    path: 'campaigns',
    loadChildren: () => import('./modules/campaign/campaign.module').then(mod => mod.CampaignModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'conversation',
    loadChildren: () => import('./modules/conversation/conversation.module').then(mod => mod.ConversationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rgpd',
    loadChildren: () => import('./modules/rgpd/rgpd.module').then(mod => mod.RgpdModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'stats/:type',
    loadChildren: () => import('./modules/stats/stats.module').then(mod => mod.StatsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then(mod => mod.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(mod => mod.AdminModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
