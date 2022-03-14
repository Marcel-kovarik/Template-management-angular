import { NgModule } from '@angular/core';

import { RgpdComponent } from './rgpd/rgpd.component';
import { SharedModule } from '../shared/shared.module';
import { RgpdRoutingModule } from './rgpd-routing.module';
import { FormGeneratorComponent } from './form-generator/form-generator.component';


@NgModule({
  declarations: [
    RgpdComponent,
    FormGeneratorComponent
  ],
  imports: [
    SharedModule,
    RgpdRoutingModule
  ]
})
export class RgpdModule { }
