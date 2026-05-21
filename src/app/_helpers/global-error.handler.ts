import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        const message = error?.message || error?.toString() || '';

        // Suppress specific browser extension/messaging errors that are outside of app control
        if (message.includes('A listener indicated an asynchronous response') || 
            message.includes('message channel closed')) {
            return;
        }

        // Log other errors to console as usual
        console.error(error);
    }
}
