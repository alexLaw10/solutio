import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'solutio-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      (click)="toggle()" 
      class="theme-toggle"
      [attr.aria-label]="'Toggle theme'"
      type="button"
    >
      <span *ngIf="currentTheme === 'light'" class="theme-toggle__icon">🌙</span>
      <span *ngIf="currentTheme === 'dark'" class="theme-toggle__icon">☀️</span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      padding: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1.25rem;
      transition: transform 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .theme-toggle:hover {
      transform: scale(1.1);
    }
    
    .theme-toggle:active {
      transform: scale(0.95);
    }
    
    .theme-toggle__icon {
      display: inline-block;
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  public currentTheme: Theme = 'light';

  constructor(private themeService: ThemeService) {}

  public ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  public toggle(): void {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
  }
}

