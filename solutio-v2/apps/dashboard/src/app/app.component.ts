import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainComponent } from './core/components/main/main.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, MainComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'solutio-v2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'dashboard';

  constructor(private themeService: ThemeService) {}

  public ngOnInit(): void {
    this.themeService.initializeTheme();
  }
}
