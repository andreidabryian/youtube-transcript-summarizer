import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Main application component
 * Provides the overall layout and structure of the application
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public readonly title = 'youtube-transcript-summarizer';
} 