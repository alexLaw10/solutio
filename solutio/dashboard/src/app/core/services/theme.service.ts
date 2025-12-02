import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: Theme = 'light';

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const theme = savedTheme || this.getSystemTheme();
    this.setTheme(theme);
  }

  public setTheme(theme: Theme): void {
    this.currentTheme = theme;
    
    this.renderer.removeClass(document.documentElement, 'light-theme');
    this.renderer.removeClass(document.documentElement, 'dark-theme');
    this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
    
    if (theme === 'dark') {
      this.renderer.addClass(document.documentElement, 'dark-theme');
    } else {
      this.renderer.addClass(document.documentElement, 'light-theme');
    }
    
    localStorage.setItem('theme', theme);
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  public getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
