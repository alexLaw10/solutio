import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'solutio-v2-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      (click)="toggle()" 
      class="theme-toggle"
      [attr.aria-label]="'Toggle theme'"
      [attr.aria-pressed]="currentTheme === 'dark'"
      type="button"
    >
      <span class="theme-toggle__icon">{{ currentTheme === 'light' ? '🌙' : '☀️' }}</span>
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
      color: var(--design-system-text-primary);
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
export class ThemeToggleComponent implements OnInit, OnDestroy {
  public currentTheme: Theme = 'light';
  private themeSubscription?: Subscription;

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
      this.cdr.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  public toggle(): void {
    this.themeService.toggleTheme();
  }
}
