import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MaxPointsSelectComponent } from './max-points-select.component';

@Component({
  template: `
    <app-max-points-select 
      [maxPoints]="maxPoints"
      [hasError]="hasError"
      [errorMessage]="errorMessage"
      (maxPointsChange)="onMaxPointsChange($event)"
      (blur)="onBlur()">
    </app-max-points-select>
  `,
  standalone: true,
  imports: [MaxPointsSelectComponent, FormsModule]
})
class TestHostComponent {
  maxPoints = 5;
  hasError = false;
  errorMessage = '';
  
  onMaxPointsChange(points: number) {}
  onBlur() {}
}

describe('MaxPointsSelectComponent', () => {
  let component: MaxPointsSelectComponent;
  let fixture: ComponentFixture<MaxPointsSelectComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    
    fixture = TestBed.createComponent(MaxPointsSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display select element', () => {
    const selectElement = hostFixture.nativeElement.querySelector('select');
    expect(selectElement).toBeTruthy();
  });

  it('should display label', () => {
    const labelElement = hostFixture.nativeElement.querySelector('label');
    expect(labelElement).toBeTruthy();
  });

  it('should have correct options', () => {
    const options = hostFixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(0);
  });
}); 