import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;
  let navigationSubject: Subject<any>;

  beforeEach(async () => {
    navigationSubject = new Subject();

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: SidebarComponent }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    // Mock router.events to use our subject
    Object.defineProperty(router, 'events', {
      get: () => navigationSubject.asObservable(),
      configurable: true
    });

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (navigationSubject && !navigationSubject.closed) {
      navigationSubject.complete();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with empty currentRoute', () => {
      expect(component.currentRoute).toBe('');
    });

    it('should have menu items', () => {
      expect(component.menuItems).toBeDefined();
      expect(component.menuItems.length).toBeGreaterThan(0);
      expect(component.menuItems[0]).toEqual({
        label: 'Home',
        route: '/home',
        icon: 'home'
      });
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render sidebar element with correct attributes', () => {
      const sidebarElement: DebugElement = fixture.debugElement.query(By.css('.sidebar'));
      expect(sidebarElement).toBeTruthy();
      expect(sidebarElement.nativeElement.getAttribute('id')).toBe('navigation');
      expect(sidebarElement.nativeElement.getAttribute('role')).toBe('complementary');
      expect(sidebarElement.nativeElement.getAttribute('aria-label')).toBe('Menu de navegação lateral');
    });

    it('should render navigation element', () => {
      const navElement: DebugElement = fixture.debugElement.query(By.css('.sidebar__nav'));
      expect(navElement).toBeTruthy();
      expect(navElement.nativeElement.getAttribute('aria-label')).toBe('Navegação secundária');
    });

    it('should render menu list with correct role', () => {
      const menuElement: DebugElement = fixture.debugElement.query(By.css('.sidebar__menu'));
      expect(menuElement).toBeTruthy();
      expect(menuElement.nativeElement.getAttribute('role')).toBe('list');
    });

    it('should render menu items', () => {
      const menuItems: DebugElement[] = fixture.debugElement.queryAll(By.css('.sidebar__item'));
      expect(menuItems.length).toBe(component.menuItems.length);
    });

    it('should render menu item links with correct attributes', () => {
      const linkElement: DebugElement = fixture.debugElement.query(By.css('.sidebar__link'));
      expect(linkElement).toBeTruthy();
      expect(linkElement.nativeElement.getAttribute('role')).toBe('menuitem');
    });

    it('should render menu item labels', () => {
      const labelElement: DebugElement = fixture.debugElement.query(By.css('.sidebar__label'));
      expect(labelElement).toBeTruthy();
      expect(labelElement.nativeElement.textContent.trim()).toBe('Home');
    });

    it('should render list items with correct role', () => {
      const listItems: DebugElement[] = fixture.debugElement.queryAll(By.css('.sidebar__item'));
      listItems.forEach(item => {
        expect(item.nativeElement.getAttribute('role')).toBe('none');
      });
    });
  });

  describe('trackByRoute', () => {
    it('should return route as trackBy value', () => {
      const item = { route: '/home', label: 'Home', icon: 'home' };
      expect(component.trackByRoute(0, item)).toBe('/home');
    });

    it('should return different routes for different items', () => {
      const item1 = { route: '/home', label: 'Home', icon: 'home' };
      const item2 = { route: '/about', label: 'About', icon: 'info' };
      expect(component.trackByRoute(0, item1)).toBe('/home');
      expect(component.trackByRoute(1, item2)).toBe('/about');
    });
  });

  describe('getActiveRoute', () => {
    it('should return "page" for exact current route match', () => {
      component.currentRoute = '/home';
      fixture.detectChanges();
      expect(component.getActiveRoute('/home')).toBe('page');
    });

    it('should return "page" for subroute', () => {
      component.currentRoute = '/home/details';
      fixture.detectChanges();
      expect(component.getActiveRoute('/home')).toBe('page');
    });

    it('should return "page" for subroute with trailing slash', () => {
      component.currentRoute = '/home/subpage';
      fixture.detectChanges();
      expect(component.getActiveRoute('/home')).toBe('page');
    });

    it('should return null for inactive route', () => {
      component.currentRoute = '/home';
      fixture.detectChanges();
      expect(component.getActiveRoute('/other')).toBeNull();
    });

    it('should return null when currentRoute is empty', () => {
      component.currentRoute = '';
      fixture.detectChanges();
      expect(component.getActiveRoute('/home')).toBeNull();
    });

    it('should return null when route does not match and is not a subroute', () => {
      component.currentRoute = '/other/page';
      fixture.detectChanges();
      expect(component.getActiveRoute('/home')).toBeNull();
    });

    it('should handle route with trailing slash in currentRoute', () => {
      component.currentRoute = '/home/';
      fixture.detectChanges();
      expect(component.getActiveRoute('/home')).toBe('page');
    });
  });

  describe('Navigation Events', () => {
    it('should update currentRoute on NavigationEnd event', () => {
      const event = new NavigationEnd(1, '/other', '/other');
      navigationSubject.next(event);
      fixture.detectChanges();
      
      expect(component.currentRoute).toBe('/other');
    });

    it('should handle multiple navigation events', () => {
      const event1 = new NavigationEnd(1, '/home', '/home');
      const event2 = new NavigationEnd(2, '/other', '/other');
      
      navigationSubject.next(event1);
      fixture.detectChanges();
      expect(component.currentRoute).toBe('/home');
      
      navigationSubject.next(event2);
      fixture.detectChanges();
      expect(component.currentRoute).toBe('/other');
    });

    it('should filter non-NavigationEnd events', () => {
      const initialRoute = component.currentRoute;
      const fakeEvent = { type: 'NavigationStart' };
      
      navigationSubject.next(fakeEvent);
      fixture.detectChanges();
      
      expect(component.currentRoute).toBe(initialRoute);
    });

    it('should update aria-current attribute when route changes', () => {
      component.currentRoute = '/home';
      fixture.detectChanges();
      
      const linkElement: DebugElement = fixture.debugElement.query(By.css('.sidebar__link'));
      // Verify that getActiveRoute returns 'page' for active route
      expect(component.getActiveRoute('/home')).toBe('page');
      // The template uses [attr.aria-current]="getActiveRoute(item.route)"
      const ariaCurrent = linkElement.nativeElement.getAttribute('aria-current');
      expect(ariaCurrent).toBe('page');
    });

    it('should remove aria-current attribute when route is inactive', () => {
      component.currentRoute = '/other';
      fixture.detectChanges();
      
      const linkElement: DebugElement = fixture.debugElement.query(By.css('.sidebar__link'));
      // Verify that getActiveRoute returns null for inactive route
      expect(component.getActiveRoute('/home')).toBeNull();
      // The aria-current should be null when route doesn't match
      const ariaCurrent = linkElement.nativeElement.getAttribute('aria-current');
      expect(ariaCurrent).toBeNull();
    });
  });

  describe('Change Detection', () => {
    it('should update view when currentRoute changes', () => {
      component.currentRoute = '/home';
      fixture.detectChanges();
      
      let linkElement: DebugElement = fixture.debugElement.query(By.css('.sidebar__link'));
      // The aria-current is set by getActiveRoute method, which is called in the template
      const ariaCurrent = linkElement.nativeElement.getAttribute('aria-current');
      expect(ariaCurrent).toBe('page');
      
      component.currentRoute = '/other';
      fixture.detectChanges();
      
      linkElement = fixture.debugElement.query(By.css('.sidebar__link'));
      // When route doesn't match, getActiveRoute returns null, so aria-current should be null
      const ariaCurrentAfter = linkElement.nativeElement.getAttribute('aria-current');
      // Note: routerLinkActive might add the active class, but aria-current should be null
      expect(component.getActiveRoute('/home')).toBeNull();
    });
  });
});

