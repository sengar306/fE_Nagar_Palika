import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  getMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage =
        error.error?.message ||
        error.error?.error ||
        error.error?.body?.message ||
        error.message;

      if (typeof apiMessage === 'string' && apiMessage.trim()) {
        return apiMessage;
      }

      if (error.status === 0) {
        return 'Server se connect nahi ho pa raha. Please internet ya API status check kijiye.';
      }
    }

    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return fallback;
  }
}
