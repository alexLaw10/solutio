import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default size md', () => {
    expect(component.size).toBe('md');
  });

  it('should have default color primary', () => {
    expect(component.color).toBe('primary');
  });

  it('should have default fullScreen false', () => {
    expect(component.fullScreen).toBe(false);
  });

  it('should apply size classes correctly', () => {
    component.size = 'sm';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner--sm')).toBeTruthy();

    component.size = 'lg';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner--lg')).toBeTruthy();
  });

  it('should apply color classes correctly', () => {
    component.color = 'secondary';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner--secondary')).toBeTruthy();

    component.color = 'white';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner--white')).toBeTruthy();
  });

  it('should apply fullscreen class when fullScreen is true', () => {
    component.fullScreen = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner-wrapper--fullscreen')).toBeTruthy();
  });
});
