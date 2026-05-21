import { catchError, of } from 'rxjs';
import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    // return a function that returns an observable
    // we don't wait for the refresh token to complete to avoid blocking the UI
    return () => {
        accountService.refreshToken()
            .pipe(catchError(() => of()))
            .subscribe();
        return of(true);
    };
}