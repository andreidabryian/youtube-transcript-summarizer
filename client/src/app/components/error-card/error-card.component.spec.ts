import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorCardComponent } from './error-card.component';

@Component({
  template: `
    <app-error-card [errorMessage]="errorMessage"></app-error-card>
  `,
  standalone: true,
  imports: [ErrorCardComponent]
})
class TestHostComponent {
  errorMessage = 'Test error message';
}

describe('ErrorCardComponent', () => {
  let component: ErrorCardComponent;
  let fixture: ComponentFixture<ErrorCardComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    
    fixture = TestBed.createComponent(ErrorCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message', () => {
    const errorElement = hostFixture.nativeElement.querySelector('[data-testid="error-message"]');
    expect(errorElement.textContent).toContain('Test error message');
  });

  it('should display custom error message', () => {
    hostComponent.errorMessage = 'Custom error message';
    hostFixture.detectChanges();
    
    const errorElement = hostFixture.nativeElement.querySelector('[data-testid="error-message"]');
    expect(errorElement.textContent).toContain('Custom error message');
  });
}); 