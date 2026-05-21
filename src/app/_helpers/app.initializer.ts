import { catchError, of, finalize, timeout } from 'rxjs';
import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    console.log('App Initializer: Starting...');
    return () => accountService.refreshToken()
        .pipe(
            timeout(5000), // Wait max 5 seconds for refresh token
            // catch error to start app even if refresh token fails or times out
            catchError((err) => {
                console.log('App Initializer: Refresh token failed, timed out, or no token found.');
                return of();
            }),
            finalize(() => {
                console.log('App Initializer: Completed.');
            })
        );
}