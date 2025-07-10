import { Component } from '@angular/core';
import { SummaryFormComponent } from '../summary-form/summary-form.component';

/**
 * Home page component
 * Main landing page that contains the summary form
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SummaryFormComponent],
  template: `
    <div class="home-container">
      <app-summary-form></app-summary-form>
    </div>
  `,
  styles: [`
    .home-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class HomeComponent { } 