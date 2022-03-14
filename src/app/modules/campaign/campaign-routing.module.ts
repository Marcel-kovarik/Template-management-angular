import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { SpeakAndCollectComponent } from './speak-and-collect/speak-and-collect.component';


const routes: Routes = [
  {path: 'list', component: ListComponent},
  {path: 'edit', component: EditComponent},
  {path: 'speak-and-collect', component: SpeakAndCollectComponent},
  {
    path: 'formats',
    loadChildren: () => import('./format/format.module').then(mod => mod.FormatModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
