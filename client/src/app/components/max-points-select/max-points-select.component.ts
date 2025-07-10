import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Component for max points selection
 * Handles dropdown for selecting number of summary points
 */
@Component({
  selector: 'app-max-points-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './max-points-select.component.html',
  styleUrls: ['./max-points-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaxPointsSelectComponent {
  public maxPoints = input.required<number>();
  public hasError = input.required<boolean>();
  public errorMessage = input.required<string>();

  public maxPointsChange = output<number>();
  public blur = output<void>();

  public onMaxPointsChange(value: number): void {
    this.maxPointsChange.emit(value);
  }

  public onBlur(): void {
    this.blur.emit();
  }
} 