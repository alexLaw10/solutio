import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ThemeService } from './core/services/theme.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let themeService: jest.Mocked<ThemeService>;

  beforeEach(async () => {
    const themeServiceMock = {
      initializeTheme: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'dashboard'`, () => {
    expect(component.title).toEqual('dashboard');
  });

  it('should initialize theme on init', () => {
    component.ngOnInit();
    expect(themeService.initializeTheme).toHaveBeenCalled();
  });
});
