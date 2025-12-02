import { TestBed } from '@angular/core/testing';
import { RendererFactory2 } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockRenderer: any;
  let localStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRenderer = {
      removeClass: jest.fn(),
      addClass: jest.fn(),
      setAttribute: jest.fn(),
      removeAttribute: jest.fn()
    };

    const mockRendererFactory = {
      createRenderer: jest.fn(() => mockRenderer)
    };

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: RendererFactory2, useValue: mockRendererFactory }
      ]
    });

    service = TestBed.inject(ThemeService);

    localStorageSpy = jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'setItem');
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
        dispatchEvent: jest.fn()
      }))
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentTheme', () => {
    it('should return light theme by default', () => {
      expect(service.getCurrentTheme()).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('should set light theme', () => {
      service.setTheme('light');

      expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'light-theme');
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'light');
      expect(mockRenderer.addClass).toHaveBeenCalledWith(document.documentElement, 'light-theme');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(service.getCurrentTheme()).toBe('light');
    });

    it('should set dark theme', () => {
      service.setTheme('dark');

      expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'light-theme');
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'dark');
      expect(mockRenderer.addClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(service.getCurrentTheme()).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      service.setTheme('light');
      jest.clearAllMocks();

      service.toggleTheme();

      expect(service.getCurrentTheme()).toBe('dark');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'dark');
    });

    it('should toggle from dark to light', () => {
      service.setTheme('dark');
      jest.clearAllMocks();

      service.toggleTheme();

      expect(service.getCurrentTheme()).toBe('light');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'light');
    });
  });

  describe('initializeTheme', () => {
    it('should initialize with saved theme from localStorage', () => {
      localStorageSpy.mockReturnValue('dark');
      jest.clearAllMocks();

      service.initializeTheme();

      expect(localStorageSpy).toHaveBeenCalledWith('theme');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'dark');
      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should initialize with light theme when no saved theme', () => {
      localStorageSpy.mockReturnValue(null);
      jest.clearAllMocks();

      service.initializeTheme();

      expect(localStorageSpy).toHaveBeenCalledWith('theme');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'light');
      expect(service.getCurrentTheme()).toBe('light');
    });
  });
});
