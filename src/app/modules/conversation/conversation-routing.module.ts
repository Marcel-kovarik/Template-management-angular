import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewBuilderComponent } from './new-builder/new-builder.component';
import { QuitWarningGuard } from '../../_guard/quit-warning.guard';

const routes: Routes = [
  {path: 'editor', component: NewBuilderComponent, canDeactivate: [QuitWarningGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversationRoutingModule { }
