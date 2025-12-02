import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { AlertComponent } from './alert.component';
import { WeatherDataService } from '../../../core/services/weather-data.service';
import { BehaviorSubject } from 'rxjs';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let _weatherDataService: jest.Mocked<WeatherDataService>;
  let errorSubject: BehaviorSubject<string | null>;

  beforeEach(async () => {
    errorSubject = new BehaviorSubject<string | null>(null);

    const weatherDataServiceMock = {
      getError$: jest.fn(() => errorSubject.asObservable()),
      clearError: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [
        ChangeDetectorRef,
        { provide: WeatherDataService, useValue: weatherDataServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    _weatherDataService = TestBed.inject(WeatherDataService) as jest.Mocked<WeatherDataService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show alert when error is emitted', () => {
    const errorMessage = 'Erro ao carregar dados';
    errorSubject.next(errorMessage);
    fixture.detectChanges();

    expect(component.errorMessage).toBe(errorMessage);
    expect(component.showAlert).toBe(true);
  });

  it('should hide alert when error is cleared', () => {
    errorSubject.next('Erro inicial');
    fixture.detectChanges();
    
    errorSubject.next(null);
    fixture.detectChanges();

    expect(component.errorMessage).toBeNull();
    expect(component.showAlert).toBe(false);
  });

  it('should close alert when closeAlert is called', () => {
    errorSubject.next('Erro ao carregar');
    fixture.detectChanges();
    
    component.closeAlert();
    fixture.detectChanges();

    expect(component.showAlert).toBe(false);
    expect(component.errorMessage).toBeNull();
  });
});

