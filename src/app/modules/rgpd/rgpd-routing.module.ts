import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RgpdComponent } from './rgpd/rgpd.component';
import { FormGeneratorComponent } from './form-generator/form-generator.component';

const routes: Routes = [
  {path: '', component: RgpdComponent},
  {path: 'generator/:id', component: FormGeneratorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RgpdRoutingModule { }
