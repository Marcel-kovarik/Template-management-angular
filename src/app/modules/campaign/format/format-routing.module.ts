import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { ComposeComponent } from './compose/compose.component';
import { ImageComponent } from './image/image.component';
import { QuitWarningGuard } from '../../../_guard/quit-warning.guard';

const routes: Routes = [
  {path: 'list', component: ListComponent},
  {path: 'edit', component: EditComponent},
  {path: 'compose', component: ComposeComponent, canDeactivate: [QuitWarningGuard]},
  {path: 'color', component: ImageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormatRoutingModule { }
