import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { MainComponent } from './main.component';
import { WeatherDataService } from '../../services/weather-data.service';
import { ThemeService, Theme } from '../../services/theme.service';

// Dummy component for routes
@Component({ template: '' })
class DummyComponent {}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    const errorSubject = new BehaviorSubject<string | null>(null);
    const weatherDataServiceMock = {
      getError$: jest.fn(() => errorSubject.asObservable()),
      clearError: jest.fn(),
    };

    const themeSubject = new BehaviorSubject<Theme>('light');
    const themeServiceMock = {
      getCurrentTheme: jest.fn(() => themeSubject.value),
      toggleTheme: jest.fn(),
      theme$: themeSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        MainComponent,
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent },
        ]),
      ],
      providers: [
        { provide: WeatherDataService, useValue: weatherDataServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
