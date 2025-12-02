import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { homeRoutes } from './home.routes';
import { TableComponent } from './components/table/table.component';
import { KpiComponent } from './components/kpi/kpi.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DonutsComponent } from './components/donuts/donuts.component';
import { BarComponent } from './components/bar/bar.component';
import { AreaComponent } from './components/area/area.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [HomeComponent, TableComponent, KpiComponent, DonutsComponent, BarComponent, AreaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),  
    ReactiveFormsModule,
    FormsModule,
    NgApexchartsModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}

