import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Component for displaying error messages
 * Shows error with retry button
 */
@Component({
  selector: 'app-error-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorCardComponent {
  public errorMessage = input<string | null>();
  public retry = output<void>();

  public onRetry(): void {
    this.retry.emit();
  }
} 