import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './components/alert/alert.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { PercentagePipe } from './pipes/percentage.pipe';
import { SpeedPipe } from './pipes/speed.pipe';

@NgModule({
  declarations: [
    AlertComponent,
    DateFormatPipe,
    PercentagePipe,
    SpeedPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    DateFormatPipe,
    PercentagePipe,
    SpeedPipe
  ]
})
export class SharedModule { }

