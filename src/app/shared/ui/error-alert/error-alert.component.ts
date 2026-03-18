import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.scss',
})
export class ErrorAlertComponent {
  @Input() title = 'Request failed';
  @Input() message = 'Something went wrong. Please try again.';
  @Input() compact = false;
  @Input() showRetry = false;
  @Input() retryLabel = 'Retry';
  @Output() retry = new EventEmitter<void>();
}
