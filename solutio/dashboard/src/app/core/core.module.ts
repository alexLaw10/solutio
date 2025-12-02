import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule, 
    HttpClientModule, 
    RouterModule,
    SharedModule
  ],
  declarations: [
    MainComponent, 
    NavbarComponent, 
    SidebarComponent, 
    ThemeToggleComponent
  ],
  exports: [
    MainComponent, 
    NavbarComponent, 
    SidebarComponent, 
    ThemeToggleComponent, 
    RouterModule,
    SharedModule
  ],
  providers: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}

