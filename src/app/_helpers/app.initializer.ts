import { catchError, of } from 'rxjs';
import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => accountService.refreshToken()
        .pipe(
            // catch error to start app even if refresh token fails
            catchError(() => of())
        );
}