import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import {CommonModule } from '@angular/common';

import { AgmCoreModule } from '@agm/core';
import { CamelizePipe } from 'ngx-pipes';
import { MapService } from './map.service';

@NgModule({
  declarations: [
    MapComponent
  ],
  exports: [
    MapComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyDgYqMKlidj4rz3sc7MO3vZCGC1AEsvZfM'
      }),
      CommonModule
  ],
  providers: [
    MapService,
    CamelizePipe
  ]
})
export class MapModule { }
