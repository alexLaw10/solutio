import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'solutio-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public title = 'dashboard';

  constructor(private themeService: ThemeService) {}

  public ngOnInit(): void {
    this.themeService.initializeTheme();
  }
}
