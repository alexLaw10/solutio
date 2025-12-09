import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { SidebarComponent } from './sidebar.component';

// Dummy component for routes
@Component({ template: '' })
class DummyComponent {}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;
  let navigationSubject: Subject<Event>;

  beforeEach(async () => {
    navigationSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    
    // Mock router.events BEFORE creating component so subscription uses our subject
    // This must be done before component creation because subscription happens in constructor
    Object.defineProperty(router, 'events', {
      get: () => navigationSubject.asObservable(),
      configurable: true,
      enumerable: true,
    });
    
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (navigationSubject && !navigationSubject.closed) {
      navigationSubject.complete();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty currentRoute', () => {
    expect(component.currentRoute).toBe('');
  });

  it('should have menu items', () => {
    expect(component.menuItems).toBeDefined();
    expect(component.menuItems.length).toBeGreaterThan(0);
    expect(component.menuItems[0]).toEqual({ label: 'Home', route: '/home', icon: 'home' });
  });

  it('should update currentRoute on NavigationEnd', fakeAsync(() => {
    // Wait a bit to ensure subscription is active
    tick();
    
    const navigationEnd = new NavigationEnd(1, '/home', '/home');
    navigationSubject.next(navigationEnd);
    tick();
    fixture.detectChanges();
    
    expect(component.currentRoute).toBe('/home');
  }));

  it('should track by route', () => {
    const item = { route: '/home', label: 'Home', icon: 'home' };
    const result = component.trackByRoute(0, item);
    expect(result).toBe('/home');
  });

  it('should return "page" for active route', () => {
    component.currentRoute = '/home';
    const result = component.getActiveRoute('/home');
    expect(result).toBe('page');
  });

  it('should return "page" for route that starts with current route', () => {
    component.currentRoute = '/home/details';
    const result = component.getActiveRoute('/home');
    expect(result).toBe('page');
  });

  it('should return null for inactive route', () => {
    component.currentRoute = '/home';
    const result = component.getActiveRoute('/about');
    expect(result).toBeNull();
  });

  it('should handle route with trailing slash', () => {
    component.currentRoute = '/home/';
    const result = component.getActiveRoute('/home');
    expect(result).toBe('page');
  });
});
