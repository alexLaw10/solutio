import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let navigationSubject: Subject<any>;

  beforeEach(async () => {
    navigationSubject = new Subject();
    const routerMock = {
      events: navigationSubject.asObservable(),
      url: '/home',
      navigate: jest.fn(),
      navigateByUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have menu items', () => {
    expect(component.menuItems).toBeDefined();
    expect(component.menuItems.length).toBeGreaterThan(0);
    expect(component.menuItems[0].route).toBe('/home');
  });

  it('should track by route', () => {
    const item = { route: '/home', label: 'Home', icon: 'home' };
    expect(component.trackByRoute(0, item)).toBe('/home');
  });

  it('should get active route for exact current route match', () => {
    component.currentRoute = '/home';
    expect(component.getActiveRoute('/home')).toBe('page');
  });

  it('should get active route for subroute', () => {
    component.currentRoute = '/home/details';
    expect(component.getActiveRoute('/home')).toBe('page');
  });

  it('should get active route for subroute with trailing slash', () => {
    component.currentRoute = '/home/subpage';
    expect(component.getActiveRoute('/home')).toBe('page');
  });

  it('should return null for inactive route', () => {
    component.currentRoute = '/home';
    expect(component.getActiveRoute('/other')).toBeNull();
  });

  it('should return null when currentRoute is empty', () => {
    component.currentRoute = '';
    expect(component.getActiveRoute('/home')).toBeNull();
  });

  it('should return null when route does not match and is not a subroute', () => {
    component.currentRoute = '/other/page';
    expect(component.getActiveRoute('/home')).toBeNull();
  });

  it('should update currentRoute on NavigationEnd event', () => {
    const event = new NavigationEnd(1, '/other', '/other');
    navigationSubject.next(event);
    
    expect(component.currentRoute).toBe('/other');
  });

  it('should handle multiple navigation events', () => {
    const event1 = new NavigationEnd(1, '/home', '/home');
    const event2 = new NavigationEnd(2, '/other', '/other');
    
    navigationSubject.next(event1);
    expect(component.currentRoute).toBe('/home');
    
    navigationSubject.next(event2);
    expect(component.currentRoute).toBe('/other');
  });

  it('should filter non-NavigationEnd events', () => {
    const initialRoute = component.currentRoute;
    const fakeEvent = { type: 'NavigationStart' };
    
    navigationSubject.next(fakeEvent);
    
    expect(component.currentRoute).toBe(initialRoute);
  });
});

