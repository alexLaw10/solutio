import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    const initialTheme = this.getInitialTheme();
    this.themeSubject = new BehaviorSubject<Theme>(initialTheme);
    this.theme$ = this.themeSubject.asObservable();
  }

  public initializeTheme(): void {
    // Verificar se o tema já foi aplicado pelo script no index.html
    const currentDataTheme = document.documentElement.getAttribute('data-theme') as Theme;
    
    if (currentDataTheme === 'light' || currentDataTheme === 'dark') {
      // Sincronizar o estado do serviço com o tema já aplicado
      this.themeSubject.next(currentDataTheme);
      return;
    }
    
    // Se não foi aplicado, aplicar agora
    const savedTheme = localStorage.getItem('theme') as Theme;
    const theme = savedTheme || this.getSystemTheme();
    this.setTheme(theme);
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return this.getSystemTheme();
  }

  public setTheme(theme: Theme): void {
    if (this.themeSubject.value === theme) {
      return;
    }

    this.themeSubject.next(theme);
    
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
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  public getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.getCurrentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
