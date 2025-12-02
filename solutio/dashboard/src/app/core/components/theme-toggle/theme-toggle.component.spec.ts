import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService, Theme } from '../../services/theme.service';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: jest.Mocked<ThemeService>;

  beforeEach(async () => {
    const themeServiceMock = {
      getCurrentTheme: jest.fn(() => 'light' as Theme),
      toggleTheme: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ThemeToggleComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize current theme from service', () => {
      component.ngOnInit();
      expect(component.currentTheme).toBe('light');
      expect(themeService.getCurrentTheme).toHaveBeenCalled();
    });
  });

  describe('toggle', () => {
    it('should toggle theme and update current theme', () => {
      themeService.getCurrentTheme.mockReturnValue('dark');
      component.currentTheme = 'light';

      component.toggle();

      expect(themeService.toggleTheme).toHaveBeenCalled();
      expect(component.currentTheme).toBe('dark');
      expect(themeService.getCurrentTheme).toHaveBeenCalled();
    });

    it('should update theme after toggle', () => {
      component.currentTheme = 'light';
      themeService.getCurrentTheme.mockReturnValueOnce('dark');

      component.toggle();

      expect(themeService.toggleTheme).toHaveBeenCalled();
      expect(component.currentTheme).toBe('dark');
    });
  });
});
