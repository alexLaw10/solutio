import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertComponent } from './alert.component';
import { WeatherDataService } from '../../../core/services/weather-data.service';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let weatherDataService: jest.Mocked<WeatherDataService>;
  let errorSubject: BehaviorSubject<string | null>;

  beforeEach(async () => {
    errorSubject = new BehaviorSubject<string | null>(null);

    const weatherDataServiceMock = {
      getError$: jest.fn(() => errorSubject.asObservable()),
      clearError: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AlertComponent],
      providers: [
        { provide: WeatherDataService, useValue: weatherDataServiceMock },
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    weatherDataService = TestBed.inject(WeatherDataService) as jest.Mocked<WeatherDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with no error', () => {
    expect(component.errorMessage).toBeNull();
    expect(component.showAlert).toBe(false);
  });

  it('should show alert when error is received', fakeAsync(() => {
    fixture.detectChanges();
    
    errorSubject.next('Network error');
    tick();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Network error');
    expect(component.showAlert).toBe(true);
  }));

  it('should hide alert when error is cleared', fakeAsync(() => {
    fixture.detectChanges();
    
    errorSubject.next('Network error');
    tick();
    fixture.detectChanges();
    expect(component.showAlert).toBe(true);

    errorSubject.next(null);
    tick();
    fixture.detectChanges();

    expect(component.errorMessage).toBeNull();
    expect(component.showAlert).toBe(false);
  }));

  it('should close alert and clear error', fakeAsync(() => {
    fixture.detectChanges();
    
    errorSubject.next('Network error');
    tick();
    fixture.detectChanges();
    expect(component.showAlert).toBe(true);

    component.closeAlert();
    tick();
    fixture.detectChanges();

    expect(component.showAlert).toBe(false);
    expect(component.errorMessage).toBeNull();
    expect(weatherDataService.clearError).toHaveBeenCalled();
  }));

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
