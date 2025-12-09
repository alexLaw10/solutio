import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService, Theme } from '../../services/theme.service';
import { BehaviorSubject } from 'rxjs';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: ThemeService;
  let themeSubject: BehaviorSubject<Theme>;

  beforeEach(async () => {
    themeSubject = new BehaviorSubject<Theme>('light');
    
    const themeServiceMock = {
      getCurrentTheme: jest.fn(() => themeSubject.value),
      toggleTheme: jest.fn(() => {
        const newTheme = themeSubject.value === 'light' ? 'dark' : 'light';
        themeSubject.next(newTheme);
      }),
      theme$: themeSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current theme', () => {
    fixture.detectChanges();
    expect(component.currentTheme).toBe('light');
    expect(themeService.getCurrentTheme).toHaveBeenCalled();
  });

  it('should subscribe to theme changes', () => {
    fixture.detectChanges();
    expect(component.currentTheme).toBe('light');
    
    themeSubject.next('dark');
    fixture.detectChanges();
    expect(component.currentTheme).toBe('dark');
  });

  it('should toggle theme when button is clicked', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should display moon icon when theme is light', () => {
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.theme-toggle__icon');
    expect(icon?.textContent).toContain('🌙');
  });

  it('should display sun icon when theme is dark', () => {
    themeSubject.next('dark');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.theme-toggle__icon');
    expect(icon?.textContent).toContain('☀️');
  });

  it('should have correct aria attributes', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Toggle theme');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('should set aria-pressed to true when theme is dark', () => {
    themeSubject.next('dark');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    const themeSubscription = component['themeSubscription'];
    if (!themeSubscription) {
      throw new Error('themeSubscription should be defined');
    }
    const unsubscribeSpy = jest.spyOn(themeSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
