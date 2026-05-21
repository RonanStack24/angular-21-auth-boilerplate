import { catchError, of, timeout } from 'rxjs';
import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => accountService.refreshToken()
        .pipe(
            // timeout after 5 seconds to ensure app starts even if backend is slow
            timeout(5000),
            // catch error to start app on success or failure
            catchError(() => of())
        );
}