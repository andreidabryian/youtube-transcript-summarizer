import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { VideoUrlInputComponent } from './video-url-input.component';

@Component({
  template: `
    <app-video-url-input 
      [videoUrl]="videoUrl" 
      [hasError]="hasError"
      [errorMessage]="errorMessage"
      (videoUrlChange)="onUrlChange($event)"
      (blur)="onBlur()">
    </app-video-url-input>
  `,
  standalone: true,
  imports: [VideoUrlInputComponent, FormsModule]
})
class TestHostComponent {
  videoUrl = '';
  hasError = false;
  errorMessage = '';
  
  onUrlChange(url: string) {}
  onBlur() {}
}

describe('VideoUrlInputComponent', () => {
  let component: VideoUrlInputComponent;
  let fixture: ComponentFixture<VideoUrlInputComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    
    fixture = TestBed.createComponent(VideoUrlInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display input field', () => {
    const inputElement = hostFixture.nativeElement.querySelector('input[type="url"]');
    expect(inputElement).toBeTruthy();
  });

  it('should display error message when hasError is true', () => {
    hostComponent.hasError = true;
    hostComponent.errorMessage = 'Ошибка!';
    hostFixture.detectChanges();
    const errorElement = hostFixture.nativeElement.querySelector('[data-testid="video-url-error"]');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Ошибка!');
  });
}); 