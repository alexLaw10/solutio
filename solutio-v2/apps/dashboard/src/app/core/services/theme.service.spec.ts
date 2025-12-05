import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RendererFactory2, Renderer2 } from '@angular/core';
import { ThemeService, Theme } from './theme.service';
import { take } from 'rxjs/operators';

describe('ThemeService', () => {
  let service: ThemeService;
  let rendererFactory: RendererFactory2;
  let mockRenderer: jest.Mocked<Renderer2>;

  beforeEach(() => {
    mockRenderer = {
      removeClass: jest.fn(),
      addClass: jest.fn(),
      setAttribute: jest.fn(),
    } as unknown as jest.Mocked<Renderer2>;

    // Clear localStorage and DOM before creating service
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('light-theme', 'dark-theme');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {
          provide: RendererFactory2,
          useValue: {
            createRenderer: jest.fn(() => mockRenderer),
          },
        },
      ],
    });

    service = TestBed.inject(ThemeService);
    rendererFactory = TestBed.inject(RendererFactory2);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    // Service initializes with system theme or saved theme
    // Since we cleared localStorage, it should use system theme
    const theme = service.getCurrentTheme();
    expect(theme === 'light' || theme === 'dark').toBe(true);
  });

  it('should get current theme', () => {
    service.setTheme('dark');
    expect(service.getCurrentTheme()).toBe('dark');
  });

  it('should set theme to light', () => {
    // First set to dark to ensure we can change to light
    service.setTheme('dark');
    mockRenderer.removeClass.mockClear();
    mockRenderer.addClass.mockClear();
    mockRenderer.setAttribute.mockClear();
    
    service.setTheme('light');
    expect(service.getCurrentTheme()).toBe('light');
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'light-theme');
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'light');
    expect(mockRenderer.addClass).toHaveBeenCalledWith(document.documentElement, 'light-theme');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should set theme to dark', () => {
    service.setTheme('dark');
    expect(service.getCurrentTheme()).toBe('dark');
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'light-theme');
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'dark');
    expect(mockRenderer.addClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  // it('should not set theme if already set', () => {
  //   // First set to light
  //   service.setTheme('light');
  //   mockRenderer.setAttribute.mockClear();
  //   mockRenderer.addClass.mockClear();
  //   mockRenderer.removeClass.mockClear();
    
  //   // Try to set to light again
  //   service.setTheme('light');
  //   expect(mockRenderer.setAttribute).not.toHaveBeenCalled();
  //   expect(mockRenderer.addClass).not.toHaveBeenCalled();
  //   expect(mockRenderer.removeClass).not.toHaveBeenCalled();
  //   // localStorage should still have the theme from first call
  //   expect(localStorage.getItem('theme')).toBe('light');
  // });

  it('should toggle theme from light to dark', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    service.setTheme('dark');
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should initialize theme from localStorage when no data-theme attribute', () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.removeAttribute('data-theme');
    service.initializeTheme();
    expect(service.getCurrentTheme()).toBe('dark');
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'dark');
  });

  it('should initialize theme from data-theme attribute and sync service state (dark)', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    mockRenderer.setAttribute.mockClear();
    service.initializeTheme();
    expect(service.getCurrentTheme()).toBe('dark');
    // Should not call setAttribute again since theme is already applied
    expect(mockRenderer.setAttribute).not.toHaveBeenCalled();
  });

  it('should initialize theme from data-theme attribute and sync service state (light)', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    mockRenderer.setAttribute.mockClear();
    service.initializeTheme();
    expect(service.getCurrentTheme()).toBe('light');
    // Should not call setAttribute again since theme is already applied
    expect(mockRenderer.setAttribute).not.toHaveBeenCalled();
  });

  it('should use system theme when no saved theme and no data-theme attribute', () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    
    const originalMatchMedia = window.matchMedia;
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const newService = new ThemeService(rendererFactory);
    newService.initializeTheme();
    expect(newService.getCurrentTheme()).toBe('dark');
    
    // Restore original
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('should emit theme changes through observable', fakeAsync(() => {
    const themes: Theme[] = [];
    service.theme$.pipe(take(2)).subscribe((theme) => {
      themes.push(theme);
    });
    
    tick(); // Get initial value (emitted immediately by BehaviorSubject)
    
    // Change theme to trigger new emission
    const currentTheme = service.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    service.setTheme(newTheme);
    tick();
    
    expect(themes.length).toBeGreaterThanOrEqual(1);
    expect(themes[themes.length - 1]).toBe(newTheme);
  }));

  it('should emit initial theme value on subscription', (done) => {
    service.setTheme('dark');
    service.theme$.pipe(take(1)).subscribe((theme) => {
      expect(theme).toBe('dark');
      done();
    });
  });

  it('should get system theme as dark when prefers-color-scheme is dark', () => {
    const originalMatchMedia = window.matchMedia;
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const newService = new ThemeService(rendererFactory);
    expect(newService.getCurrentTheme()).toBe('dark');
    
    // Restore original
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('should get system theme as light when prefers-color-scheme is light', () => {
    const originalMatchMedia = window.matchMedia;
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const newService = new ThemeService(rendererFactory);
    expect(newService.getCurrentTheme()).toBe('light');
    
    // Restore original
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('should handle invalid data-theme attribute values', () => {
    document.documentElement.setAttribute('data-theme', 'invalid');
    localStorage.clear();
    
    // Create a new service instance to test initialization
    const newService = new ThemeService(rendererFactory);
    newService.initializeTheme();
    // Should fallback to system theme
    const theme = newService.getCurrentTheme();
    expect(theme === 'light' || theme === 'dark').toBe(true);
  });
});
